import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';

export default async function visualizar_eventos(usuarioId) {
  const query = getQuery('selectEventosActivos');
  const result = await db.query(query, ['cancelado']);
  return { success: true, eventos: result.rows };
}