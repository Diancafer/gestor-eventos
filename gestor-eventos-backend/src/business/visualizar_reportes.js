import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';

class VisualizarReportes {
  validar(datos) {
  
  }

  async ejecutar(usuarioId, { desde, hasta }) {
    const query = getQuery('selectTxLogPorUsuario');
    const result = await db.query(query, [usuarioId, desde, hasta]);
    return { success: true, reportes: result.rows };
  }
}

export default new VisualizarReportes();