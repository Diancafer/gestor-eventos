import { getSession } from '../utils/Session.js';

export const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Token faltante.' });
  }

  const session = getSession(token);
  if (!session) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }

  req.user = session; // contiene userId y rol
  next();
};

export const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta.' });
    }
    next();
  };
};