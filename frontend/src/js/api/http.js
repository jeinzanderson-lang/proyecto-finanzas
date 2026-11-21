import { sessionService } from '../auth/session.service.js';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:5000/api/v1';

async function request(path, options = {}) {
  const token = sessionService.getToken();

  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  let data = null;

  if (response.status !== 204) {
    const text = await response.text();

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
      data?.error?.message ||
      'Error al comunicarse con el servidor.'
    );

    error.status = response.status;

    if (response.status === 401) {
      sessionService.clear();
    }

    throw error;
  }

  return data;
}

export const httpClient = {
  get(path) {
    return request(path, { method: 'GET' });
  },

  post(path, body) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  patch(path, body) {
    return request(path, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  delete(path) {
    return request(path, {
      method: 'DELETE'
    });
  }
};
