import { transporter } from '../config/mailer.js';

export async function sendVerificationEmail(email, token) {
  //  query string en lugar de /:token
  const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verifica tu cuenta de correo electrónico',
    text: `Haz clic en el siguiente enlace para verificar tu cuenta: ${verificationLink}`,
    html: `
      <h2>¡Hola!</h2>
      <p>Gracias por registrarte.</p>
      <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;color:white;background:#4CAF50;border-radius:5px;text-decoration:none">
        Verificar mi cuenta
      </a>
      <p>Este enlace expirará en 24 horas.</p>
    `
  };
  return transporter.sendMail(mailOptions);
}

export async function sendResetPasswordEmail(email, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Solicitud de Restablecimiento de Contraseña',
    text: `Has solicitado restablecer tu contraseña. Enlace: ${resetLink} (válido por 1 hora).`,
    html: `
      <h2>Restablecer Contraseña</h2>
      <p>Has solicitado restablecer tu contraseña.</p>
      <a href="${resetLink}" style="display:inline-block;padding:10px 20px;color:white;background:#f39c12;border-radius:5px;text-decoration:none">
        Restablecer Contraseña
      </a>
      <p>Este enlace expira en 1 hora.</p>
    `
  };
  return transporter.sendMail(mailOptions);
}