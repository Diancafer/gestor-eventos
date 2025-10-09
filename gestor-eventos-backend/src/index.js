import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar sesiones con PostgreSQL
const PgSession = pgSession(session);
app.use(session({
  store: new PgSession({
    pool: db.getPool(),
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 día
    secure: false, // true si usas HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// CORS para permitir frontend en otro puerto
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Prueba de vida
app.get('/', (req, res) => {
  res.send('✅ Backend activo y escuchando');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});