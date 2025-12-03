import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';

export  default class PermissionService {
  constructor() {
   
    this.permissionMap = new Map();
  }

  
  async loadAllPermissions() {
    const query = getQuery('loadAllPermissions');
    const res = await db.query(query);
    
   
    this.permissionMap.clear();
    
    for (const row of res.rows) {
      const key = `${row.rol_id}-${row.llave.toLowerCase()}`;
      this.permissionMap.set(key, true);
    }
  }

 
   
  getPermissionFromCache(rol_id, llave) {
    const key = `${rol_id}-${llave.toLowerCase()}`;
    return this.permissionMap.has(key);
  }

  
  async verificarPermiso(usuarioId, llave) {
    const queryRol = getQuery('getRolId');
    const usuario = await db.query(queryRol, [usuarioId]);
    const rol_id = usuario.rows[0]?.rol_id;

    if (!rol_id) throw new Error(`Usuario no válido: ${usuarioId}`);

    
    if (this.permissionMap.size > 0) {
      return this.getPermissionFromCache(rol_id, llave);
    }

    
    const queryPermiso = getQuery('getPermisoPorLlave');
    const permiso = await db.query(queryPermiso, [rol_id, llave]);

    return permiso.rows[0]?.permitido === true;
  }
}


