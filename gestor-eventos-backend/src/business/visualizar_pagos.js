import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { ObjetoNegocio } from './ObjetoNegocio.js';

class VisualizarPagos extends ObjetoNegocio {
  async ejecutar(usuarioId) {
    const query = getQuery('selectPagosPorUsuario');
    const result = await db.query(query, [usuarioId]);
    return { success: true, pagos: result.rows };
  }
}

export default new VisualizarPagos();