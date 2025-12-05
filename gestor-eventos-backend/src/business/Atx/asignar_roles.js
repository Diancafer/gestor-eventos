// src/atx/asignar_roles.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';
import { validarCampos } from '../../utils/validator.js';

const db = new DBComponent();

const asignarRolesATX = {
  validar(datos) {
    validarCampos(['usuario_target_id', 'nuevo_rol_id'], datos);
  },

  async ejecutar(usuarioId, datos) {
    const query = getQuery('updateRolUsuario');
    const result = await db.executeQuery(query, [
      datos.nuevo_rol_id,
      datos.usuario_target_id
    ]);

    if (result.rowCount === 0) {
      throw new Error('Usuario no encontrado');
    }

    return { success: true, id: datos.usuario_target_id };
  }
};

export default asignarRolesATX;