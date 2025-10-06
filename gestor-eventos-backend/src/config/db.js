// src/config/db.js

import pg from 'pg';
import dotenv from 'dotenv';

// Asegura que las variables del .env se carguen
dotenv.config();

// Configuración del Pool de Conexiones
const pool = new pg.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD, 
    port: process.env.PGPORT,
    // [CORRECCIÓN] Eliminamos el bloque SSL que causaba: 
    // "The server does not support SSL connections"
});

// Función de prueba de conexión al iniciar
pool.connect()
    .then(client => {
        console.log('✅ Conexión exitosa a PostgreSQL!');
        client.release();
    })
    .catch(err => {
        console.error('❌ Error fatal al conectar a PostgreSQL. Verifique su base de datos y credenciales:', err.message);
    });

// Objeto para manejar las queries y exponer el pool
const db = {
    // Función para ejecutar queries
    query: (text, params) => pool.query(text, params),
    
    // Función para obtener el pool, útil para transacciones y connect-pg-simple
    getPool: () => pool,
};

export default db;