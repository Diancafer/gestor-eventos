import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { validarCampos } from '../utils/validator.js';

export function validar(datos) {
  validarCampos(['descripcion', 'monto'], datos);
}

export default async function registrar_gasto(usuarioId, datos) {
  const query = getQuery('insertGasto');
  const result = await db.query(query, [usuarioId, datos.descripcion, datos.monto, datos.evento_id]);
  return { success: true, id: result.rows[0].id };
}