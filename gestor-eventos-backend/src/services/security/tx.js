import db from '../../config/db.js';
import queries from '../../config/queries.json' with { type: 'json' };

export async function registrarTransaccion(usuarioId, nombreMetodo, estado, detalle = null) {
  try {
    const metodo = await db.query(
      queries.metodos.getIdByName, // <-- Actualizado
      [nombreMetodo]
    );
    const metodoId = metodo.rows[0]?.id;

    if (!metodoId) {
      console.warn(`Método no registrado: ${nombreMetodo}`);
      return;
    }

    await db.query(
      queries.transacciones.insert, // <-- Actualizado
      [usuarioId, metodoId, estado, detalle]
    );
  } catch (error) {
    console.error('Error al registrar transacción:', error.message);
  }
}