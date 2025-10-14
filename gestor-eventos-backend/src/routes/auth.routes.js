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

// =======================================================
// Rutas de Autenticación
// =======================================================

// Login y logout
router.post('/login', login);                            // genera token
router.post('/logout', isAuthenticated, logout);         // revoca token

// Registro y verificación
router.post('/register', register);                      // requiere rol_id
router.get('/verify', verifyEmail);                      // ?token=...

// Estado de sesión y perfil
router.get('/check-session', isAuthenticated, checkSession); // valida token
router.get('/me', isAuthenticated, getProfile);               // perfil del usuario actual

// Recuperación de contraseña
router.post('/forgot-password', forgotPassword);         // envía enlace
router.post('/reset-password', resetPassword);           // cambia contraseña

// =======================================================
// Rutas públicas para obtener datos auxiliares
// =======================================================

// Obtiene lista de roles disponibles
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