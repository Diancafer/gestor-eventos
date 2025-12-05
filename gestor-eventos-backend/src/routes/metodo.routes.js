import express from 'express'; import { isAuthenticated } from '../middleware/authMiddleware.js'; import GestorNegocio from '../business/gestorNegocio.js'; import Session from '../utils/Session.js'; import PermissionService from '../services/security/security.js'; import { TX } from '../business/txKeys.js';
const router = express.Router(); const gestor = new GestorNegocio(); const session = new Session(); const permisos = new PermissionService();
console.log('toProcess.routes.js cargado');


router.post('/metodo', isAuthenticated, async (req, res) => { try { const { nombreMetodo, datos } = req.body; const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!nombreMetodo || !datos) {
  return res.status(400).json({ error: 'Faltan datos requeridos' });
  }


    const sesionActiva = await session.getSession(token);
    if (!sesionActiva || !sesionActiva.userId) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
    }


  const llave = TX[nombreMetodo];
  if (!llave) {
  return res.status(404).json({ error: `Método ${nombreMetodo} no encontrado en catálogo TX` });
  }


  const autorizado = await permisos.verificarPermiso(sesionActiva.userId, llave);
  if (!autorizado) {
    return res.status(403).json({ error: 'Seguridad denegada: no tienes permiso para ejecutar este método' });
  }

  const resultado = await gestor.ejecutarMetodo(sesionActiva.userId, llave, datos);

  return res.json(resultado);
  } catch (error) { console.error('Error en ToProcess:', error); return res.status(500).json({ error: error.message }); } });
  export default router;
