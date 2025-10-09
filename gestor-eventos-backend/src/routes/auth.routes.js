import express from 'express';
import {  
    login,  
    logout,  
    checkSession,  
    register,  
    verifyEmail,  
    forgotPassword,  
    resetPassword  
} from '../controllers/auth.controller.js';

import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de Autenticación Básicas
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);   // protegido
router.get('/me', isAuthenticated, checkSession); // protegido
router.post('/register', register);

// Rutas de Verificación de Correo
router.get('/verify/:token', verifyEmail);

// Rutas de Recuperación de Contraseña
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;