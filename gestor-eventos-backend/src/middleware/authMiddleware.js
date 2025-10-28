import { getSession, isBlacklisted } from '../utils/Session.js';
import jwt from 'jsonwebtoken';

// =======================================================
// MIDDLEWARE DE AUTENTICACIÓN
// =======================================================
export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Token faltante.' });
  }

  try {
    const decoded = jwt.decode(token);
    const jti = decoded?.jti || token;

    if (await isBlacklisted(jti)) {
      return res.status(403).json({ message: 'Token revocado. Debes iniciar sesión nuevamente.' });
    }

    const session = getSession(token);
    if (!session) {
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }

    req.user = session; // contiene userId, rol, jti
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error al validar autenticación.' });
  }
};

// =======================================================
// MIDDLEWARE DE AUTORIZACIÓN POR ROL
// =======================================================
export const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta.' });
    }
    next();
  };
};