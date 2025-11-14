import db from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';

const permissionMap = new Map();

export async function loadAllPermissions() {
  const query = getQuery('loadAllPermissions');
  const res = await db.query(query);
  permissionMap.clear();
  for (const row of res.rows) {
    const key = `${row.rol_id}-${row.llave.toLowerCase()}`;
    permissionMap.set(key, true);
  }
}

function getPermissionFromCache(rol_id, llave) {
  const key = `${rol_id}-${llave.toLowerCase()}`;
  return permissionMap.has(key);
}

export async function verificarPermiso(usuarioId, llave) {
  const queryRol = getQuery('getRolId');
  const usuario = await db.query(queryRol, [usuarioId]);
  const rol_id = usuario.rows[0]?.rol_id;

  if (!rol_id) throw new Error(`Usuario no válido: ${usuarioId}`);

  if (permissionMap.size > 0) {
    return getPermissionFromCache(rol_id, llave);
  }

  const queryPermiso = getQuery('getPermisoPorLlave');
  const permiso = await db.query(queryPermiso, [rol_id, llave]);

  return permiso.rows[0]?.permitido === true;
}