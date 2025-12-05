import express from 'express';
import {
  login,
  logout,
  checkSession,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile
} from '../controllers/authController.js';

import { isAuthenticated } from '../middleware/authMiddleware.js';
import prisma from '../lib/prismaClient.js';

const router = express.Router();


router.post('/login', login);                            
router.post('/logout', isAuthenticated, logout);         


router.post('/register', register);                      
router.get('/verify', verifyEmail);                     


router.get('/check-session', isAuthenticated, checkSession); 
router.get('/me', isAuthenticated, getProfile);               


router.post('/forgot-password', forgotPassword);         
router.post('/reset-password', resetPassword);           






router.get('/roles', async (req, res) => {
  try {
    const roles = await prisma.roles.findMany({
      select: { id: true, nombre_rol: true }
    });

    const formateados = roles.map((rol) => ({
      id: rol.id,
      nombre: rol.nombre_rol
    }));

    res.json(formateados);
  } catch (err) {
    console.error('Error al obtener roles:', err);
    res.status(500).json({ message: 'Error al obtener roles' });
  }
});

export default router;