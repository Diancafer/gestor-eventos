import jwt from 'jsonwebtoken';
import DBComponent from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { getRedisClient } from '../services/redisClient.js';

const SECRET = process.env.SESSION_SECRET || 'clave_secreta_por_defecto';
const EXPIRATION = '2h';

export default class Session {
  constructor() {
    this.secret = SECRET;
    this.expiration = EXPIRATION;
    this.db = new DBComponent();
  }

  async createSession(user) {
    let rol = user.rol_id;

    if (!user.rol_nombre && user.rol_id) {
      const result = await this.db.getPool().query(
        'SELECT nombre_rol FROM roles WHERE id = $1',
        [user.rol_id]
      );
      rol = result.rows[0]?.nombre_rol || 'SinRol';
    }

    const jti = uuidv4();
    const payload = { userId: user.id, rol, jti };

    const token = jwt.sign(payload, this.secret, { expiresIn: this.expiration });
    return token;
  }

  async getSession(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch {
      return null;
    }
  }

  async isBlacklisted(jti) {
    const client = await getRedisClient();
    const result = await client.get(jti);
    return result === 'revoked';
  }

  async sessionExist(token) {
    try {
      const decoded = jwt.verify(token, this.secret);
      const jti = decoded.jti || token;
      const revoked = await this.isBlacklisted(jti);
      return !revoked;
    } catch {
      return false;
    }
  }

  async destroy(token) {
    try {
      const decoded = jwt.decode(token);
      const jti = decoded.jti || token;
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);

      const client = await getRedisClient();
      await client.setEx(jti, ttl, 'revoked');
    } catch {
    
    }
  }
}