// src/js/utils/errorMessages.js

export const errorMessages = {
  400: 'Los datos enviados no son válidos. Revisa el formulario.',
  401: 'Sesión expirada o credenciales incorrectas. Por favor, inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  500: 'Error en el servidor. Intenta más tarde.',
  default: 'Ocurrió un error inesperado. Revisa tu conexión.',
};

export function getErrorMessage(statusCode) {
  return errorMessages[statusCode] || errorMessages.default;
}