// src/js/services/ventas.service.js
import { httpClient } from '../api/http.js';

const ENDPOINT = '/ventas';

export const ventasService = {
  async getAll(filtros = {}) {
    try {
      // httpClient debería manejar la conversión de objetos a query params (?estado=Completada&busqueda=...)
      const response = await httpClient.get(ENDPOINT, { params: filtros });
      return response.data || response; // Ajusta según cómo devuelva los datos tu httpClient
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`${ENDPOINT}/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error al obtener venta:', error);
      return null;
    }
  },

  async create(datos) {
    try {
      const response = await httpClient.post(ENDPOINT, datos);
      return response.data || response;
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  },

  async update(id, datos) {
    try {
      // Usa .put si tu httpClient/backend prefiere PUT en lugar de PATCH
      const response = await httpClient.patch(`${ENDPOINT}/${id}`, datos);
      return response.data || response;
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await httpClient.delete(`${ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      throw error;
    }
  },

  // Calcula estadísticas en tiempo real basado en los datos reales
  async getEstadisticas() {
    try {
      const ventas = await this.getAll();
      const totalVentas = ventas.length;
      const montoTotal = ventas.reduce((sum, v) => sum + (v.total || 0), 0);
      const completadas = ventas.filter(v => v.estado === 'Completada').length;
      const pendientes = ventas.filter(v => v.estado === 'Pendiente').length;

      return { totalVentas, montoTotal, completadas, pendientes };
    } catch (error) {
      return { totalVentas: 0, montoTotal: 0, completadas: 0, pendientes: 0 };
    }
  }
};