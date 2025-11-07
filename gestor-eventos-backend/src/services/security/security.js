import db from '../../config/db.js';
import queries from '../../config/queries.json' with { type: 'json' };

const permissionMap = new Map();

/**
 * Carga todos los permisos en memoria para alto rendimiento
 */
export async function loadAllPermissions() {
  const res = await db.query(queries.permisos.loadAll); // <-- Actualizado
  
  permissionMap.clear();
  for (const row of res.rows) {
    const key = `${row.rol_id}-${row.nombre.toLowerCase()}`;
    permissionMap.set(key, true);
  }
}

/**
 * Verifica si un rol tiene permiso usando el cache
 */
function getPermissionFromCache(rol_id, metodo_nombre) {
  const key = `${rol_id}-${metodo_nombre.toLowerCase()}`;
  return permissionMap.has(key);
}

/**
 * Verifica si el usuario tiene permiso para ejecutar el método
 */
export async function verificarPermiso(usuario_id, metodo_nombre) {
  const metodoRes = await db.query(
    queries.metodos.getByName, // <-- Actualizado
    [metodo_nombre]
  );
  const metodo = metodoRes.rows[0];
  if (!metodo) throw new Error(`Método no encontrado: ${metodo_nombre}`);

  const usuarioRes = await db.query(
    queries.usuarios.getRolById, // <-- Actualizado
    [usuario_id]
  );
  const usuario = usuarioRes.rows[0];
  if (!usuario) throw new Error(`Usuario no válido: ${usuario_id}`);

  if (permissionMap.size > 0) {
    return getPermissionFromCache(usuario.rol_id, metodo.nombre);
  }

  const permisoRes = await db.query(
    queries.permisos.getPermisoDirecto, // <-- Actualizado
    [usuario.rol_id, metodo.id]
  );
  const permiso = permisoRes.rows[0];
  return permiso?.permitido === true;
}

/**
 * Registra la transacción en la tabla tx
 */
export async function registrarTransaccion(usuario_id, metodo_id, estado, detalle) {
  await db.query(
    queries.transacciones.insert, // <-- Actualizado
    [usuario_id, metodo_id, estado, detalle]
  );
}

/**
 * Audita accesos fallidos
 */
export async function auditarAccesoFallido(usuario_id, metodo_nombre, motivo) {
  const metodoRes = await db.query(
    queries.metodos.getIdByName, // <-- Actualizado
    [metodo_nombre]
  );
  const metodo = metodoRes.rows[0];
  await registrarTransaccion(usuario_id, metodo?.id || null, 'denegado', motivo);
}

/**
 * Ejecuta el método de forma controlada
 */
export async function ejecutarMetodoControlado(usuario_id, metodo_nombre, params, metodoEjecutable) {
  const tienePermiso = await verificarPermiso(usuario_id, metodo_nombre);
  
  const metodoRes = await db.query(
    queries.metodos.getIdByName, // <-- Actualizado
    [metodo_nombre]
  );
  const metodo = metodoRes.rows[0];

  if (!tienePermiso) {
    await auditarAccesoFallido(usuario_id, metodo_nombre, 'Permiso denegado');
    throw new Error('Acceso denegado');
  }

  try {
    const resultado = await metodoEjecutable(params);
    await registrarTransaccion(usuario_id, metodo.id, 'exitoso', 'Método ejecutado correctamente');
    return resultado;
  } catch (err) {
    await registrarTransaccion(usuario_id, metodo.id, 'fallido', `Error: ${err.message}`);
    throw err;
  }
}