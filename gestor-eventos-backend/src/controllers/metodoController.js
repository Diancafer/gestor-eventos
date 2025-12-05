// src/controllers/metodo.controller.js
import ToProcess from '../business/ToProcess.js';

export async function procesarMetodo(req, res) {
  try {
    const resultado = await new ToProcess().ejecutar(req);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}