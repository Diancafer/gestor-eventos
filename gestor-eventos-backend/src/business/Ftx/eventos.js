// src/ftx/Eventos.js
import crearEventoATX from '../Atx/crear_evento.js';
import reservarLugarATX from '../Atx/reservar_lugar.js';
import registrarAsistenciaATX from '../Atx/registrar_asistencia.js';
import visualizarEventosATX from '../Atx/visualizar_eventos.js';

export default class Eventos {
  async crear_evento(usuarioId, datos) {
    crearEventoATX.validar(datos);
    return await crearEventoATX.ejecutar(usuarioId, datos);
  }

  async reservar_lugar(usuarioId, datos) {
    reservarLugarATX.validar(datos);
    return await reservarLugarATX.ejecutar(usuarioId, datos);
  }

  async registrar_asistencia(usuarioId, datos) {
    registrarAsistenciaATX.validar(datos);
    return await registrarAsistenciaATX.ejecutar(usuarioId, datos);
  }

  async visualizar_eventos(usuarioId, datos) {
  visualizarEventosATX.validar(datos);
  const eventos = await visualizarEventosATX.ejecutar(usuarioId, datos);
  return { success: true, eventos: Array.isArray(eventos) ? eventos : [] };
  }
}