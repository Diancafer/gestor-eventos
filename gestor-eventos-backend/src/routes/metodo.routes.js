import express from 'express';
import { procesarMetodo } from '../controllers/metodoController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js'; 

const router = express.Router();
console.log('metodo.routes.js cargado');
router.post('/metodo', isAuthenticated, procesarMetodo);
router.post('/metodo-test', (req, res) => {
  res.json({ mensaje: 'Ruta /api/metodo-test activa' });
}); 

export default router;