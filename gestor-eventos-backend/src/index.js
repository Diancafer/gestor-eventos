import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';

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

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});