import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { validarCampos } from '../utils/validator.js';
import { ObjetoNegocio } from './ObjetoNegocio.js';

class AsignarRoles extends ObjetoNegocio {
  validar(datos) {
    validarCampos(['usuario_target_id', 'nuevo_rol_id'], datos);
  }

  async ejecutar(usuarioId, datos) {
    const query = getQuery('updateRolUsuario');
    const result = await db.query(query, [datos.nuevo_rol_id, datos.usuario_target_id]);
    if (result.rowCount === 0) throw new Error('Usuario no encontrado');
    return { success: true, id: datos.usuario_target_id };
  }
}

export default new AsignarRoles();