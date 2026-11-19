// src/js/api/http.js
import { storage } from '../utils/storage.js';
import { getErrorMessage } from '../utils/errorMessages.js';
import { navigateTo } from '../router/routes.js';

const API_URL = import.meta.env.VITE_API_URL;

export async function httpClient(endpoint, options = {}) {
  const token = storage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Manejar respuestas sin contenido (ej. 204 No Content)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      // Si es 401 (No autorizado), limpiar sesión y redirigir al login
      if (response.status === 401) {
        storage.clear();
        navigateTo('login');
        window.location.reload();
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      // Si es 403 (Prohibido), lanzar error específico
      if (response.status === 403) {
        throw new Error(data.message || 'No tienes permisos para realizar esta acción.');
      }
      
      throw new Error(data.message || getErrorMessage(response.status));
    }

    return data;
  } catch (error) {
    // Errores de red (backend caído)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    }
    throw error;
  }
}
