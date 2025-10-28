// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
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

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend activo y escuchando');
});

// Conexión a Redis al iniciar
getRedisClient()
  .then(() => {
    console.log('Redis conectado');
    // Inicio del servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar Redis:', err);
    process.exit(1); // opcional: detener si Redis falla
  });