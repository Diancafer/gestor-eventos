import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';

export default async function visualizar_pagos(usuarioId) {
  const query = getQuery('selectPagosPorUsuario');
  const result = await db.query(query, [usuarioId]);
  return { success: true, pagos: result.rows };
}