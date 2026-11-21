// src/js/auth/session.service.js
import { storage } from '../utils/storage.js';

export const sessionService = {
  login(token, user) {
    storage.setToken(token);
    storage.setUser(user);

    return { token, user };
  },

  logout() {
    storage.clear();
  },

  isAuthenticated() {
    return storage.isAuthenticated();
  },

  getToken() {
    return storage.getToken();
  },

  getUser() {
    return storage.getUser();
  },

  updateUser(user) {
    storage.setUser(user);
  }
};