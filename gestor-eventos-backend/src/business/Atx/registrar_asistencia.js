// src/atx/registrar_asistencia.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';
import { validarCampos } from '../../utils/validator.js';

const db = new DBComponent();

const registrarAsistenciaATX = {
  validar(datos) {
    validarCampos(['evento_id'], datos);
  },

  async ejecutar(usuarioId, datos) {
    const queryCheck = getQuery('selectRegistroEvento');
    const registro = await db.executeQuery(queryCheck, [datos.evento_id, usuarioId]);

  
    if (!registro || registro.length === 0) {
      const queryInsert = getQuery('insertRegistroEvento');
      await db.executeQuery(queryInsert, [datos.evento_id, usuarioId]);
      return { success: true, mensaje: 'Asistencia registrada' };
    }

    return { success: true, mensaje: 'Ya se había registrado asistencia' };
  }
};

export default registrarAsistenciaATX;