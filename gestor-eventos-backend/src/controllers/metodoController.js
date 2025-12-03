import toProcess from '../routes/metodo.routes.js'; 

export async function procesarMetodo(req, res) {
  try {
    const resultado = await new toProcess().ejecutar(req);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}