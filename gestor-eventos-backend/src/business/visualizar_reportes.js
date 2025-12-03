import DBComponent from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';

export default class VisualizarReportes {
  validar(datos) {
  
  }

  async ejecutar(usuarioId, { desde, hasta }) {
    const query = getQuery('selectTxLogPorUsuario');
    const result = await db.query(query, [usuarioId, desde, hasta]);
    return { success: true, reportes: result.rows };
  }
}

