// src/js/auth/session.service.js

const TOKEN_KEY = 'ag_token';
const USER_KEY = 'ag_user';

export const sessionService = {
  login(user) {
    const token = 'token-' + Date.now() + '-' + Math.random().toString(36).substr(2);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  updateUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};