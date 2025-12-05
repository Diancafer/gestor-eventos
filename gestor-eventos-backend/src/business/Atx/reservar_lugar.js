// src/atx/reservar_lugar.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';
import { validarCampos } from '../../utils/validator.js';

const db = new DBComponent();
const reservarLugarATX = {
  validar(datos) {
    validarCampos(['evento_id'], datos);
  },

  async ejecutar(usuarioId, datos) {
    
    const queryEvento = getQuery('selectEventoPorId');
    const evento = await db.executeQuery(queryEvento, [datos.evento_id]);
    if (evento.rowCount === 0) {
      throw new Error('Evento no encontrado');
    }

    
    const queryRegistro = getQuery('selectRegistroEvento');
    const yaRegistrado = await db.executeQuery(queryRegistro, [datos.evento_id, usuarioId]);
    if (yaRegistrado.rowCount > 0) {
      throw new Error('Ya estás registrado en este evento');
    }

  
    const queryInsert = getQuery('insertRegistroEvento');
    await db.executeQuery(queryInsert, [datos.evento_id, usuarioId]);

    return { success: true, mensaje: 'Reserva confirmada' };
  }
};

export default reservarLugarATX;