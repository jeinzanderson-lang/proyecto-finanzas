// src/js/services/gastos.service.js

// Datos simulados de gastos
let gastosMock = [
  { id: 1, numero: 'GAS-001', fecha: '2026-11-01', categoria: 'Servicios Públicos', concepto: 'Factura de electricidad', proveedor: 'Electricaribe', monto: 450.00, metodoPago: 'Transferencia', estado: 'Pagado', comprobante: 'REC-001.pdf' },
  { id: 2, numero: 'GAS-002', fecha: '2026-11-02', categoria: 'Insumos', concepto: 'Compra de papelería', proveedor: 'Papelería Central', monto: 125.50, metodoPago: 'Efectivo', estado: 'Pagado', comprobante: 'REC-002.pdf' },
  { id: 3, numero: 'GAS-003', fecha: '2026-11-03', categoria: 'Transporte', concepto: 'Combustible vehículo empresa', proveedor: 'Terpel', monto: 280.00, metodoPago: 'Tarjeta', estado: 'Pendiente', comprobante: '' },
  { id: 4, numero: 'GAS-004', fecha: '2026-11-04', categoria: 'Nómina', concepto: 'Pago quincenal empleados', proveedor: 'Interno', monto: 3500.00, metodoPago: 'Transferencia', estado: 'Pagado', comprobante: 'NOM-001.pdf' },
  { id: 5, numero: 'GAS-005', fecha: '2026-11-04', categoria: 'Mantenimiento', concepto: 'Reparación impresora', proveedor: 'TecnoService', monto: 180.00, metodoPago: 'Efectivo', estado: 'Cancelado', comprobante: '' },
];

let nextId = 6;

export const gastosService = {
  getAll(filtros = {}) {
    let resultado = [...gastosMock];

    if (filtros.estado) {
      resultado = resultado.filter(g => g.estado === filtros.estado);
    }

    if (filtros.categoria) {
      resultado = resultado.filter(g => g.categoria === filtros.categoria);
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(g =>
        g.concepto.toLowerCase().includes(busqueda) ||
        g.proveedor.toLowerCase().includes(busqueda) ||
        g.numero.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  },

  getById(id) {
    return gastosMock.find(g => g.id === id) || null;
  },

  create(gasto) {
    const nuevoGasto = {
      id: nextId++,
      numero: `GAS-${String(nextId - 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Pendiente',
      ...gasto,
    };
    gastosMock.push(nuevoGasto);
    return nuevoGasto;
  },

  update(id, datosActualizados) {
    const index = gastosMock.findIndex(g => g.id === id);
    if (index === -1) return null;
    gastosMock[index] = { ...gastosMock[index], ...datosActualizados };
    return gastosMock[index];
  },

  delete(id) {
    const index = gastosMock.findIndex(g => g.id === id);
    if (index === -1) return false;
    gastosMock.splice(index, 1);
    return true;
  },

  getEstadisticas() {
    const total = gastosMock.reduce((sum, g) => sum + g.monto, 0);
    const pagados = gastosMock.filter(g => g.estado === 'Pagado').reduce((sum, g) => sum + g.monto, 0);
    const pendientes = gastosMock.filter(g => g.estado === 'Pendiente').reduce((sum, g) => sum + g.monto, 0);

    return {
      totalGastos: gastosMock.length,
      montoTotal: total,
      montoPagado: pagados,
      montoPendiente: pendientes,
    };
  },

  getCategorias() {
    return [...new Set(gastosMock.map(g => g.categoria))];
  },
};