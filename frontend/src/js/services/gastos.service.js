// src/js/services/gastos.service.js
import { httpClient } from '../api/http.js';

const ENDPOINT = '/gastos';

export const gastosService = {
  async getAll(filtros = {}) {
    try {
      const response = await httpClient.get(ENDPOINT, { params: filtros });
      return response.data || response;
    } catch (error) {
      console.error('Error al obtener gastos:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const response = await httpClient.get(`${ENDPOINT}/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error al obtener gasto:', error);
      return null;
    }
  },

  async create(datos) {
    try {
      const response = await httpClient.post(ENDPOINT, datos);
      return response.data || response;
    } catch (error) {
      console.error('Error al crear gasto:', error);
      throw error;
    }
  },

  async update(id, datos) {
    try {
      const response = await httpClient.patch(`${ENDPOINT}/${id}`, datos);
      return response.data || response;
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await httpClient.delete(`${ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      throw error;
    }
  },

  async getEstadisticas() {
    try {
      const gastos = await this.getAll();
      const totalGastos = gastos.length;
      const montoTotal = gastos.reduce((sum, g) => sum + (g.monto || 0), 0);
      const montoPagado = gastos.filter(g => g.estado === 'Pagado').reduce((sum, g) => sum + (g.monto || 0), 0);
      const montoPendiente = gastos.filter(g => g.estado === 'Pendiente').reduce((sum, g) => sum + (g.monto || 0), 0);

      return { totalGastos, montoTotal, montoPagado, montoPendiente };
    } catch (error) {
      return { totalGastos: 0, montoTotal: 0, montoPagado: 0, montoPendiente: 0 };
    }
  },

  async getCategorias() {
    // Puedes hardcodearlas o pedirle al backend si tienes un endpoint para eso
    return ['Servicios Públicos', 'Insumos', 'Transporte', 'Nómina', 'Mantenimiento', 'Otros'];
  }
};