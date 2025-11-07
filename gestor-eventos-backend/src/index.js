import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import metodoRoutes from './src/routes/metodo.routes.js';
import { getRedisClient } from './src/services/redisClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api', metodoRoutes); // INTEGRACIÓN DEL OBJETO DE NEGOCIO

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend activo y escuchando');
});

// Inicio del servidor y conexión a Redis
(async () => {
  try {
    console.log('Intentando conectar a Redis...');
    await getRedisClient();
    console.log('Redis conectado');

    app.listen(PORT, () => {
      console.log(` Servidor Express corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al conectar Redis:', err);
    process.exit(1); // opcional: detener si Redis falla
  }
})();