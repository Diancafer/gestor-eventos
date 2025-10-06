// src/routes/auth.routes.js
import express from 'express';
import { 
    login, 
    logout, 
    verificarSesion, 
    register, 
    verificarEmail,
    forgotPassword,    // NUEVA: Para solicitar el reseteo (envío de email)
    resetPassword      // NUEVA: Para finalizar el reseteo (nueva contraseña)
} from '../controllers/auth.controller.js';

const router = express.Router();

// Rutas de Autenticación Básicas
router.post('/login', login);
router.post('/logout', logout); 
router.get('/verificar', verificarSesion); 
router.post('/register', register);

// Rutas de Verificación de Correo
// NOTA: Usaste 'verificar-email' aquí, asegúrate de que el frontend apunte a esta ruta
router.get('/verificar-email', verificarEmail); 

// Rutas de Recuperación de Contraseña (Solo por Correo)
router.post('/forgot-password', forgotPassword); // Recibe el email
router.post('/reset-password', resetPassword);   // Recibe el token y la nueva clave

export default router;