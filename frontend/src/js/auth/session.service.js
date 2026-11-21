const TOKEN_KEY = 'ag_token';
const USER_KEY = 'ag_user';

export const sessionService = {
  setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    try {
      const value = localStorage.getItem(USER_KEY);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(
      this.getToken() &&
      this.getUser()
    );
  },

  isAdmin() {
    return this.getUser()?.role === 'ADMIN';
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
