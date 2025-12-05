import DBComponent from '../config/db.js';
import crypto from 'crypto';
import { hashPassword, comparePassword } from '../utils/password.js';
import { sendVerificationEmail, sendResetPasswordEmail } from './emailService.js';
import { getQuery } from '../utils/queryLoader.js';

export default class AuthService {

  constructor() {
    this.db = new DBComponent();
  }

  async registerUser({ nombre, apellido, email, password, nombre_empresa, rol_id }) {
    rol_id = Number(rol_id);

    if (!nombre || !apellido || !email || !password || !nombre_empresa || isNaN(rol_id)) {
      throw new Error('Todos los campos son requeridos, incluyendo un rol válido.');
    }

    const client = await this.db.getPool().connect();
    try {
      await client.query('BEGIN');

      const userExists = await client.query(getQuery('authCheckEmailExists'), [email]);
      if (userExists.rows.length > 0) {
        throw new Error('El correo electrónico ya está en uso.');
      }

      let empresa_id;
      const empresaResult = await client.query(getQuery('authGetEmpresaByName'), [nombre_empresa]);
      if (empresaResult.rows.length > 0) {
        empresa_id = empresaResult.rows[0].id;
      } else {
        const nuevaEmpresaResult = await client.query(
          getQuery('authInsertEmpresa'),
          [nombre_empresa]
        );
        empresa_id = nuevaEmpresaResult.rows[0].id;
      }

      const rolResult = await client.query(getQuery('authCheckRolExists'), [rol_id]);
      if (rolResult.rows.length === 0) {
        throw new Error('El rol proporcionado no existe.');
      }

      const passwordHash = await hashPassword(password);
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      const newUserResult = await client.query(
        getQuery('authInsertUsuario'),
        [email, passwordHash, rol_id, empresa_id, false, verificationToken, tokenExpiration]
      );
      const nuevoUsuarioId = newUserResult.rows[0].id;

      await client.query(
        getQuery('authInsertPerfil'),
        [nuevoUsuarioId, nombre, apellido]
      );

      await sendVerificationEmail(email, verificationToken);

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async verifyEmailToken(token) {
    if (!token) throw new Error('Token de verificación requerido.');

    const client = await this.db.getPool().connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(getQuery('authGetUserByVerificationToken'), [token]);

      if (result.rows.length === 0) {
        throw new Error('El enlace de verificación es inválido o ha expirado.');
      }

      const user = result.rows[0];
      const ahora = new Date();

      if (user.expiracion_token_verificacion && user.expiracion_token_verificacion < ahora) {
        throw new Error('El enlace de verificación ha expirado. Solicita un nuevo enlace.');
      }

      let updatedUser = user;

      if (!user.correo_verificado) {
        const updateResult = await client.query(
          getQuery('authVerifyUserEmail'),
          [user.id]
        );
        updatedUser = updateResult.rows[0];
      }

      await client.query('COMMIT');
      return updatedUser;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async loginUser(email, password) {
    
    if (!email || !password) {
      const err = new Error('Email y contraseña son requeridos.');
      err.statusCode = 400;
      throw err;
     
    }

    const client = await this.db.getPool().connect();
    console.log("mensaje del cliente",client);
    
    try {
      const result = await client.query(getQuery('authGetUserByEmail'), [email]);

      const user = result.rows[0];
      if (!user) {
        const err = new Error('Credenciales inválidas.');
        err.statusCode = 401;
        throw err;
      }

      const isMatch = await comparePassword(password, user.password_hash);
      if (!isMatch) {
        const err = new Error('Credenciales inválidas.');
        err.statusCode = 401;
        throw err;
      }

      if (!user.correo_verificado) {
        const err = new Error('Tu cuenta aún no ha sido verificada. Revisa tu correo electrónico.');
        err.statusCode = 403;
        throw err;
      }

      return {
        id: user.id,
        nombre: user.nombre,
        email,
        rol_id: user.rol_id,
        rol_nombre: user.nombre_rol,
        correo_verificado: user.correo_verificado
      };
    } finally {
      client.release();
    }
  }

  async forgotPassword(email) {
    if (!email) throw new Error('El correo electrónico es requerido para recuperar la contraseña.');

    const client = await this.db.getPool().connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(getQuery('authGetUserForRecovery'), [email]);
      const user = result.rows[0];

      if (!user || !user.correo_verificado) {
        await client.query('COMMIT');
        return;
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1h

      await client.query(
        getQuery('authUpdateResetToken'),
        [resetToken, expirationDate, user.id]
      );

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      await sendResetPasswordEmail(email, resetLink);

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error('El token y la nueva contraseña son requeridos.');
    }

    const client = await this.db.getPool().connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(getQuery('authGetUserByResetToken'), [token]);
      const user = result.rows[0];

      if (!user) throw new Error('El enlace de reseteo es inválido o ya fue utilizado.');

      const ahora = new Date();
      if (user.expiracion_token_reset < ahora) {
        throw new Error('El enlace de reseteo ha expirado.');
      }

      const newPasswordHash = await hashPassword(newPassword);

      await client.query(
        getQuery('authResetPassword'),
        [newPasswordHash, user.id]
      );

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getUserById(userId) {
    if (!userId) return null;

    const client = await this.db.getPool().connect();
    try {
      const result = await client.query(getQuery('authGetUserById'), [userId]);

      if (result.rows.length === 0) return null;

      const user = result.rows[0];
      return {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol_id: user.rol_id,
        rol_nombre: user.nombre_rol
      };
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }
}

