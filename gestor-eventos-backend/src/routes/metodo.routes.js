import express from 'express';
import gestorNegocio from '../business/gestorNegocio.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();
console.log('metodo.routes.js cargado');

// Endpoint principal para ejecutar métodos de negocio
router.post('/metodo', isAuthenticated, async (req, res) => {
  const { usuarioId, nombreMetodo, datos = {} } = req.body;

  if (!usuarioId || !nombreMetodo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: usuarioId o nombreMetodo' });
  }

  try {
    const resultado = await gestorNegocio.ejecutarMetodo(usuarioId, nombreMetodo, datos);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;