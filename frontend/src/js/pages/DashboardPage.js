// src/js/pages/DashboardPage.js
import { mockDashboardService } from '../services/mockData.service.js';
import { chartsService } from '../services/charts.service.js';
import { renderKPICards } from '../components/dashboard/KPICard.js';

export function renderDashboardPage() {
  const kpis = mockDashboardService.getKPIs();
  const transacciones = mockDashboardService.getUltimasTransacciones();

  const transaccionesRows = transacciones.map(t => {
    const esVenta = t.tipo === 'Venta';
    const estadoColor = t.estado === 'Completada' || t.estado === 'Pagado' ? 'success' : t.estado === 'Pendiente' ? 'warning' : 'secondary';
    return `
      <tr>
        <td><span class="fw-bold text-primary">${t.id}</span></td>
        <td><span class="badge bg-${esVenta ? 'primary' : 'danger'}-subtle text-${esVenta ? 'primary' : 'danger'}">${t.tipo}</span></td>
        <td>${t.cliente || t.concepto}</td>
        <td class="fw-bold ${esVenta ? 'text-success' : 'text-danger'}">${esVenta ? '+' : '-'}$${t.monto.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
        <td class="text-muted small">${t.fecha}</td>
        <td><span class="badge bg-${estadoColor}-subtle text-${estadoColor}">${t.estado}</span></td>
      </tr>
    `;
  }).join('');

  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Dashboard Financiero</h2>
          <p class="text-muted mb-0 small">Resumen del mes de Noviembre 2026</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-calendar3 me-1"></i>Este mes</button>
          <button class="btn btn-primary btn-sm"><i class="bi bi-download me-1"></i>Exportar</button>
        </div>
      </div>
      <div class="row">${renderKPICards(kpis)}</div>
      <div class="row g-4 mb-4">
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 pt-3">
              <h5 class="fw-bold mb-0">Ventas vs Gastos</h5>
              <small class="text-muted">Últimos 6 meses</small>
            </div>
            <div class="card-body"><div style="height: 300px;"><canvas id="chartVentasGastos"></canvas></div></div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 pt-3">
              <h5 class="fw-bold mb-0">Ventas por Categoría</h5>
              <small class="text-muted">Distribución actual</small>
            </div>
            <div class="card-body"><div style="height: 300px;"><canvas id="chartCategorias"></canvas></div></div>
          </div>
        </div>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 class="fw-bold mb-0">Transacciones Recientes</h5>
            <small class="text-muted">Últimos movimientos registrados</small>
          </div>
          <a href="#" class="btn btn-sm btn-outline-primary">Ver todas</a>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
                <tr><th>ID</th><th>Tipo</th><th>Cliente / Concepto</th><th>Monto</th><th>Fecha</th><th>Estado</th></tr>
              </thead>
              <tbody>${transaccionesRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initDashboardCharts() {
  const ventasVsGastos = mockDashboardService.getVentasVsGastos();
  const ventasPorCategoria = mockDashboardService.getVentasPorCategoria();
  chartsService.createLineChart('chartVentasGastos', ventasVsGastos);
  chartsService.createDoughnutChart('chartCategorias', ventasPorCategoria);
}