import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import db from './src/config/db.js'; 


import authRoutes from './src/routes/auth.routes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =======================================================
// CONFIGURACIÓN DE CORS
// =======================================================
const corsOptions = {
  origin: 'http://localhost:5185', // puerto real de tu frontend
  credentials: true,               // permite cookies
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// Middlewares estándar
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// =======================================================
// CONFIGURACIÓN DE SESIONES (PostgreSQL)
// =======================================================
const PgStore = pgSession(session);
const sessionStore = new PgStore({
  pool: db.getPool(), 
  tableName: 'user_sessions',
  createTableIfMissing: true 
});

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro_dev', 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// =======================================================
// RUTAS
// =======================================================
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API de Gestor de Eventos corriendo.');
});

// =======================================================
// INICIO DEL SERVIDOR
// =======================================================
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  });
};

db.getPool().query('SELECT 1')
  .then(() => {
    console.log('Conexión exitosa a PostgreSQL!');
    startServer();
  })
  .catch((error) => {
    console.error('Error al conectar a PostgreSQL:', error.message);
    process.exit(1); 
  });