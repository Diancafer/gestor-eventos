import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { ObjetoNegocio } from './ObjetoNegocio.js';

class VisualizarReportes extends ObjetoNegocio {
  async ejecutar(usuarioId, { desde, hasta }) {
    const query = getQuery('selectTxLogPorUsuario');
    const result = await db.query(query, [usuarioId, desde, hasta]);
    return { success: true, reportes: result.rows };
  }
}

export default new VisualizarReportes();