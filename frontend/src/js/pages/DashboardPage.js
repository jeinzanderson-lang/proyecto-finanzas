// src/js/pages/DashboardPage.js
import { httpClient } from '../api/http.js';
import { chartsService } from '../services/charts.service.js';
import { renderKPICards } from '../components/dashboard/KPICard.js';
import { showToast } from '../utils/toast.js';
import { ventasService } from '../services/ventas.service.js'; // Para transacciones recientes

export function renderDashboardPage() {
  // Renderizamos un estado de carga inicial
  return `
    <div class="page-header d-flex justify-content-between align-items-start">
      <div>
        <div class="page-subtitle">RESUMEN FINANCIERO</div>
        <h2>Dashboard</h2>
        <p class="page-description">Cargando datos del sistema...</p>
      </div>
    </div>
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `;
}

export async function initDashboardCharts() {
  try {
    // 1. Obtener datos del dashboard
    const dashboardData = await httpClient.get('/dashboard');
    const data = dashboardData.data || dashboardData;
    
    // 2. Obtener transacciones recientes (últimas 5 ventas)
    const ventas = await ventasService.getAll();
    const transacciones = ventas.slice(0, 5).map(v => ({
      fecha: v.fecha,
      tipo: 'Venta',
      cliente: v.cliente,
      estado: v.estado,
      monto: v.total,
    }));

    // 3. Renderizar KPIs (Asumiendo que el backend devuelve kpis: { ingresos, gastos, saldo, alertas })
    // Si tu backend devuelve nombres diferentes, ajústalos aquí.
    const kpis = [
      { label: 'Ingresos', valor: data.ingresos || 0, valorFormateado: `$${(data.ingresos || 0).toLocaleString('es-CO')}`, tendencia: 'up', cambio: 0 },
      { label: 'Gastos', valor: data.gastos || 0, valorFormateado: `$${(data.gastos || 0).toLocaleString('es-CO')}`, tendencia: 'down', cambio: 0 },
      { label: 'Saldo', valor: data.saldo || 0, valorFormateado: `$${(data.saldo || 0).toLocaleString('es-CO')}`, tendencia: 'up', cambio: 0 },
      { label: 'Alertas', valor: data.alertas || 0, valorFormateado: data.alertas || 0, tendencia: 'down', cambio: 0 },
    ];

    // Re-renderizar el contenido con los datos reales
    const app = document.querySelector('#app main.main-content') || document.querySelector('#app');
    
    const transaccionesRows = transacciones.map(t => {
      const estadoColor = t.estado === 'Completada' || t.estado === 'Pagado' ? 'success' : t.estado === 'Pendiente' ? 'warning' : 'danger';
      return `
        <tr>
          <td>${t.fecha}</td>
          <td><span class="badge bg-success-subtle"><i class="bi bi-arrow-down-circle me-1"></i>Ingreso</span></td>
          <td>${t.cliente}</td>
          <td><span class="badge bg-${estadoColor}-subtle">${t.estado}</span></td>
          <td class="fw-bold text-success">+$${t.monto.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="5" class="text-center text-muted py-4">No hay movimientos recientes</td></tr>';

    app.innerHTML = `
      <div class="page-header d-flex justify-content-between align-items-start">
        <div>
          <div class="page-subtitle">RESUMEN FINANCIERO</div>
          <h2>Dashboard</h2>
          <p class="page-description">Vista general del movimiento contable del negocio.</p>
        </div>
        <div class="badge bg-success-subtle text-success px-3 py-2">
          <i class="bi bi-circle-fill me-1" style="font-size: 0.5rem;"></i>
          Datos en tiempo real
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
                  <tbody>${transaccionesRows}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="fw-bold mb-1">Flujo del período</h5>
              <small class="text-muted">Comparación visual.</small>
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
                  <span class="fw-bold">${data.gastos > 0 ? Math.round((data.gastos / data.ingresos) * 100) : 0}%</span>
                </div>
                <div class="progress" style="height: 8px; border-radius: 4px;">
                  <div class="progress-bar" style="width: ${data.gastos > 0 ? (data.gastos / data.ingresos) * 100 : 0}%; background: var(--accent);"></div>
                </div>
              </div>
              <div class="alert bg-info-subtle border-0 d-flex align-items-start">
                <i class="bi bi-info-circle-fill me-2 mt-1"></i>
                <div>
                  <strong>Lectura rápida</strong>
                  <div class="small text-muted">El saldo visible es de $${(data.saldo || 0).toLocaleString('es-CO')}.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inicializar eventos del dashboard después de renderizar
    initDashboardEvents();

  } catch (error) {
    console.error('Error cargando dashboard:', error);
    showToast('❌ Error al cargar los datos del dashboard', 'error');
  }
}

export function initDashboardEvents() {
  console.log('✅ Dashboard inicializado con datos reales');
}