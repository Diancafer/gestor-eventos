import jwt from 'jsonwebtoken';
import Session from '../utils/Session.js';
import  PermissionService  from '../services/security/security.js';


const session = new Session();
const permissionService = new PermissionService();


// MIDDLEWARE DE AUTENTICACIÓN

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token recibido:', token);

  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Token faltante.' });
  }

  try {
    const decoded = jwt.decode(token);
    console.log('Token decodificado:', decoded);

    const jti = decoded?.jti || token;
    const blacklisted = await session.isBlacklisted(jti);
    console.log('¿Está en blacklist?', blacklisted);

    if (blacklisted) {
      return res.status(403).json({ message: 'Token revocado. Debes iniciar sesión nuevamente.' });
    }

    const currentSession = await session.getSession(token);
    console.log('Sesión obtenida:', currentSession);

    if (!currentSession) {
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }

    req.user = currentSession; // contiene userId, rol, jti
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(500).json({ message: 'Error al validar autenticación.' });
  }
};


// MIDDLEWARE DE AUTORIZACIÓN POR MÉTODO

export const requireMetodo = (metodo_nombre) => {
  return async (req, res, next) => {
    const usuario_id = req.user?.userId; // ⚠️ usar userId del payload
    console.log(`Verificando permiso para método "${metodo_nombre}" del usuario ${usuario_id}`);

    if (!usuario_id) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    try {
      const tienePermiso = await permissionService.verificarPermiso(usuario_id, metodo_nombre);
      console.log(`¿Tiene permiso? ${tienePermiso}`);

      if (!tienePermiso) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para este método.' });
      }

      next();
    } catch (error) {
      console.error(`Error al verificar permiso para ${metodo_nombre}:`, error);
      return res.status(500).json({ message: 'Error interno al verificar permisos.' });
    }
  };
};