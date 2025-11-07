import db from '../config/db.js';
import { registrarTransaccion } from '../services/security/tx.js';

// Método centralizado
export async function ejecutarMetodo(usuarioId, nombreMetodo, datos) {
  const tienePermiso = await verificarPermiso(usuarioId, nombreMetodo);
  if (!tienePermiso) {
    await registrarTransaccion(usuarioId, nombreMetodo, 'denegado');
    throw new Error('Acceso denegado');
  }

  try {
    let resultado;

    switch (nombreMetodo) {
      case 'pagar':
        resultado = await pagar(usuarioId, datos);
        break;
      case 'visualizar_eventos':
        resultado = await visualizarEventos(usuarioId, datos);
        break;
      case 'visualizar_pagos':
        resultado = await visualizarPagos(usuarioId, datos);
        break;
      case 'crear_evento':
        resultado = await crearEventos(usuarioId, datos);
        break;
      case 'reservar_lugar':
        resultado = await reservarLugar(usuarioId, datos);
        break;
      case 'visualizar_reportes':
        resultado = await visualizarReportes(usuarioId, datos);
        break;
      case 'asignar_rol':
        resultado = await asignarRol(usuarioId, datos);
        break;
      case 'contratar_personal':
        resultado = await contratarPersonal(usuarioId, datos);
        break;
      case 'registrar_gasto':
        resultado = await registrarGasto(usuarioId, datos);
        break;
      case 'registrar_asistencia':
        resultado = await registrarAsistencia(usuarioId, datos);
        break;
      default:
        throw new Error(`Método desconocido: ${nombreMetodo}`);
    }

    await registrarTransaccion(usuarioId, nombreMetodo, 'exitoso');
    return resultado;

  } catch (error) {
    await registrarTransaccion(usuarioId, nombreMetodo, 'fallido');
    throw error;
  }
}

// Validación de permisos
async function verificarPermiso(usuarioId, nombreMetodo) {
  const usuario = await db.query('SELECT rol_id FROM usuarios WHERE id = $1', [usuarioId]);
  const rol_id = usuario.rows[0]?.rol_id;

  const metodo = await db.query('SELECT id FROM metodos WHERE nombre = $1', [nombreMetodo]);
  const metodo_id = metodo.rows[0]?.id;

  const permiso = await db.query(
    'SELECT permitido FROM permisos WHERE rol_id = $1 AND metodo_id = $2',
    [rol_id, metodo_id]
  );

  return permiso.rows[0]?.permitido === true;
}
async function pagar(usuarioId, { monto, referencia }) {
  if (!monto || !referencia) throw new Error('Datos incompletos para procesar el pago');

  const result = await db.query(
    'INSERT INTO pagos (monto, referencia, usuario_id) VALUES ($1, $2, $3) RETURNING id',
    [monto, referencia, usuarioId]
  );

  return { success: true, id: result.rows[0].id };
}

async function visualizarEventos(usuarioId) {
  const result = await db.query(
    'SELECT id, titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad, estado FROM eventos WHERE estado != $1',
    ['cancelado']
  );

  return { success: true, eventos: result.rows };
}

async function visualizarPagos(usuarioId) {
  const result = await db.query(
    'SELECT id, monto, referencia FROM pagos WHERE usuario_id = $1',
    [usuarioId]
  );

  return { success: true, pagos: result.rows };
}

async function crearEventos(usuarioId, { titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad }) {
  if (!titulo || !fecha_inicio || !fecha_fin || !ubicacion || !capacidad) {
    throw new Error('Datos incompletos para crear el evento');
  }

  const result = await db.query(
    `INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad, organizador_id, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'activo') RETURNING id`,
    [titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad, usuarioId]
  );

  return { success: true, id: result.rows[0].id };
}

async function reservarLugar(usuarioId, { evento_id }) {
  if (!evento_id) throw new Error('Falta el ID del evento');

  const evento = await db.query('SELECT capacidad FROM eventos WHERE id = $1', [evento_id]);
  if (evento.rowCount === 0) throw new Error('Evento no encontrado');

  const yaRegistrado = await db.query(
    'SELECT id FROM registros_eventos WHERE evento_id = $1 AND usuario_id = $2',
    [evento_id, usuarioId]
  );
  if (yaRegistrado.rowCount > 0) throw new Error('Ya estás registrado en este evento');

  await db.query(
    'INSERT INTO registros_eventos (evento_id, usuario_id, fecha_registro) VALUES ($1, $2, NOW())',
    [evento_id, usuarioId]
  );

  return { success: true, mensaje: 'Reserva confirmada' };
}

async function visualizarReportes(usuarioId, { desde, hasta }) {
  const result = await db.query(
    `SELECT tx.fecha, tx.estado, m.nombre AS metodo, tx.detalle
     FROM tx
     JOIN metodos m ON tx.metodo_id = m.id
     WHERE tx.usuario_id = $1 AND tx.fecha BETWEEN $2 AND $3
     ORDER BY tx.fecha DESC`,
    [usuarioId, desde, hasta]
  );

  return { success: true, reportes: result.rows };
}

async function asignarRol(usuarioId, { usuario_target_id, nuevo_rol_id }) {
  const result = await db.query(
    'UPDATE usuarios SET rol_id = $1 WHERE id = $2 RETURNING id',
    [nuevo_rol_id, usuario_target_id]
  );
  if (result.rowCount === 0) throw new Error('Usuario no encontrado');
  return { success: true, id: usuario_target_id };
}

async function contratarPersonal(usuarioId, { nombre, apellido, email, rol_id, empresa_id }) {
  const result = await db.query(
    `INSERT INTO usuarios (email, rol_id, empresa_id)
     VALUES ($1, $2, $3) RETURNING id`,
    [email, rol_id, empresa_id]
  );

  const nuevoUsuarioId = result.rows[0].id;

  await db.query(
    `INSERT INTO perfiles (usuario_id, nombre, apellido)
     VALUES ($1, $2, $3)`,
    [nuevoUsuarioId, nombre, apellido]
  );

  return { success: true, id: nuevoUsuarioId };
}

async function registrarGasto(usuarioId, { descripcion, monto, evento_id }) {
  if (!descripcion || !monto) throw new Error('Datos incompletos para registrar gasto');

  const result = await db.query(
    `INSERT INTO gastos (usuario_id, descripcion, monto, evento_id)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [usuarioId, descripcion, monto, evento_id]
  );

  return { success: true, id: result.rows[0].id };
}

async function registrarAsistencia(usuarioId, { evento_id }) {
  const registro = await db.query(
    `SELECT id FROM registros_eventos
     WHERE evento_id = $1 AND usuario_id = $2`,
    [evento_id, usuarioId]
  );

  if (registro.rowCount === 0) {
    await db.query(
      `INSERT INTO registros_eventos (evento_id, usuario_id, fecha_registro)
       VALUES ($1, $2, NOW())`,
      [evento_id, usuarioId]
    );
    return { success: true, mensaje: 'Asistencia registrada' };
  }

  return { success: true, mensaje: 'Ya se había registrado asistencia' };
}