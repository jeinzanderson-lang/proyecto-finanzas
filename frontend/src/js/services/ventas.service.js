// src/js/services/ventas.service.js

// Datos simulados de ventas
let ventasMock = [
  { id: 1, numero: 'FAC-001', fecha: '2026-11-01', cliente: 'Empresa ABC', producto: 'Laptop Dell', cantidad: 2, precioUnitario: 1200.00, total: 2400.00, estado: 'Completada', metodoPago: 'Transferencia' },
  { id: 2, numero: 'FAC-002', fecha: '2026-11-02', cliente: 'Cliente XYZ', producto: 'Mouse Inalámbrico', cantidad: 10, precioUnitario: 25.50, total: 255.00, estado: 'Pendiente', metodoPago: 'Efectivo' },
  { id: 3, numero: 'FAC-003', fecha: '2026-11-03', cliente: 'Distribuidora Sur', producto: 'Teclado Mecánico', cantidad: 5, precioUnitario: 85.00, total: 425.00, estado: 'Completada', metodoPago: 'Tarjeta' },
  { id: 4, numero: 'FAC-004', fecha: '2026-11-04', cliente: 'Tech Solutions', producto: 'Monitor 27"', cantidad: 3, precioUnitario: 350.00, total: 1050.00, estado: 'Cancelada', metodoPago: 'Transferencia' },
  { id: 5, numero: 'FAC-005', fecha: '2026-11-04', cliente: 'Oficina Central', producto: 'Silla Ergonómica', cantidad: 4, precioUnitario: 280.00, total: 1120.00, estado: 'Completada', metodoPago: 'Crédito' },
];

let nextId = 6;

export const ventasService = {
  /**
   * Obtener todas las ventas (con filtros opcionales)
   */
  getAll(filtros = {}) {
    let resultado = [...ventasMock];

    // Filtro por estado
    if (filtros.estado) {
      resultado = resultado.filter(v => v.estado === filtros.estado);
    }

    // Filtro por búsqueda (cliente o número)
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(v => 
        v.cliente.toLowerCase().includes(busqueda) || 
        v.numero.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  },

  /**
   * Obtener una venta por ID
   */
  getById(id) {
    return ventasMock.find(v => v.id === id) || null;
  },

  /**
   * Crear una nueva venta
   */
  create(venta) {
    const nuevaVenta = {
      id: nextId++,
      numero: `FAC-${String(nextId - 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Pendiente',
      ...venta,
      total: venta.cantidad * venta.precioUnitario,
    };
    ventasMock.push(nuevaVenta);
    return nuevaVenta;
  },

  /**
   * Actualizar una venta existente
   */
  update(id, datosActualizados) {
    const index = ventasMock.findIndex(v => v.id === id);
    if (index === -1) return null;

    ventasMock[index] = {
      ...ventasMock[index],
      ...datosActualizados,
      total: datosActualizados.cantidad * datosActualizados.precioUnitario,
    };
    return ventasMock[index];
  },

  /**
   * Eliminar una venta
   */
  delete(id) {
    const index = ventasMock.findIndex(v => v.id === id);
    if (index === -1) return false;
    ventasMock.splice(index, 1);
    return true;
  },

  /**
   * Obtener estadísticas de ventas
   */
  getEstadisticas() {
    const total = ventasMock.reduce((sum, v) => sum + v.total, 0);
    const completadas = ventasMock.filter(v => v.estado === 'Completada').length;
    const pendientes = ventasMock.filter(v => v.estado === 'Pendiente').length;
    const canceladas = ventasMock.filter(v => v.estado === 'Cancelada').length;

    return {
      totalVentas: ventasMock.length,
      montoTotal: total,
      completadas,
      pendientes,
      canceladas,
    };
  },
};