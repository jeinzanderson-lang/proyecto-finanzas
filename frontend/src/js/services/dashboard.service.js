import { httpClient } from '../api/http.js';

export const dashboardService = {
  get() {
    return httpClient.get('/dashboard');
  }
};
