import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import DBComponent from './src/config/db.js';
import { Dispatcher } from './src/dispatcher/dispatcher.js';

import authRoutes from './src/routes/auth.routes.js';
import metodoroutes from './src/routes/metodo.routes.js';
import gestorNegocio from './src/business/gestorNegocio.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// =======================================================
// CONFIGURACIÓN DE CORS
// =======================================================
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
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
const db = new DBComponent();

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
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);




// =======================================================
// INICIO DEL SERVIDOR
// =======================================================
const startServer = () => {
  app.listen(PORT, () => {
    
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  });
};
// rutas
 app.use('/api/auth', authRoutes);
 app.use('/api', metodoroutes);

db.getPool().query('SELECT 1')
  .then(() => {
    console.log('Conexión exitosa a PostgreSQL!');
    startServer();
  })
  .catch((error) => {
    console.error('Error al conectar a PostgreSQL:', error.message);
    process.exit(1); 
  });
 