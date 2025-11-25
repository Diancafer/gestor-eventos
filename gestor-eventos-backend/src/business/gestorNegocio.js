// src/bussines/gestorNegocio.js
import { TX } from './txKeys.js';

export async function ejecutarMetodo(usuarioId, nombreMetodo, datos = {}) {
  
  const metodoNormalizado = nombreMetodo.trim().toLowerCase();

 
  const llave = TX[metodoNormalizado.toUpperCase()];
  if (!llave) {
    throw new Error(`Llave no definida para el método: ${nombreMetodo}`);
  }

  try {
    
    const modulo = await import(`./${metodoNormalizado}.js`);
    const metodoEjecutable = modulo.default;

    if (typeof metodoEjecutable !== 'function') {
      throw new Error(`Método no implementado: ${nombreMetodo}`);
    }

    
    if (typeof modulo.validar === 'function') {
      modulo.validar(datos);
    }

   
    const resultado = await metodoEjecutable(usuarioId, datos);
    return resultado;
  } catch (error) {
    throw error;
  }
}