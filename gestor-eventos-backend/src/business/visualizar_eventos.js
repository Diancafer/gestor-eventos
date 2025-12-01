import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';

class VisualizarEventos {
  validar(datos) {
    // Validaciones opcionales
  }

  async ejecutar(usuarioId) {
    const query = getQuery('selectEventosActivos');
    const result = await db.query(query, ['cancelado']);
    return { success: true, eventos: result.rows };
  }
}

export default new VisualizarEventos();