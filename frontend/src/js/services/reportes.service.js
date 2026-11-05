// src/js/services/reportes.service.js
import { ventasService } from './ventas.service.js';
import { gastosService } from './gastos.service.js';
import { inventarioService } from './inventario.service.js';

export const reportesService = {
  // 1. Resumen Financiero General
  getResumenFinanciero() {
    const ventas = ventasService.getAll();
    const gastos = gastosService.getAll();
    
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
    const utilidad = totalVentas - totalGastos;
    const margen = totalVentas > 0 ? ((utilidad / totalVentas) * 100).toFixed(1) : 0;

    return { totalVentas, totalGastos, utilidad, margen };
  },

  // 2. Ventas por Método de Pago (Para gráfico de dona)
  getVentasPorMetodoPago() {
    const ventas = ventasService.getAll();
    const metodos = {};
    ventas.forEach(v => {
      metodos[v.metodoPago] = (metodos[v.metodoPago] || 0) + v.total;
    });
    return {
      labels: Object.keys(metodos),
      data: Object.values(metodos),
    };
  },

  // 3. Gastos por Categoría (Para gráfico de barras)
  getGastosPorCategoria() {
    const gastos = gastosService.getAll();
    const categorias = {};
    gastos.forEach(g => {
      categorias[g.categoria] = (categorias[g.categoria] || 0) + g.monto;
    });
    return {
      labels: Object.keys(categorias),
      data: Object.values(categorias),
    };
  },

  // 4. Valorización de Inventario por Categoría
  getInventarioPorCategoria() {
    const productos = inventarioService.getAll();
    const categorias = {};
    productos.forEach(p => {
      const valor = p.precio * p.stock;
      categorias[p.categoria] = (categorias[p.categoria] || 0) + valor;
    });
    return {
      labels: Object.keys(categorias),
      data: Object.values(categorias),
    };
  },

  // 5. Productos con mayor valor en stock (Top 5)
  getTopProductosValor() {
    const productos = inventarioService.getAll();
    return productos
      .map(p => ({ ...p, valorTotal: p.precio * p.stock }))
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 5);
  },

  // 6. Exportar datos a CSV
  exportarCSV(datos, nombreArchivo) {
    if (!datos || datos.length === 0) return alert('No hay datos para exportar');
    
    const headers = Object.keys(datos[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    datos.forEach(row => {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${nombreArchivo}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  },
  // 7. Ventas por Cliente (Top 5)
  getVentasPorCliente() {
    const ventas = ventasService.getAll();
    const clientes = {};
    ventas.forEach(v => {
      clientes[v.cliente] = (clientes[v.cliente] || 0) + v.total;
    });
    return {
      labels: Object.keys(clientes),
      data: Object.values(clientes),
    };
  },

  // 8. Ventas por Producto (Top 5)
  getVentasPorProducto() {
    const ventas = ventasService.getAll();
    const productos = {};
    ventas.forEach(v => {
      productos[v.producto] = (productos[v.producto] || 0) + v.cantidad;
    });
    return {
      labels: Object.keys(productos),
      data: Object.values(productos),
    };
  },

  // 9. Resumen de ventas por estado
  getVentasPorEstado() {
    const ventas = ventasService.getAll();
    const estados = {};
    ventas.forEach(v => {
      estados[v.estado] = (estados[v.estado] || 0) + v.total;
    });
    return {
      labels: Object.keys(estados),
      data: Object.values(estados),
    };
  },

  // 10. Obtener todas las ventas para exportar
  getAllVentas() {
    return ventasService.getAll();
  },
};