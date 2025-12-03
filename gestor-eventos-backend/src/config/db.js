import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export default class  DBComponent {
  constructor() {
    this.pool = new pg.Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });

    this.testConnection();
  }

  async testConnection() {
    try {
      const client = await this.pool.connect();
      console.log('Conexión exitosa a PostgreSQL');
      client.release();
    } catch (err) {
      console.error('Error al conectar a PostgreSQL:', err.message);
    }
  }

  async executeQuery(text, params) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(text, params);
      return res.rows;
    } catch (error) {
      console.error(error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  getPool() {
    return this.pool;
  }
}

;