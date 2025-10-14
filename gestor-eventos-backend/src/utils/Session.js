import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const SECRET = process.env.SESSION_SECRET || 'clave_secreta_por_defecto';
const EXPIRATION = '2h'; // Puedes ajustar la duración del token

// Blacklist en memoria (puedes migrar a Redis o DB si lo necesitas)
const blacklist = new Set();

// =======================================================
// CREAR TOKEN DE SESIÓN
// =======================================================
export async function createSession(user) {
  let rol = user.rol_id;

  // Si no tienes el nombre del rol, lo buscas
  if (!user.rol_nombre && user.rol_id) {
    const result = await db.query('SELECT nombre FROM roles WHERE id = $1', [user.rol_id]);
    rol = result.rows[0]?.nombre || 'SinRol';
  }

  const payload = {
    userId: user.id,
    rol
  };

  const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
  return token;
}

// =======================================================
// VERIFICAR TOKEN Y EXTRAER DATOS
// =======================================================
export function getSession(token) {
  try {
    if (isBlacklisted(token)) return null;
    const decoded = jwt.verify(token, SECRET);
    return decoded; // { userId, rol }
  } catch {
    return null;
  }
}

// =======================================================
// VERIFICAR SI EL TOKEN ES VÁLIDO
// =======================================================
export function sessionExist(token) {
  try {
    if (isBlacklisted(token)) return false;
    const decoded = jwt.verify(token, SECRET);
    return !!decoded;
  } catch {
    return false;
  }
}

// =======================================================
// INVALIDAR TOKEN (REVOCAR SESIÓN)
// =======================================================
export function destroy(token) {
  blacklist.add(token);
}

// =======================================================
// VERIFICAR SI UN TOKEN ESTÁ REVOCADO
// =======================================================
export function isBlacklisted(token) {
  return blacklist.has(token);
}