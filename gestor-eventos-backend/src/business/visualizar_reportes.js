import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';

export default async function visualizar_reportes(usuarioId, { desde, hasta }) {
  const query = getQuery('selectTxLogPorUsuario');
  const result = await db.query(query, [usuarioId, desde, hasta]);
  return { success: true, reportes: result.rows };
}