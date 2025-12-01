import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { validarCampos } from '../utils/validator.js';
import { ObjetoNegocio } from './ObjetoNegocio.js';

class ReservarLugar extends ObjetoNegocio {
  validar(datos) {
    validarCampos(['evento_id'], datos);
  }

  async ejecutar(usuarioId, datos) {
    const queryEvento = getQuery('selectEventoPorId');
    const evento = await db.query(queryEvento, [datos.evento_id]);
    if (evento.rowCount === 0) throw new Error('Evento no encontrado');

    const queryRegistro = getQuery('selectRegistroEvento');
    const yaRegistrado = await db.query(queryRegistro, [datos.evento_id, usuarioId]);
    if (yaRegistrado.rowCount > 0) throw new Error('Ya estás registrado en este evento');

    const queryInsert = getQuery('insertRegistroEvento');
    await db.query(queryInsert, [datos.evento_id, usuarioId]);
    return { success: true, mensaje: 'Reserva confirmada' };
  }
}

export default new ReservarLugar();