// src/business/gestorNegocio.js
import Usuarios from './Ftx/usuarios.js';
import Eventos from './Ftx/eventos.js';
import Finanzas from './Ftx/finanzas.js';
import DBComponent from '../config/db.js';

export default class GestorNegocio {
  constructor() {
    this.db = new DBComponent();
    this.objetos = {
      usuarios: new Usuarios(),
      finanzas: new Finanzas(),
      eventos: new Eventos()
    };
  }

  async ejecutarMetodo(userId, llave, datos = {}) {
    const partes = llave.toLowerCase().split('.');
    if (partes.length !== 3) {
      throw new Error(`Formato de llave inválido: ${llave}`);
    }

    const [subsistema, metodo, objeto] = partes;

    const instancia = this.objetos[subsistema];
    if (!instancia) {
      throw new Error(`Subsistema no reconocido: ${subsistema}`);
    }

    const target = instancia[metodo];
    if (!target) {
      throw new Error(`Método '${metodo}' no implementado en '${subsistema}'`);
    }

    if (typeof target === 'function') {
      return await target.call(instancia, userId, datos);
    }

    
    if (typeof target.ejecutar === 'function') {
      return await target.ejecutar(userId, datos);
    }

    throw new Error(`Método '${metodo}' no implementado correctamente en '${subsistema}'`);
  }
}