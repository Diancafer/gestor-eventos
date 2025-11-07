import db from '../../config/db.js';

const permissionMap = new Map();

/**
 * Carga todos los permisos en memoria para alto rendimiento
 */
export async function loadAllPermissions() {
  const res = await db.query(
    'SELECT rol_id, nombre FROM metodos INNER JOIN permisos ON permisos.metodo_id = metodos.id WHERE permitido = true'
  );
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
    'SELECT id, nombre FROM metodos WHERE nombre = $1',
    [metodo_nombre]
  );
  const metodo = metodoRes.rows[0];
  if (!metodo) throw new Error(`Método no encontrado: ${metodo_nombre}`);

  const usuarioRes = await db.query(
    'SELECT rol_id FROM usuarios WHERE id = $1',
    [usuario_id]
  );
  const usuario = usuarioRes.rows[0];
  if (!usuario) throw new Error(`Usuario no válido: ${usuario_id}`);

  // Si el mapa está cargado, usarlo
  if (permissionMap.size > 0) {
    return getPermissionFromCache(usuario.rol_id, metodo.nombre);
  }

  // Si no, consultar directamente
  const permisoRes = await db.query(
    'SELECT permitido FROM permisos WHERE rol_id = $1 AND metodo_id = $2',
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
    'INSERT INTO tx (usuario_id, metodo_id, fecha, estado, detalle) VALUES ($1, $2, NOW(), $3, $4)',
    [usuario_id, metodo_id, estado, detalle]
  );
}

/**
 * Audita accesos fallidos
 */
export async function auditarAccesoFallido(usuario_id, metodo_nombre, motivo) {
  const metodoRes = await db.query(
    'SELECT id FROM metodos WHERE nombre = $1',
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
    'SELECT id FROM metodos WHERE nombre = $1',
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