import db from '../../config/db.js';

export async function registrarTransaccion(usuarioId, nombreMetodo, estado, detalle = null) {
  try {
    const metodo = await db.query('SELECT id FROM metodos WHERE nombre = $1', [nombreMetodo]);
    const metodoId = metodo.rows[0]?.id;

    if (!metodoId) {
      console.warn(`Método no registrado: ${nombreMetodo}`);
      return;
    }

    await db.query(
      `INSERT INTO tx (usuario_id, metodo_id, fecha, estado, detalle)
       VALUES ($1, $2, NOW(), $3, $4)`,
      [usuarioId, metodoId, estado, detalle]
    );
  } catch (error) {
    console.error('Error al registrar transacción:', error.message);
  }
}