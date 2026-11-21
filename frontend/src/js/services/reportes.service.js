import { httpClient } from '../api/http.js';

export const reportesService = {
  resumen() {
    return httpClient.get('/reportes/resumen');
  },

  gastosCategoria() {
    return httpClient.get('/reportes/gastos-categoria');
  },

  ventasMetodoPago() {
    return httpClient.get('/reportes/ventas-metodo-pago');
  },

  inventarioCategoria() {
    return httpClient.get('/reportes/inventario-categoria');
  },

  topProductos() {
    return httpClient.get('/reportes/top-productos');
  },

  ventasCliente() {
    return httpClient.get('/reportes/ventas-cliente');
  }
};
