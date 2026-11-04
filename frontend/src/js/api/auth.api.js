
import { httpClient } from './http.js';

export const authApi = {
  async login(username, password) {
    return httpClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async register(data) {
    return httpClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout() {
    // Si tu backend tiene un endpoint de logout, úsalo. Si no, puedes dejarlo vacío.
    return httpClient('/auth/logout', {
      method: 'POST',
    });
  },
};