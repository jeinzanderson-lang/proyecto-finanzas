// src/js/services/reportes.service.js
import { httpClient } from '../api/http.js';

export const reportesService = {
  async getResumen() {
    try {
      const response = await httpClient.get('/reportes/resumen');
      return response.data || response;
    } catch (error) {
      console.error('Error resumen:', error);
      return null;
    }
  },

  async getGastosCategoria() {
    try {
      const response = await httpClient.get('/reportes/gastos-categoria');
      return response.data || response;
    } catch (error) {
      console.error('Error gastos categoría:', error);
      return [];
    }
  },

  async getVentasMetodoPago() {
    try {
      const response = await httpClient.get('/reportes/ventas-metodo-pago');
      return response.data || response;
    } catch (error) {
      console.error('Error ventas método pago:', error);
      return [];
    }
  },

  async getInventarioCategoria() {
    try {
      const response = await httpClient.get('/reportes/inventario-categoria');
      return response.data || response;
    } catch (error) {
      console.error('Error inventario categoría:', error);
      return [];
    }
  },

  async getTopProductos() {
    try {
      const response = await httpClient.get('/reportes/top-productos');
      return response.data || response;
    } catch (error) {
      console.error('Error top productos:', error);
      return [];
    }
  },

  async getVentasCliente() {
    try {
      const response = await httpClient.get('/reportes/ventas-cliente');
      return response.data || response;
    } catch (error) {
      console.error('Error ventas cliente:', error);
      return [];
    }
  },

  async getVentasProducto() {
    try {
      const response = await httpClient.get('/reportes/ventas-producto');
      return response.data || response;
    } catch (error) {
      console.error('Error ventas producto:', error);
      return [];
    }
  },

  async getVentasEstado() {
    try {
      const response = await httpClient.get('/reportes/ventas-estado');
      return response.data || response;
    } catch (error) {
      console.error('Error ventas estado:', error);
      return [];
    }
  },

  async getHistorialVentas() {
    try {
      const response = await httpClient.get('/reportes/ventas');
      return response.data || response;
    } catch (error) {
      console.error('Error historial ventas:', error);
      return [];
    }
  }
};