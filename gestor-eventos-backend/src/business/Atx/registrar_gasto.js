// src/atx/registrar_gasto.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';
import { validarCampos } from '../../utils/validator.js';

const db = new DBComponent();
const registrarGastoATX = {
  validar(datos) {
    validarCampos(['descripcion', 'monto'], datos);
  },

  async ejecutar(usuarioId, datos) {
    const query = getQuery('insertGasto');
    const result = await db.executeQuery(query, [
      usuarioId,
      datos.descripcion,
      datos.monto,
      datos.evento_id
    ]);

    if (result.rows.length === 0) {
      throw new Error('No se pudo registrar el gasto');
    }

    return { success: true, id: result.rows[0].id };
  }
};

export default registrarGastoATX;
