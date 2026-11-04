
import { authApi } from '../api/auth.api.js';
import { storage } from '../utils/storage.js';

export const sessionService = {
  async login(username, password) {
    // Llamamos al backend
    const response = await authApi.login(username, password);
    
    // Guardamos token y usuario en localStorage
    if (response.token && response.user) {
      storage.setToken(response.token);
      storage.setUser(response.user);
    }
    
    return response;
  },

  async register(data) {
    return authApi.register(data);
  },

  logout() {
    // Limpiamos la sesión local
    storage.clear();
  },

  isAuthenticated() {
    return storage.isAuthenticated();
  },

  getUser() {
    return storage.getUser();
  },
};