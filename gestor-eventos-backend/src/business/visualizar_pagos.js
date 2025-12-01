import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';

class VisualizarPagos {
  validar(datos) {
  
  }

  async ejecutar(usuarioId) {
    const query = getQuery('selectPagosPorUsuario');
    const result = await db.query(query, [usuarioId]);
    return { success: true, pagos: result.rows };
  }
}

export default new VisualizarPagos();