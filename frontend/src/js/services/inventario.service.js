import { httpClient } from '../api/http.js';

export const inventarioService = {
  getAll() {
    return httpClient.get('/inventario');
  },

  create(data) {
    return httpClient.post('/inventario', data);
  },

  update(id, data) {
    return httpClient.patch(`/inventario/${id}`, data);
  },

  delete(id) {
    return httpClient.delete(`/inventario/${id}`);
  }
};
