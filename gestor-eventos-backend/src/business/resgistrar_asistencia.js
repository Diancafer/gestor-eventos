import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { validarCampos } from '../utils/validator.js';
import { ObjetoNegocio } from './ObjetoNegocio.js';

class RegistrarAsistencia extends ObjetoNegocio {
  validar(datos) {
    validarCampos(['evento_id'], datos);
  }

  async ejecutar(usuarioId, datos) {
    const queryCheck = getQuery('selectRegistroEvento');
    const registro = await db.query(queryCheck, [datos.evento_id, usuarioId]);

    if (registro.rowCount === 0) {
      const queryInsert = getQuery('insertRegistroEvento');
      await db.query(queryInsert, [datos.evento_id, usuarioId]);
      return { success: true, mensaje: 'Asistencia registrada' };
    }

    return { success: true, mensaje: 'Ya se había registrado asistencia' };
  }
}

export default new RegistrarAsistencia();