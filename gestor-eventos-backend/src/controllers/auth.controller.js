import * as authService from '../services/authService.js';

export async function register(req, res) {
  try {
    const { nombre, apellido, email, password, nombre_empresa } = req.body;
    await authService.registerUser({ nombre, apellido, email, password, nombre_empresa });
    res.status(201).json({ message: '¡Registro exitoso! Revisa tu correo para verificar tu cuenta.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error interno del servidor.' });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    await authService.verifyEmailToken(token);
    res.status(200).json({ message: '¡Correo verificado con éxito! Ya puedes iniciar sesión.' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error al procesar la verificación.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    req.session.userId = user.id;
    res.status(200).json({ message: 'Inicio de sesión exitoso.', usuario: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error interno del servidor.' });
  }
}

export async function logout(req, res) {
  try {
    req.session.destroy(() => res.status(200).json({ message: 'Sesión cerrada.' }));
  } catch {
    res.status(500).json({ message: 'No se pudo cerrar la sesión.' });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({ message: 'Si el correo existe y está verificado, se enviará un enlace de reseteo.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error interno del servidor.' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ message: '¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error al restablecer la contraseña.' });
  }
}

export async function checkSession(req, res) {
  try {
    const user = await authService.getUserBySession(req.session.userId);
    if (!user) return res.status(401).json({ logueado: false });
    res.status(200).json({ logueado: true, usuario: user });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}