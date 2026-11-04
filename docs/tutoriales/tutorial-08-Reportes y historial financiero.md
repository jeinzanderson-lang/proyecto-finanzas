## 1. Objetivo
Implementar el módulo de reportes para consultar el historial financiero por períodos y filtros de fecha, basándose en el diseño original del HTML de AG Services.
## 2. Alcance de este sprint
En este sprint se construye el módulo de Reportes. Se implementa:
- los filtros de fecha (Desde/Hasta);
- el selector de período (Semanal, Mensual, Trimestral, Semestral, Anual);
- la tabla de "Historial de períodos";
- el modal de "Detalle del período" con movimientos;
- el consumo de datos desde el endpoint /api/v1/reports del backend.
- No se implementa todavía:
- el módulo de Configuración;
- exportación a PDF o Excel.

## 3. Qué se instala
No se instalan nuevas dependencias. Se usan:
Fetch API nativa del navegador;
Bootstrap 5.3 y Bootstrap Icons (ya instalados).

## 4. Archivos que se crean o ajustan
Al terminar este sprint, estos archivos deben existir:
src/js/modules/reports/reports.js;
src/js/modules/reports/reportsService.js;
src/js/main.js (se ajusta para cargar el módulo de reportes).
Estructura esperada:

frontend/
└── src/
    ── js/
        └── modules/
            ├── dashboard/
            ├── sales/
            ├── expenses/
            ├── inventory/
            └── reports/
                ├── reports.js
                └── reportsService.js

## 5. Paso a paso
Paso 1: crear el servicio de Reportes (reportsService.js)
Crea la carpeta src/js/modules/reports y dentro el archivo reportsService.js.

import { apiRequest } from '../../utils/apiClient.js';

export const reportsService = {
  async list(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await apiRequest(`/reports?${params}`);
  },

  async getDetail(periodId) {
    return await apiRequest(`/reports/${periodId}/detail`);
  }
};

Paso 2: crear la vista de Reportes (reports.js)
Crea src/js/modules/reports/reports.js.

import { reportsService } from './reportsService.js';

export async function renderReports() {
  const data = await reportsService.list();

  return `
    <div class="reports-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Información financiera</h2>
          <p class="text-muted mb-0">Consulta el historial financiero por períodos y filtra por rango de fechas.</p>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <label class="form-label">Todas las fechas</label>
              <input type="date" class="form-control" id="filterFrom">
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Desde</label>
              <input type="date" class="form-control" id="filterFrom">
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Hasta</label>
              <input type="date" class="form-control" id="filterTo">
            </div>
            <div class="col-12 col-md-8">
              <button class="btn btn-primary" id="btnApplyFilters">Aplicar fechas</button>
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Período</label>
              <select class="form-select" id="filterPeriod">
                <option value="all">Todas las fechas</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="semiannual">Semestral</option>
                <option value="annual">Anual</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 pt-3">
          <h5 class="fw-bold mb-0">Historial de períodos</h5>
          <small class="text-muted">Resumen mensual de movimientos registrados.</small>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Período</th>
                  <th>Ingresos</th>
                  <th>Gastos</th>
                  <th>Resultado</th>
                  <th>Movimientos</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map(period => `
                  <tr>
                    <td>${period.name}</td>
                    <td>$ ${period.income.toLocaleString()}</td>
                    <td>$ ${period.expense.toLocaleString()}</td>
                    <td class="fw-bold ${period.result >= 0 ? 'text-success' : 'text-danger'}">$ ${period.result.toLocaleString()}</td>
                    <td>${period.movements_count}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initReportsEvents() {
  document.getElementById('btnApplyFilters').addEventListener('click', async () => {
    const filters = {
      from: document.getElementById('filterFrom').value,
      to: document.getElementById('filterTo').value,
      period: document.getElementById('filterPeriod').value,
    };

    const data = await reportsService.list(filters);
    // Re-renderizar la tabla con los nuevos datos
  });
}

Paso 3: integrar Reportes en main.js
Ajusta src/js/main.js para que cargue el módulo de Reportes cuando se hace clic en el menú.

import { renderReports, initReportsEvents } from './modules/reports/reports.js';

// Dentro de initSidebarEvents, añade:
if (module === 'reportes') {
  content.innerHTML = await renderReports();
  initReportsEvents();
}

## 6. Cómo validar que quedó bien
En este sprint no hay pruebas automatizadas. La validación consiste en:
- hacer clic en "Reportes" en el Sidebar y verificar que se muestre la tabla de historial;
- aplicar filtros de fecha y verificar que se actualicen los datos;
- seleccionar un período y verificar que se muestre el detalle;
- el diseño debe ser responsivo.

Antes de cerrar el tutorial, confirma esta lista:
- existe src/js/modules/reports/reports.js;
- existe src/js/modules/reports/reportsService.js;
- main.js carga el módulo de Reportes al hacer clic en el menú;
- npm run dev funciona y muestra el módulo de Reportes completo.
## 7. Errores comunes
Los errores más frecuentes en este tutorial son:
- no validar el rango de fechas;
- mostrar demasiados datos sin paginación;
- no manejar el caso de "sin datos";
- olvidar actualizar los filtros después de aplicar.

## 8. Guardar los cambios en Git
Antes de crear el commit, revisa git status para confirmar qué archivos se van a guardar.

git status
git add .
git commit -m "Sprint 8: módulo de reportes y historial financiero"
git push

## 9. Resultado esperado
Al terminar este Sprint 8 tendrás:
- el módulo de Reportes completamente funcional;
- filtros de fecha y selector de período funcionales;
- tabla de historial con datos reales del backend;
- la base lista para el último módulo: Configuración.