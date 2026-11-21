import { httpClient } from '../api/http.js';

export const gastosService = {
  getAll() {
    return httpClient.get('/gastos');
  },

  create(data) {
    return httpClient.post('/gastos', data);
  },

  update(id, data) {
    return httpClient.patch(`/gastos/${id}`, data);
  },

  delete(id) {
    return httpClient.delete(`/gastos/${id}`);
  }
};
