import { httpClient } from '../api/http.js';

export const cuentasService = {
  getAll() {
    return httpClient.get('/cuentas');
  },

  create(data) {
    return httpClient.post('/cuentas', data);
  },

  update(id, data) {
    return httpClient.patch(`/cuentas/${id}`, data);
  },

  delete(id) {
    return httpClient.delete(`/cuentas/${id}`);
  }
};
