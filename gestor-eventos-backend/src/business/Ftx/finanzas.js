// src/ftx/Finanzas.js
import pagarATX from '../Atx/pagar.js';
import registrarGastoATX from '../Atx/registrar_gasto.js';
import visualizarPagosATX from '../Atx/visualizar_pagos.js';
import visualizarReportesATX from '../Atx/visualizar_reportes.js';

export default class Finanzas {
  async pagar(usuarioId, datos) {
    pagarATX.validar(datos);
    return await pagarATX.ejecutar(usuarioId, datos);
  }

  async visualizar_pagos(usuarioId, datos) {
    visualizarPagosATX.validar(datos);
    return await visualizarPagosATX.ejecutar(usuarioId, datos);
  }

  async registrar_gastos(usuarioId, datos) {
    registrarGastosATX.validar(datos);
    return await registrarGastosATX.ejecutar(usuarioId, datos);
  }

  async visualizar_reportes(usuarioId, datos) {
    visualizarReportesATX.validar(datos);
    return await visualizarReportesATX.ejecutar(usuarioId, datos);
  }
}
