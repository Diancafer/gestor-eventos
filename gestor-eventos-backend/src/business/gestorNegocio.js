import { TX } from './txKeys.js';

export default class gestorNegocio {
  async ejecutarMetodo(usuarioId, nombreMetodo, datos = {}) {
    const metodoNormalizado = nombreMetodo.trim().toLowerCase();

    
    const llave = TX[metodoNormalizado.toUpperCase()];
    if (!llave) {
      throw new Error(`Llave no definida para el método: ${nombreMetodo}`);
    }

    try {
     
      const modulo = await import(`./${metodoNormalizado}.js`);
      const objetoNegocio = modulo.default;

      
      if (!objetoNegocio || typeof objetoNegocio.ejecutar !== 'function') {
        throw new Error(`El objeto de negocio ${nombreMetodo} no implementa ejecutar()`);
      }

      
      if (typeof objetoNegocio.validar === 'function') {
        objetoNegocio.validar(datos);
      }

      
      return await objetoNegocio.ejecutar(usuarioId, datos);
    } catch (error) {
      throw error;
    }
  }


}

