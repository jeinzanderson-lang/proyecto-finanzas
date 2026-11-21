import { httpClient } from '../api/http.js';

export const ventasService = {
  getAll() {
    return httpClient.get('/ventas');
  },

  create(data) {
    return httpClient.post('/ventas', data);
  },

  update(id, data) {
    return httpClient.patch(`/ventas/${id}`, data);
  },

  delete(id) {
    return httpClient.delete(`/ventas/${id}`);
  }
};
