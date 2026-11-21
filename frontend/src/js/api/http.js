// src/js/api/http.js
import { storage } from '../utils/storage.js';
import { getErrorMessage } from '../utils/errorMessages.js';
import { navigateTo } from '../router/routes.js';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function construirUrl(endpoint, params = {}) {
  const url = new URL(`${API_URL}${endpoint}`);

  Object.entries(params).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.append(clave, valor);
    }
  });

  return url.toString();
}

export async function httpClient(endpoint, options = {}) {
  const token = storage.getToken();

  const {
    params = {},
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };

  try {
    const response = await fetch(construirUrl(endpoint, params), {
      ...fetchOptions,
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      const mensaje =
        data.message ||
        data.error?.message ||
        getErrorMessage(response.status);

      // No recargar la página cuando las credenciales del login sean incorrectas
      if (response.status === 401 && endpoint !== '/auth/login') {
        storage.clear();
        navigateTo('login');

        setTimeout(() => {
          window.location.reload();
        }, 100);

        throw new Error(
          'Sesión expirada. Por favor, inicia sesión nuevamente.'
        );
      }

      if (response.status === 403) {
        throw new Error(
          mensaje || 'No tienes permisos para realizar esta acción.'
        );
      }

      throw new Error(mensaje);
    }

    return data;

  } catch (error) {
    if (
      error.name === 'TypeError' &&
      error.message.toLowerCase().includes('fetch')
    ) {
      throw new Error(
        'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
      );
    }

    throw error;
  }
}


// -------------------------------------------------------
// Métodos HTTP
// -------------------------------------------------------

httpClient.get = function (endpoint, options = {}) {
  return httpClient(endpoint, {
    ...options,
    method: 'GET',
  });
};

httpClient.post = function (endpoint, data, options = {}) {
  return httpClient(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

httpClient.patch = function (endpoint, data, options = {}) {
  return httpClient(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

httpClient.delete = function (endpoint, options = {}) {
  return httpClient(endpoint, {
    ...options,
    method: 'DELETE',
  });
};