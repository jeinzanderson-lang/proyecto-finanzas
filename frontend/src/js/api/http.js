
import { storage } from '../utils/storage.js';
import { getErrorMessage } from '../utils/errorMessages.js';

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
      // Si es 401, limpiamos la sesión automáticamente
      if (response.status === 401) {
        storage.clear();
        window.location.reload(); // Recarga para ir al login
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