// src/services/authService.js
import db from '../config/db.js';
import crypto from 'crypto';
import { hashPassword, comparePassword } from '../utils/password.js';
import { sendVerificationEmail, sendResetPasswordEmail } from './emailService.js';

// =======================================================
// REGISTRO DE USUARIO
// =======================================================
export async function registerUser({ nombre, apellido, email, password, nombre_empresa }) {
  if (!nombre || !apellido || !email || !password || !nombre_empresa) {
    throw new Error('Todos los campos son requeridos.');
  }

  const client = await db.getPool().connect();
  try {
    await client.query('BEGIN');

    const userExists = await client.query('SELECT email FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      throw new Error('El correo electrónico ya está en uso.');
    }

    // Empresa
    let empresa_id;
    const empresaResult = await client.query('SELECT id FROM empresas WHERE nombre_empresa = $1', [nombre_empresa]);
    if (empresaResult.rows.length > 0) {
      empresa_id = empresaResult.rows[0].id;
    } else {
      const nuevaEmpresaResult = await client.query(
        'INSERT INTO empresas (nombre_empresa) VALUES ($1) RETURNING id',
        [nombre_empresa]
      );
      empresa_id = nuevaEmpresaResult.rows[0].id;
    }

    // Rol por defecto
    const defaultRoleResult = await client.query(
      "SELECT id FROM roles WHERE nombre_rol = 'Miembro de Equipo'"
    );
    if (defaultRoleResult.rows.length === 0) {
      throw new Error("Error de configuración: El rol 'Miembro de Equipo' no existe.");
    }
    const defaultRoleId = defaultRoleResult.rows[0].id;

    // Usuario + perfil
    const passwordHash = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const newUserResult = await client.query(
      `INSERT INTO usuarios (email, password_hash, rol_id, empresa_id, correo_verificado, token_verificacion, expiracion_token_verificacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [email, passwordHash, defaultRoleId, empresa_id, false, verificationToken, tokenExpiration]
    );
    const nuevoUsuarioId = newUserResult.rows[0].id;

    await client.query(
      'INSERT INTO perfiles (usuario_id, nombre, apellido) VALUES ($1, $2, $3)',
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

// =======================================================
// VERIFICACIÓN DE CORREO
// =======================================================
export async function verifyEmailToken(token) {
  if (!token) throw new Error('Token de verificación requerido.');

  const client = await db.getPool().connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'SELECT id, email, correo_verificado, expiracion_token_verificacion FROM usuarios WHERE token_verificacion = $1',
      [token]
    );

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
        `UPDATE usuarios 
         SET correo_verificado = TRUE, token_verificacion = NULL, expiracion_token_verificacion = NULL 
         WHERE id = $1 
         RETURNING id, email, correo_verificado`,
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

// =======================================================
// LOGIN
// =======================================================
export async function loginUser(email, password) {
  if (!email || !password) {
    const err = new Error('Email y contraseña son requeridos.');
    err.statusCode = 400;
    throw err;
  }

  const client = await db.getPool().connect();
  try {
    const result = await client.query(
      `SELECT 
          u.id, 
          u.password_hash, 
          u.correo_verificado, 
          p.nombre, 
          r.nombre_rol 
       FROM usuarios u
       JOIN perfiles p ON u.id = p.usuario_id
       JOIN roles r ON u.rol_id = r.id
       WHERE u.email = $1`,
      [email]
    );

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
      nombre_rol: user.nombre_rol
    };
  } finally {
    client.release();
  }
}

// =======================================================
// RECUPERACIÓN DE CONTRASEÑA
// =======================================================
export async function forgotPassword(email) {
  if (!email) throw new Error('El correo electrónico es requerido para recuperar la contraseña.');

  const client = await db.getPool().connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'SELECT id, email, correo_verificado FROM usuarios WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    // Silencioso: no revela si existe o no; sólo actúa si está verificado
    if (!user || !user.correo_verificado) {
      await client.query('COMMIT');
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await client.query(
      'UPDATE usuarios SET token_reset_password = $1, expiracion_token_reset = $2 WHERE id = $3',
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

export async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('El token y la nueva contraseña son requeridos.');
  }

  const client = await db.getPool().connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'SELECT id, expiracion_token_reset FROM usuarios WHERE token_reset_password = $1',
      [token]
    );
    const user = result.rows[0];

    if (!user) throw new Error('El enlace de reseteo es inválido o ya fue utilizado.');

    const ahora = new Date();
    if (user.expiracion_token_reset < ahora) {
      throw new Error('El enlace de reseteo ha expirado.');
    }

    const newPasswordHash = await hashPassword(newPassword);

    await client.query(
      `UPDATE usuarios
       SET password_hash = $1,
           token_reset_password = NULL,
           expiracion_token_reset = NULL
       WHERE id = $2`,
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

// =======================================================
// SESIÓN
// =======================================================
export async function getUserBySession(userId) {
  if (!userId) return null;

  const client = await db.getPool().connect();
  try {
    const result = await client.query(
      `SELECT 
          u.id, 
          p.nombre, 
          u.email, 
          r.nombre_rol 
       FROM usuarios u
       JOIN perfiles p ON u.id = p.usuario_id
       JOIN roles r ON u.rol_id = r.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      nombre_rol: user.nombre_rol
    };
  } finally {
    client.release();
  }
}