// src/js/services/inventario.service.js
import { httpClient } from '../api/http.js';

const ENDPOINT = '/inventario';

export const inventarioService = {
  async getAll(filtros = {}) {
    try {
      const response = await httpClient.get(ENDPOINT, { params: filtros });
      return response.data || response;
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`${ENDPOINT}/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return null;
    }
  },

  async create(datos) {
    try {
      const response = await httpClient.post(ENDPOINT, datos);
      return response.data || response;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  async update(id, datos) {
    try {
      const response = await httpClient.patch(`${ENDPOINT}/${id}`, datos);
      return response.data || response;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await httpClient.delete(`${ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  async getEstadisticas() {
    try {
      const productos = await this.getAll();
      const total = productos.length;
      const disponibles = productos.filter(p => p.estado === 'Disponible').length;
      const stockBajo = productos.filter(p => p.estado === 'Stock Bajo').length;
      const valorInventario = productos.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock || 0)), 0);

      return { total, disponibles, stockBajo, valorInventario };
    } catch (error) {
      return { total: 0, disponibles: 0, stockBajo: 0, valorInventario: 0 };
    }
  },

  async getCategorias() {
    return ['Computadores', 'Accesorios', 'Monitores', 'Impresoras', 'Almacenamiento', 'Mobiliario', 'Otros'];
  }
};