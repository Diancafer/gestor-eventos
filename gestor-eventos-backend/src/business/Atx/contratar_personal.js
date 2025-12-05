// src/atx/contratar_personal.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';
import { validarCampos } from '../../utils/validator.js';

const db = new DBComponent();

const contratarPersonalATX = {
  validar(datos) {
    validarCampos(['nombre', 'apellido', 'email', 'rol_id', 'empresa_id'], datos);
  },

  async ejecutar(usuarioId, datos) {
    const queryUsuario = getQuery('insertUsuario');
    const result = await db.executeQuery(queryUsuario, [
      datos.email,
      datos.rol_id,
      datos.empresa_id
    ]);

    if (result.rows.length === 0) {
      throw new Error('No se pudo crear el usuario');
    }

    const nuevoUsuarioId = result.rows[0].id;

    
    const queryPerfil = getQuery('insertPerfil');
    await DBComponent.query(queryPerfil, [
      nuevoUsuarioId,
      datos.nombre,
      datos.apellido
    ]);

    return { success: true, id: nuevoUsuarioId };
  }
};

export default contratarPersonalATX;