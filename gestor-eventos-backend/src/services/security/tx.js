import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';

class AuditService {

  constructor() {
    this.db = new DBComponent();
  }

  async registrarTransaccion(usuarioId, llave, estado, detalle = null, txId, metodoId) {
    const query = getQuery('insertTxLog');
    await this.db.query(query, [usuarioId, llave, txId, metodoId, estado, detalle]);
  }

  
  async auditarAccesoFallido(usuarioId, llave, motivo) {
    const resultadoTx = await this.db.query(getQuery('getTransaccionIdPorLlave'), [llave]);
    const txId = resultadoTx.rows[0]?.id;
    
    if (!txId) throw new Error(`Transacción no registrada para la llave: ${llave}`);

    
    const resultadoMetodo = await this.db.query(getQuery('getMetodoIdPorNombre'), [llave]);
    const metodoId = resultadoMetodo.rows[0]?.id;
    
    if (!metodoId) throw new Error(`Método no registrado para la llave: ${llave}`);

    
    await this.registrarTransaccion(usuarioId, llave, 'denegado', motivo, txId, metodoId);
  }
}


export default new AuditService();