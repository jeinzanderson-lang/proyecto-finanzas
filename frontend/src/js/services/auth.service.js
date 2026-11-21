import { httpClient } from '../api/http.js';

export const authService = {
  login(username, password) {
    return httpClient.post('/auth/login', {
      username,
      password
    });
  }
};
