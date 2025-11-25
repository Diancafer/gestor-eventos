import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { validarCampos } from '../utils/validator.js';

export function validar(datos) {
  validarCampos(['monto', 'referencia'], datos);
}

export default async function pagar(usuarioId, datos) {
  const query = getQuery('insertPago');
  const result = await db.query(query, [datos.monto, datos.referencia, usuarioId]);
  return { success: true, id: result.rows[0].id };
}