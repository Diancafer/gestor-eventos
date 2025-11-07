import { ejecutarMetodo } from '../business/gestorNegocio.js';

export async function procesarMetodo(req, res) {
 const usuarioId = req.user?.userId;
  const { nombreMetodo, datos } = req.body;

  if (!usuarioId || !nombreMetodo) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const resultado = await ejecutarMetodo(usuarioId, nombreMetodo, datos);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}