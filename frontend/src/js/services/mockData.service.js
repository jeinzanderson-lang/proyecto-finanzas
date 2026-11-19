// src/js/services/mockData.service.js

export const mockDashboardService = {
  getKPIs() {
    return {
      ventasMes: { valor: 45230.50, cambio: 12.5, tendencia: 'up', label: 'Ventas del mes', icon: 'bi-currency-dollar', color: 'primary' },
      gastosMes: { valor: 18450.75, cambio: -3.2, tendencia: 'down', label: 'Gastos del mes', icon: 'bi-wallet2', color: 'danger' },
      utilidad: { valor: 26779.75, cambio: 18.7, tendencia: 'up', label: 'Utilidad neta', icon: 'bi-graph-up-arrow', color: 'success' },
      inventarioBajo: { valor: 12, cambio: 4, tendencia: 'up', label: 'Productos con stock bajo', icon: 'bi-exclamation-triangle', color: 'warning' },
    };
  },
  getVentasVsGastos() {
    return {
      labels: ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre'],
      datasets: [
        { label: 'Ventas', data: [32000, 38000, 35000, 42000, 40000, 45230], borderColor: '#0d6efd', backgroundColor: 'rgba(13, 110, 253, 0.1)', tension: 0.4, fill: true },
        { label: 'Gastos', data: [20000, 22000, 19000, 24000, 21000, 18450], borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.1)', tension: 0.4, fill: true },
      ],
    };
  },
  getVentasPorCategoria() {
    return {
      labels: ['Productos', 'Servicios', 'Mantenimiento', 'Asesoría'],
      datasets: [{ data: [45, 25, 20, 10], backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#6f42c1'], borderWidth: 0 }],
    };
  },
  getUltimasTransacciones() {
    return [
      { id: 'V-001', tipo: 'Venta', cliente: 'Empresa ABC', monto: 1250.00, fecha: '2026-11-04', estado: 'Completada' },
      { id: 'G-045', tipo: 'Gasto', concepto: 'Compra de insumos', monto: 380.50, fecha: '2026-11-04', estado: 'Pagado' },
      { id: 'V-002', tipo: 'Venta', cliente: 'Cliente XYZ', monto: 890.00, fecha: '2026-11-03', estado: 'Pendiente' },
      { id: 'V-003', tipo: 'Venta', cliente: 'Distribuidora Sur', monto: 2100.00, fecha: '2026-11-02', estado: 'Completada' },
      { id: 'G-046', tipo: 'Gasto', concepto: 'Servicios públicos', monto: 450.00, fecha: '2026-11-01', estado: 'Pagado' },
    ];
  },
};