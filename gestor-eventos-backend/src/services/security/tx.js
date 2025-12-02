import db from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';

class AuditService {

  /**
   * Registra una transacción en el log de auditoría.
   */
  async registrarTransaccion(usuarioId, llave, estado, detalle = null, txId, metodoId) {
    const query = getQuery('insertTxLog');
    await db.query(query, [usuarioId, llave, txId, metodoId, estado, detalle]);
  }

  /**
   * Busca los IDs necesarios y registra un acceso fallido.
   */
  async auditarAccesoFallido(usuarioId, llave, motivo) {
    // 1. Obtener ID de la Transacción
    const resultadoTx = await db.query(getQuery('getTransaccionIdPorLlave'), [llave]);
    const txId = resultadoTx.rows[0]?.id;
    
    if (!txId) throw new Error(`Transacción no registrada para la llave: ${llave}`);

    // 2. Obtener ID del Método
    const resultadoMetodo = await db.query(getQuery('getMetodoIdPorNombre'), [llave]);
    const metodoId = resultadoMetodo.rows[0]?.id;
    
    if (!metodoId) throw new Error(`Método no registrado para la llave: ${llave}`);

    // 3. Registrar usando el método interno de la clase (usando 'this')
    await this.registrarTransaccion(usuarioId, llave, 'denegado', motivo, txId, metodoId);
  }
}

// Exportamos la instancia única (Singleton)
export default new AuditService();