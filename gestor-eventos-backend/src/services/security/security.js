import db from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';

class PermissionService {
  constructor() {
    // Inicializamos el mapa como propiedad de la clase
    this.permissionMap = new Map();
  }

  /**
   * Carga todos los permisos en memoria (caché)
   */
  async loadAllPermissions() {
    const query = getQuery('loadAllPermissions');
    const res = await db.query(query);
    
    // Limpiamos y rellenamos el mapa de la instancia actual
    this.permissionMap.clear();
    
    for (const row of res.rows) {
      const key = `${row.rol_id}-${row.llave.toLowerCase()}`;
      this.permissionMap.set(key, true);
    }
  }

  /**
   * Método interno para buscar en el caché
   */
  getPermissionFromCache(rol_id, llave) {
    const key = `${rol_id}-${llave.toLowerCase()}`;
    return this.permissionMap.has(key);
  }

  /**
   * Verifica si un usuario tiene permiso para una llave específica
   */
  async verificarPermiso(usuarioId, llave) {
    const queryRol = getQuery('getRolId');
    const usuario = await db.query(queryRol, [usuarioId]);
    const rol_id = usuario.rows[0]?.rol_id;

    if (!rol_id) throw new Error(`Usuario no válido: ${usuarioId}`);

    // Verificamos si el caché (this.permissionMap) tiene datos
    if (this.permissionMap.size > 0) {
      return this.getPermissionFromCache(rol_id, llave);
    }

    // Si el caché está vacío, consultamos directo a la BD
    const queryPermiso = getQuery('getPermisoPorLlave');
    const permiso = await db.query(queryPermiso, [rol_id, llave]);

    return permiso.rows[0]?.permitido === true;
  }
}

// Exportamos una instancia única (Singleton) para mantener el caché vivo
export default new PermissionService();