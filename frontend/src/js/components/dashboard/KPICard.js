// src/js/components/dashboard/KPICard.js

export function renderKPICards(kpis) {
  const kpiArray = Array.isArray(kpis) ? kpis : Object.values(kpis);
  
  return kpiArray.map(kpi => {
    const isPositive = kpi.tendencia === 'up';
    const trendIcon = isPositive ? 'bi-arrow-up-right' : 'bi-arrow-down-right';
    const trendClass = isPositive ? 'up' : 'down';
    const trendText = isPositive ? '↑' : '↓';
    
    return `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="kpi-card">
          <div class="kpi-label">${kpi.label}</div>
          <div class="kpi-value">${kpi.valorFormateado || kpi.valor}</div>
          <div class="kpi-trend ${trendClass}">
            <i class="bi ${trendIcon}"></i> ${kpi.cambio}% ${isPositive ? 'vs mes anterior' : 'vs mes anterior'}
          </div>
        </div>
      </div>
    `;
  }).join('');
}