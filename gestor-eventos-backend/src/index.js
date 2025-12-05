import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import metodoRoutes from './src/routes/metodo.routes.js';
import { getRedisClient } from './src/services/redisClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api', metodoRoutes); 


app.get('/', (req, res) => {
  res.send('Backend activo y escuchando');
});


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
    process.exit(1); 
  }
})();