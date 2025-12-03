import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import gestorNegocio from '../business/gestorNegocio.js';
import Session from '../utils/Session.js';
import PermissionService from '../services/security/security.js';
import { TX } from '../business/txKeys.js';

const router = express.Router();
console.log('metodo.routes.js cargado');

class ToProcess {
  constructor() {
    this.session = new Session();
    this.gestor = new gestorNegocio();
    this.permisos = new PermissionService();
  }

  obtenerFTX(nombreMetodo) {
    const llave = TX[nombreMetodo];
    if (!llave) return null;

    const [subsistema, objeto, metodo] = llave.split('.');
    
    return { subsistema,objeto, metodo, llave };
  }

  async ejecutar(req) {
    const { nombreMetodo, datos } = req.body;
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!nombreMetodo || !datos) {
      throw new Error('Faltan datos requeridos');
    }

    

    const ftx = this.obtenerFTX(nombreMetodo);
    if (!ftx) {
      throw new Error(`Método ${nombreMetodo} no encontrado en el catálogo TX`);
    }

    const autorizado = await this.permisos.verificarPermiso(sesionActiva.usuarioId, ftx.llave);
    if (!autorizado) {
      throw new Error('Seguridad denegada: no tienes permiso para ejecutar este método');
    }

    const resultado = await this.gestor.ejecutarMetodo(nombreMetodo, datos);
    return resultado;
  }
}

router.post('/metodo', isAuthenticated, async (req, res) => {
  try {
    const resultado = await new ToProcess().ejecutar(req);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;