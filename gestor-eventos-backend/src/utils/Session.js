// src/utils/Session.js
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { getRedisClient } from '../services/redisClient.js';

const SECRET = process.env.SESSION_SECRET || 'clave_secreta_por_defecto';
const EXPIRATION = '2h';

// =======================================================
// CREAR TOKEN DE SESIÓN
// =======================================================
export async function createSession(user) {
  let rol = user.rol_id;

  if (!user.rol_nombre && user.rol_id) {
    const result = await db.query('SELECT nombre_rol FROM roles WHERE id = $1', [user.rol_id]);
    rol = result.rows[0]?.nombre_rol || 'SinRol';
  }

  const jti = uuidv4();
  const payload = {
    userId: user.id,
    rol,
    jti
  };

  const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
  return token;
}

// =======================================================
// VERIFICAR TOKEN Y EXTRAER DATOS
// =======================================================
export function getSession(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded; // { userId, rol, jti }
  } catch {
    return null;
  }
}

// =======================================================
// VERIFICAR SI EL TOKEN ESTÁ REVOCADO
// =======================================================
export async function isBlacklisted(jti) {
  const client = await getRedisClient();
  const result = await client.get(jti);
  return result === 'revoked';
}

// =======================================================
// VERIFICAR SI EL TOKEN ES VÁLIDO Y NO REVOCADO
// =======================================================
export async function sessionExist(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    const jti = decoded.jti || token;

    const revoked = await isBlacklisted(jti);
    return !revoked;
  } catch {
    return false;
  }
}

// =======================================================
// INVALIDAR TOKEN (REVOCAR SESIÓN)
// =======================================================
export async function destroy(token) {
  try {
    const decoded = jwt.decode(token);
    const jti = decoded.jti || token;
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    const client = await getRedisClient();
    await client.setEx(jti, ttl, 'revoked');
  } catch {
    // no hacer nada si el token no se puede decodificar
  }
}