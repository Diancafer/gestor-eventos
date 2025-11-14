import express from 'express';
import { ejecutarMetodo } from '../business/gestorNegocio.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();
console.log('metodos.route.js cargado');

// Endpoint de testeo para ejecutar métodos de negocio
router.post('/metodo', isAuthenticated, async (req, res) => {
  const { usuarioId, nombreMetodo, datos } = req.body;

  if (!usuarioId || !nombreMetodo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: usuarioId o nombreMetodo' });
  }

  try {
    const resultado = await ejecutarMetodo(usuarioId, nombreMetodo, datos || {});
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta de prueba para verificar que el módulo está activo
router.post('/metodo-test', (req, res) => {
  res.json({ mensaje: 'Ruta /api/metodo-test activa' });
});

export default router;