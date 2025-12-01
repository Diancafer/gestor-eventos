import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { validarCampos } from '../utils/validator.js';
import { ObjetoNegocio } from './ObjetoNegocio.js';

class Pagar extends ObjetoNegocio {
  validar(datos) {
    validarCampos(['monto', 'referencia'], datos);
  }

  async ejecutar(usuarioId, datos) {
    const query = getQuery('insertPago');
    const result = await db.query(query, [datos.monto, datos.referencia, usuarioId]);
    return { success: true, id: result.rows[0].id };
  }
}

export default new Pagar();