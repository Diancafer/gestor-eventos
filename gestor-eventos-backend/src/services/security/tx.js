import db from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';

export async function registrarTransaccion(usuarioId, llave, estado, detalle = null, txId, metodoId) {
  const query = getQuery('insertTxLog');
  await db.query(query, [usuarioId, llave, txId, metodoId, estado, detalle]);
}

export async function auditarAccesoFallido(usuarioId, llave, motivo) {
  const resultadoTx = await db.query(getQuery('getTransaccionIdPorLlave'), [llave]);
  const txId = resultadoTx.rows[0]?.id;
  if (!txId) throw new Error(`Transacción no registrada para la llave: ${llave}`);

  const resultadoMetodo = await db.query(getQuery('getMetodoIdPorNombre'), [llave]); 
  const metodoId = resultadoMetodo.rows[0]?.id;
  if (!metodoId) throw new Error(`Método no registrado para la llave: ${llave}`);

  await registrarTransaccion(usuarioId, llave, 'denegado', motivo, txId, metodoId);
}