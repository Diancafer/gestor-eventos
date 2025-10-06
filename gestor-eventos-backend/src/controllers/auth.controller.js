// src/controllers/auth.controller.js

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../config/db.js';
import { transporter } from '../config/mailer.js'; 


// Función auxiliar para manejar el envío de correo de verificación
const enviarCorreoVerificacion = async (email, verificationToken) => {
    const verificationLink = `http://localhost:5185/verify-account?token=${verificationToken}`; // Usar puerto fijo 5185

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verifica tu cuenta de correo electrónico',
        text: `¡Hola! Gracias por registrarte. Por favor, verifica tu cuenta haciendo clic en este enlace: ${verificationLink}`,
        html: `
            <h2>¡Hola!</h2>
            <p>Gracias por registrarte en nuestro sistema.</p>
            <p>Por favor, haz clic en el botón de abajo para verificar tu correo electrónico:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                Verificar mi cuenta
            </a>
            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>Este enlace expirará en 24 horas.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};


// ====================================================================
// CONTROLADOR DE REGISTRO
// ====================================================================

export const register = async (req, res) => {
    const { nombre, apellido, email, password, nombre_empresa } = req.body;

    if (!nombre || !apellido || !email || !password || !nombre_empresa) {
        return res.status(400).json({ 
            message: 'Todos los campos son requeridos.' 
        });
    }

    const client = await db.getPool().connect();

    try {
        await client.query('BEGIN');

        const userExists = await client.query('SELECT email FROM usuarios WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            throw new Error('El correo electrónico ya está en uso.');
        }

        let empresa_id;
        const empresaResult = await client.query('SELECT id FROM empresas WHERE nombre_empresa = $1', [nombre_empresa]);
        if (empresaResult.rows.length > 0) {
            empresa_id = empresaResult.rows[0].id;
        } else {
            const nuevaEmpresaResult = await client.query('INSERT INTO empresas (nombre_empresa) VALUES ($1) RETURNING id', [nombre_empresa]);
            empresa_id = nuevaEmpresaResult.rows[0].id;
        }

        const defaultRoleResult = await client.query("SELECT id FROM roles WHERE nombre_rol = 'Miembro de Equipo'");
        if (defaultRoleResult.rows.length === 0) {
            throw new Error("Error de configuración: El rol 'Miembro de Equipo' no existe.");
        }
        const defaultRoleId = defaultRoleResult.rows[0].id;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        const tokenExpiration = new Date();
        tokenExpiration.setHours(tokenExpiration.getHours() + 24); 

        const newUserResult = await client.query(
            'INSERT INTO usuarios (email, password_hash, rol_id, empresa_id, token_verificacion, expiracion_token_verificacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [email, passwordHash, defaultRoleId, empresa_id, verificationToken, tokenExpiration]
        );
        const nuevoUsuarioId = newUserResult.rows[0].id;

        await client.query(
            'INSERT INTO perfiles (usuario_id, nombre, apellido) VALUES ($1, $2, $3)',
            [nuevoUsuarioId, nombre, apellido]
        );

        await enviarCorreoVerificacion(email, verificationToken);
        await client.query('COMMIT');

        res.status(201).json({
            message: '¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta.'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en el proceso de registro (transacción revertida):', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor.' });
    } finally {
        client.release();
    }
};


// ====================================================================
// CONTROLADOR DE VERIFICACIÓN DE EMAIL (Corregido para token.trim())
// ====================================================================

export const verificarEmail = async (req, res) => {
    // 🛑 LIMPIEZA CRUCIAL: Eliminar espacios en blanco alrededor del token.
    const rawToken = req.query.token;
    const token = rawToken ? rawToken.trim() : null; 

    // Log para diagnóstico:
    console.log(`[VERIFICACIÓN] Token recibido del cliente: [${token}]`); 

    if (!token) {
        return res.status(400).json({ message: 'Token de verificación requerido.' });
    }

    const client = await db.getPool().connect();

    try {
        await client.query('BEGIN');

        const userResult = await client.query(
            'SELECT id, correo_verificado, expiracion_token_verificacion FROM usuarios WHERE token_verificacion = $1', 
            [token]
        );

        if (userResult.rows.length === 0) {
            throw new Error('El enlace de verificación es inválido o ha expirado.'); 
        }
        
        const user = userResult.rows[0];
        const ahora = new Date();

        if (user.expiracion_token_verificacion && user.expiracion_token_verificacion < ahora) { 
            throw new Error('El enlace de verificación ha expirado. Por favor, regístrate de nuevo o solicita un nuevo enlace.');
        }

        if (user.correo_verificado) {
            return res.status(200).json({ message: 'Tu cuenta ya ha sido verificada.' });
        }

        await client.query(
            'UPDATE usuarios SET correo_verificado = TRUE, token_verificacion = NULL, expiracion_token_verificacion = NULL WHERE id = $1',
            [user.id]
        );

        await client.query('COMMIT');

        res.status(200).json({ message: '¡Correo verificado con éxito! Ahora puedes iniciar sesión.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en el proceso de verificación de email:', error);
        res.status(400).json({ 
            message: error.message || 'Error al procesar la verificación.' 
        });
    } finally {
        client.release();
    }
};


// ====================================================================
// CONTROLADOR DE RECUPERACIÓN DE CONTRASEÑA (Con diagnóstico y correcciones SQL)
// ====================================================================

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'El correo electrónico es requerido para recuperar la contraseña.' });
    }

    const client = await db.getPool().connect();
    console.log('[FORGOT] 1. Conexión a DB exitosa.'); 
    
    try {
        await client.query('BEGIN');

        // 1. Buscar el usuario por email
        const userResult = await client.query('SELECT id, email, correo_verificado FROM usuarios WHERE email = $1', [email]);
        const user = userResult.rows[0];
        console.log('[FORGOT] 2. Búsqueda de usuario finalizada. Usuario encontrado:', !!user); 

        // 2. Seguridad: Mensaje genérico si no existe o no está verificado.
        if (!user || !user.correo_verificado) {
            return res.status(200).json({ message: 'Si el correo existe y está verificado, se enviará un enlace de reseteo.' });
        }

        // 3. Generar token de reseteo y fecha de expiración (1 hora)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1); 

        // 4. Guardar token y expiración en la DB (Asume que las columnas existen ahora)
        await client.query(
            'UPDATE usuarios SET token_reset_password = $1, expiracion_token_reset = $2 WHERE id = $3',
            [resetToken, expirationDate, user.id]
        );
        console.log('[FORGOT] 3. Token guardado en DB.'); 

        // 5. Enviar correo con el enlace de reseteo
        const resetLink = `http://localhost:5185/reset-password?token=${resetToken}`; // Usar puerto fijo 5185
        
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Solicitud de Restablecimiento de Contraseña',
            text: `Ha solicitado restablecer su contraseña. Utilice este enlace: ${resetLink}. Es válido por 1 hora.`,
            html: `
                <h2>Restablecer Contraseña</h2>
                <p>Ha solicitado restablecer su contraseña.</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #f39c12; text-decoration: none; border-radius: 5px;">
                    Restablecer Contraseña
                </a>
                <p>Este enlace expirará en 1 hora.</p>
            `,
        });
        console.log('[FORGOT] 4. Correo enviado.'); 

        await client.query('COMMIT');

        res.status(200).json({ message: 'Si el correo existe y está verificado, se enviará un enlace de reseteo.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('================================================================');
        console.error('🛑 ERROR FATAL EN forgotPassword (Error 500):');
        console.error(error); 
        console.error('================================================================');
        res.status(500).json({ message: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
};

// ====================================================================
// CONTROLADOR DE RESTABLECIMIENTO DE CONTRASEÑA
// ====================================================================

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'El token y la nueva contraseña son requeridos.' });
    }

    const client = await db.getPool().connect();
    try {
        await client.query('BEGIN');

        const userResult = await client.query(
            'SELECT id, expiracion_token_reset FROM usuarios WHERE token_reset_password = $1',
            [token]
        );
        const user = userResult.rows[0];

        if (!user) {
            throw new Error('El enlace de reseteo es inválido o ya fue utilizado.');
        }

        const ahora = new Date();
        if (user.expiracion_token_reset < ahora) {
            throw new Error('El enlace de reseteo ha expirado.');
        }

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        await client.query(
            `UPDATE usuarios 
             SET password_hash = $1, 
                 token_reset_password = NULL, 
                 expiracion_token_reset = NULL 
             WHERE id = $2`,
            [newPasswordHash, user.id]
        );

        await client.query('COMMIT');

        res.status(200).json({ message: '¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en el proceso de reseteo de contraseña:', error);
        res.status(400).json({ message: error.message || 'Error al restablecer la contraseña.' });
    } finally {
        client.release();
    }
};


// ====================================================================
// CONTROLADOR DE LOGIN
// ====================================================================

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    const client = await db.getPool().connect();

    try {
        const userResult = await client.query(
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

        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        if (!user.correo_verificado) {
            return res.status(403).json({ 
                message: 'Tu cuenta aún no ha sido verificada. Revisa tu correo electrónico.' 
            });
        }

        req.session.userId = user.id;

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            usuario: {
                id: user.id,
                nombre: user.nombre,
                email: email
                //nombre_rol: user.nombre_rol//
            }
        });

    } catch (error) {
        console.error('Error en el proceso de login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
};


// ====================================================================
// OTROS CONTROLADORES (Logout y Verificar Sesión)
// ====================================================================

export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.status(500).json({ message: 'No se pudo cerrar la sesión.' });
        }
        res.clearCookie('connect.sid'); 
        res.status(200).json({ message: 'Sesión cerrada con éxito.' });
    });
};

export const verificarSesion = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ logueado: false });
    }

    const client = await db.getPool().connect();
    try {
        const userResult = await client.query(
            `SELECT 
                u.id, 
                p.nombre, 
                u.email, 
                r.nombre_rol 
             FROM usuarios u
             JOIN perfiles p ON u.id = p.usuario_id
             JOIN roles r ON u.rol_id = r.id
             WHERE u.id = $1`,
            [req.session.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ logueado: false });
        }

        const user = userResult.rows[0];

        res.status(200).json({
            logueado: true,
            usuario: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                nombre_rol: user.nombre_rol
            }
        });
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
};


// ====================================================================
// EXPORTACIÓN DE CONTROLADORES
// ====================================================================

export default {
    register,
    verificarEmail,
    login,
    logout,
    verificarSesion,
    forgotPassword,
    resetPassword, 
};