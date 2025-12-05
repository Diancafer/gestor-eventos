// src/atx/pagar.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';
import { validarCampos } from '../../utils/validator.js';

const db = new DBComponent();

const pagarATX = {
  validar(datos) {
    validarCampos(['monto', 'referencia'], datos);
  },

  async ejecutar(usuarioId, datos) {
    const query = getQuery('insertPago');
    const result =await db.executeQuery(query, [
      datos.monto,
      datos.referencia,
      usuarioId
    ]);

    if (result.rows.length === 0) {
      throw new Error('No se pudo registrar el pago');
    }

    return { success: true, id: result.rows[0].id };
  }
};

export default pagarATX;