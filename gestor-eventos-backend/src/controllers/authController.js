import AuthService from '../services/authService.js';
import Session from '../utils/Session.js';
import DBComponent from '../config/db.js';


const session = new Session();
const authService = new AuthService();
const db = new DBComponent();


// REGISTRO

export async function register(req, res) {
  try {
    const { nombre, apellido, email, password, nombre_empresa, rol_id } = req.body;
    await authService.registerUser({ nombre, apellido, email, password, nombre_empresa, rol_id });
    res.status(201).json({ message: '¡Registro exitoso! Revisa tu correo para verificar tu cuenta.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error interno del servidor.' });
  }
}


// VERIFICACIÓN DE CORREO
  export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const user = await authService.verifyEmailToken(token);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token inválido o expirado.' });
    }

    return res.status(200).json({
      success: true,
      message: '¡Correo verificado con éxito! Ya puedes iniciar sesión.',
      usuario: { id: user.id, email: user.email, verificado: user.correo_verificado }
    });
  } catch (error) {
    if (error.message.includes('inválido') || error.message.includes('expirado')) {
      try {
        const check = await db.getPool().query(
          'SELECT id, email, correo_verificado FROM usuarios WHERE token_verificacion IS NULL AND correo_verificado = TRUE LIMIT 1'
        );
        if (check.rows.length > 0) {
          return res.status(200).json({
            success: true,
            message: 'Tu correo ya estaba verificado. Ya puedes iniciar sesión.',
            usuario: { id: check.rows[0].id, email: check.rows[0].email, verificado: check.rows[0].correo_verificado }
          });
        }
      } catch (dbError) {
        return res.status(500).json({ success: false, message: 'Error al verificar el estado del usuario.' });
      }
    }

    return res.status(400).json({
      success: false,
      message: error.message || 'Error al procesar la verificación.'
    });
  }
}


// LOGIN

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    
    if (!user.correo_verificado) {
      return res.status(403).json({ message: 'Debes verificar tu correo antes de iniciar sesión.' });
    }

    const token = await session.createSession(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax'
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: user.id,
        email: user.email,
        rol_id: user.rol_id,       
        nombre: user.nombre,      
        rol_nombre: user.rol_nombre
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error interno del servidor.' });
  }
}


// LOGOUT

export async function logout(req, res) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token no encontrado.' });

    await session.destroy(token); // ahora es async y revoca en Redis
    res.clearCookie('token');
    res.status(200).json({ message: 'Sesión cerrada correctamente.' });
  } catch {
    res.status(500).json({ message: 'No se pudo cerrar la sesión.' });
  }
}

// OLVIDÉ CONTRASEÑA

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({ message: 'Si el correo existe y está verificado, se enviará un enlace de reseteo.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error interno del servidor.' });
  }
}


// RESETEAR CONTRASEÑA

export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ message: '¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error al restablecer la contraseña.' });
  }
}


// CHECK SESSION

export async function checkSession(req, res) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ logueado: false });

    const currentSession = await session.getSession(token);
    if (!currentSession) return res.status(401).json({ logueado: false });

    const user = await authService.getUserById(currentSession.userId);
    if (!user) return res.status(401).json({ logueado: false });

    res.status(200).json({ logueado: true, usuario: user });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}


export async function getProfile(req, res) {
  try {
    const { userId, rol } = req.user;
    const user = await authService.getUserById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    res.status(200).json({
      logueado: true,
      usuario: {
        id: user.id,
        email: user.email,
        rol: rol
      }
    });
  } catch {
    res.status(500).json({ message: 'Error al obtener el perfil.' });
  }
}