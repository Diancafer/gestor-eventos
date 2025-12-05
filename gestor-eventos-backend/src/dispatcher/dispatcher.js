import Session from '../utils/Session.js';
import authService from '../services/authService.js';       
import gestorNegocio from '../business/gestorNegocio.js';
import  PermissionService  from '../services/security/security.js';
import { get } from 'mongoose';

export class Dispatcher {
    constructor(app) { 
        this.permissionService = new PermissionService();
        this.authService = new authService();
        this.Session = new Session();
        this.gestorNegocio = new gestorNegocio();
        this.app= app;
    }
 async init() {
        await this.gestorNegocio.init();
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api', metodoRoutes); 

        this.app.get('/', (req, res) => {
        res.send('API de Gestor de Eventos corriendo.');
        });

        this.app.post('/api/test', (req, res) => {
        res.json({ mensaje: 'Ruta /api/test activa' });
        });

    this.app.get('/api/session', async (req, res) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) { return res.status(401).json({ message : 'No autorizado. Token faltante.' }); }
        const sessionData =  await this.Session.getSession(token);
        if (!sessionData) { return res.status(403).json({ message : 'Token inválido o expirado.' }); }
        res.json({ success: true, session: sessionData });
    });  
    this.app.post('/api/ejecutar', async (req, res) => {
        try {
            const {nombreMetodo, datos } = req.body;

            const usuario = await this.authService.getUserById(sessionData.id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado.' }); }

            req.usuario = usuario;
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) { return res.status(401).json({ message : 'No autorizado. Token faltante.' }); }
            
            const sessionData =  await this.Session.getSession(token);
            if (!sessionData) { return res.status(403).json({ message : 'Token inválido o expirado.' }); }

            const tienePermiso = await this.permissionService.verificarPermiso(sessionData.id, nombreMetodo);
            if (!tienePermiso) {
                return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para este método.' }); }

            const resultado = await this.gestorNegocio.ejecutarMetodo(sessionData.id, nombreMetodo, datos);
            res.json({ success: true, resultado });
        } catch (error) {
            console.error('Error al ejecutar método:', error);
            res.status(500).json({ message: 'Error al ejecutar el método.', error: error.message });
        }

    });
}              
}
