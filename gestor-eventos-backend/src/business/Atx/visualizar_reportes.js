// src/atx/visualizar_reportes.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';
import { validarCampos } from '../../utils/validator.js';

const db = new DBComponent();
const visualizarReportesATX = {
  validar(datos) {
    validarCampos(['desde', 'hasta'], datos);
  },

  async ejecutar(usuarioId, { desde, hasta }) {
    const query = getQuery('selectTxLogPorUsuario');
    const result = await db.executeQuery(query, [usuarioId, desde, hasta]);

    if (result.rows.length === 0) {
      return { success: true, reportes: [] };
    }

    return { success: true, reportes: result.rows };
  }
};

export default visualizarReportesATX;