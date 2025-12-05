// src/atx/visualizar_eventos.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';

const db = new DBComponent();
const visualizarEventosATX = {
  validar(datos) {
  },

  async ejecutar(usuarioId, datos = {}) {
    const query = getQuery('selectEventosActivos');
    const result = await db.executeQuery(query, ['cancelado']);

    return { success: true, eventos: result.rows };
  }
};

export default visualizarEventosATX;