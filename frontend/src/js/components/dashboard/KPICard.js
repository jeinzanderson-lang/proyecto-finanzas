// src/js/components/dashboard/KPICard.js

export function renderKPICard(kpi) {
  const isPositive = kpi.tendencia === 'up';
  const changeColor = isPositive ? 'text-success' : 'text-danger';
  const changeIcon = isPositive ? 'bi-arrow-up-right' : 'bi-arrow-down-right';
  const changeSign = isPositive ? '+' : '';

  return `
    <div class="col-12 col-sm-6 col-lg-3 mb-4">
      <div class="card border-0 shadow-sm h-100 kpi-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="icon-box bg-${kpi.color}-subtle text-${kpi.color} rounded-3 p-2">
              <i class="bi ${kpi.icon} fs-4"></i>
            </div>
            <span class="badge ${isPositive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} rounded-pill">
              <i class="bi ${changeIcon}"></i> ${changeSign}${kpi.cambio}%
            </span>
          </div>
          <h6 class="text-muted small mb-1">${kpi.label}</h6>
          <h3 class="fw-bold mb-0">
            ${kpi.label.includes('stock') || kpi.label.includes('Productos') 
              ? kpi.valor 
              : '$' + kpi.valor.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
          </h3>
          <small class="${changeColor} mt-2 d-block">vs mes anterior</small>
        </div>
      </div>
    </div>
  `;
}

export function renderKPICards(kpis) {
  return Object.values(kpis).map(kpi => renderKPICard(kpi)).join('');
}