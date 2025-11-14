import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { verificarPermiso } from '../services/security/security.js';
import { registrarTransaccion } from '../services/security/tx.js';
import { TX } from './txKeys.js';

export async function ejecutarMetodo(usuarioId, nombreMetodo, datos) {
  const llave = TX[nombreMetodo.toUpperCase()];
  if (!llave) throw new Error(`Llave no definida para el método: ${nombreMetodo}`);

  const resultadoTx = await db.query(getQuery('getTransaccionIdPorLlave'), [llave]);
  const txId = resultadoTx.rows[0]?.id;
  if (!txId) throw new Error(`Transacción no registrada para la llave: ${llave}`);

  const resultadoMetodo = await db.query(getQuery('getMetodoIdPorNombre'), [nombreMetodo]);
  const metodoId = resultadoMetodo.rows[0]?.id;
  if (!metodoId) throw new Error(`Método no registrado: ${nombreMetodo}`);

  const tienePermiso = await verificarPermiso(usuarioId, llave);
  if (!tienePermiso) {
    await registrarTransaccion(usuarioId, llave, 'denegado', 'Permiso denegado', txId, metodoId);
    throw new Error('Acceso denegado');
  }

  const metodoEjecutable = negocio[nombreMetodo];
  if (typeof metodoEjecutable !== 'function') {
    await registrarTransaccion(usuarioId, llave, 'fallido', 'Método no implementado', txId, metodoId);
    throw new Error(`Método no implementado: ${nombreMetodo}`);
  }

  try {
    const resultado = await metodoEjecutable(usuarioId, datos);
    await registrarTransaccion(usuarioId, llave, 'exitoso', 'Ejecutado correctamente', txId, metodoId);
    return resultado;
  } catch (error) {
    await registrarTransaccion(usuarioId, llave, 'fallido', `Error: ${error.message}`, txId, metodoId);
    throw error;
  }
}

const negocio = {
  async pagar(usuarioId, { monto, referencia }) {
    if (!monto || !referencia) throw new Error('Datos incompletos para procesar el pago');
    const query = getQuery('insertPago');
    const result = await db.query(query, [monto, referencia, usuarioId]);
    return { success: true, id: result.rows[0].id };
  },

  async visualizar_eventos(usuarioId) {
    const query = getQuery('selectEventosActivos');
    const result = await db.query(query, ['cancelado']);
    return { success: true, eventos: result.rows };
  },

  async visualizar_pagos(usuarioId) {
    const query = getQuery('selectPagosPorUsuario');
    const result = await db.query(query, [usuarioId]);
    return { success: true, pagos: result.rows };
  },

  async crear_evento(usuarioId, { titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad }) {
    if (!titulo || !fecha_inicio || !fecha_fin || !ubicacion || !capacidad) {
      throw new Error('Datos incompletos para crear el evento');
    }
    const query = getQuery('insertEvento');
    const result = await db.query(query, [titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad, usuarioId]);
    return { success: true, id: result.rows[0].id };
  },

  async reservar_lugar(usuarioId, { evento_id }) {
    if (!evento_id) throw new Error('Falta el ID del evento');
    const queryEvento = getQuery('selectEventoPorId');
    const evento = await db.query(queryEvento, [evento_id]);
    if (evento.rowCount === 0) throw new Error('Evento no encontrado');

    const queryRegistro = getQuery('selectRegistroEvento');
    const yaRegistrado = await db.query(queryRegistro, [evento_id, usuarioId]);
    if (yaRegistrado.rowCount > 0) throw new Error('Ya estás registrado en este evento');

    const queryInsert = getQuery('insertRegistroEvento');
    await db.query(queryInsert, [evento_id, usuarioId]);
    return { success: true, mensaje: 'Reserva confirmada' };
  },

  async visualizar_reportes(usuarioId, { desde, hasta }) {
    const query = getQuery('selectTxLogPorUsuario');
    const result = await db.query(query, [usuarioId, desde, hasta]);
    return { success: true, reportes: result.rows };
  },

  async asignar_roles(usuarioId, { usuario_target_id, nuevo_rol_id }) {
    const query = getQuery('updateRolUsuario');
    const result = await db.query(query, [nuevo_rol_id, usuario_target_id]);
    if (result.rowCount === 0) throw new Error('Usuario no encontrado');
    return { success: true, id: usuario_target_id };
  },

  async contratar_personal(usuarioId, { nombre, apellido, email, rol_id, empresa_id }) {
    const queryUsuario = getQuery('insertUsuario');
    const result = await db.query(queryUsuario, [email, rol_id, empresa_id]);
    const nuevoUsuarioId = result.rows[0].id;

    const queryPerfil = getQuery('insertPerfil');
    await db.query(queryPerfil, [nuevoUsuarioId, nombre, apellido]);
    return { success: true, id: nuevoUsuarioId };
  },

  async registrar_gasto(usuarioId, { descripcion, monto, evento_id }) {
    if (!descripcion || !monto) throw new Error('Datos incompletos para registrar gasto');
    const query = getQuery('insertGasto');
    const result = await db.query(query, [usuarioId, descripcion, monto, evento_id]);
    return { success: true, id: result.rows[0].id };
  },

  async registrar_asistencia(usuarioId, { evento_id }) {
    const queryCheck = getQuery('selectRegistroEvento');
    const registro = await db.query(queryCheck, [evento_id, usuarioId]);
    if (registro.rowCount === 0) {
      const queryInsert = getQuery('insertRegistroEvento');
      await db.query(queryInsert, [evento_id, usuarioId]);
      return { success: true, mensaje: 'Asistencia registrada' };
    }
    return { success: true, mensaje: 'Ya se había registrado asistencia' };
  }
};