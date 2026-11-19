// src/js/pages/DashboardPage.js
import { mockDashboardService } from '../services/mockData.service.js';
import { chartsService } from '../services/charts.service.js';
import { renderKPICards } from '../components/dashboard/KPICard.js';
import { showToast } from '../utils/toast.js';

export function renderDashboardPage() {
  const kpis = mockDashboardService.getKPIs();
  const transacciones = mockDashboardService.getUltimasTransacciones();

  const transaccionesRows = transacciones.map(t => {
    const esIngreso = t.tipo === 'Venta' || t.tipo === 'Ingreso';
    const estadoColor = t.estado === 'Completada' || t.estado === 'Pagado' ? 'success' : t.estado === 'Pendiente' ? 'warning' : 'danger';
    return `
      <tr>
        <td>${t.fecha}</td>
        <td>
          <span class="badge ${esIngreso ? 'bg-success-subtle' : 'bg-danger-subtle'}">
            <i class="bi ${esIngreso ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle'} me-1"></i>
            ${esIngreso ? 'Ingreso' : 'Gasto'}
          </span>
        </td>
        <td>${t.cliente || t.concepto}</td>
        <td><span class="badge bg-${estadoColor}-subtle">${t.estado}</span></td>
        <td class="fw-bold ${esIngreso ? 'text-success' : 'text-danger'}">
          ${esIngreso ? '+' : '-'}$${t.monto.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="page-header d-flex justify-content-between align-items-start">
      <div>
        <div class="page-subtitle">RESUMEN FINANCIERO</div>
        <h2>Dashboard</h2>
        <p class="page-description">Vista general simulada del movimiento contable del negocio.</p>
      </div>
      <div class="badge bg-success-subtle text-success px-3 py-2">
        <i class="bi bi-circle-fill me-1" style="font-size: 0.5rem;"></i>
        Datos de demostración
      </div>
    </div>

    <div class="row g-4 mb-4">
      ${renderKPICards(kpis)}
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-8">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <h5 class="fw-bold mb-1">Últimos movimientos</h5>
              <small class="text-muted">Ingresos y egresos recientes.</small>
            </div>
            <small class="text-muted">Actualizado en la sesión</small>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Concepto</th>
                    <th>Estado</th>
                    <th class="text-end">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  ${transaccionesRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card">
          <div class="card-header">
            <h5 class="fw-bold mb-1">Flujo del período</h5>
            <small class="text-muted">Comparación visual simulada.</small>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <span class="fw-semibold">Ingresos</span>
                <span class="fw-bold">100%</span>
              </div>
              <div class="progress" style="height: 8px; border-radius: 4px;">
                <div class="progress-bar" style="width: 100%; background: var(--primary);"></div>
              </div>
            </div>
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <span class="fw-semibold">Gastos</span>
                <span class="fw-bold">34%</span>
              </div>
              <div class="progress" style="height: 8px; border-radius: 4px;">
                <div class="progress-bar" style="width: 34%; background: var(--accent);"></div>
              </div>
            </div>
            <div class="alert bg-info-subtle border-0 d-flex align-items-start">
              <i class="bi bi-info-circle-fill me-2 mt-1"></i>
              <div>
                <strong>Lectura rápida</strong>
                <div class="small text-muted">El saldo visible es positivo por $4.330.000.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initDashboardCharts() {
  // Los gráficos del dashboard anterior se pueden mantener o quitar
  // Por ahora los dejamos vacíos para el nuevo diseño
}

export function initDashboardEvents() {
  console.log('✅ Dashboard inicializado');
}