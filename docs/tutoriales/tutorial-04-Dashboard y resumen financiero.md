## 1. Objetivo
Implementar la pantalla principal del sistema (Dashboard), mostrando el resumen financiero con las tarjetas de métricas (Ingresos, Gastos, Saldo, Alertas), la tabla de últimos movimientos y el gráfico de flujo del período, basándose en el diseño original del HTML de AG Services.

## 2. Alcance de este sprint
En este sprint se construye la vista del Dashboard. Se implementa:
- las 4 tarjetas de métricas superiores (Ingresos, Gastos, Saldo, Alertas);
- la tabla de "Últimos movimientos";
- la sección visual de "Flujo del período" (Ingresos vs Gastos);
- el consumo de datos desde el endpoint /api/v1/dashboard/summary del backend.

No se implementa todavía:
- los módulos de Ventas, Gastos, Inventario, etc.

## 3. Qué se instala
No se instalan nuevas dependencias. Se usan:
Fetch API nativa del navegador;
Bootstrap 5.3 y Bootstrap Icons (ya instalados).

## 4. Archivos que se crean o ajustan
Al terminar este sprint, estos archivos deben existir:
src/js/modules/dashboard/dashboard.js;
src/js/modules/dashboard/dashboardService.js;
src/js/main.js (se ajusta para cargar el dashboard);
src/css/main.css (se añaden estilos para las tarjetas).
Estructura esperada:

frontend/
└── src/
    ├── css/
    │   └── main.css
    ── js/
        ├── auth/
        │   ├── authService.js
        │   └── login.js
        ├── components/
        │   └── sidebar.js
        ├── modules/
        │   └── dashboard/
        │       ├── dashboard.js
        │       └── dashboardService.js
        ├── utils/
        │   ├── apiClient.js
        │   ├── roleManager.js
        │   ── tokenManager.js
        └── main.js

## 5. Paso a paso
Paso 1: crear el servicio del Dashboard (dashboardService.js)
Crea la carpeta src/js/modules/dashboard y dentro el archivo dashboardService.js para obtener los datos.

import { apiRequest } from '../../utils/apiClient.js';

export const dashboardService = {
  async getSummary() {
    return await apiRequest('/dashboard/summary');
  }
};

Paso 2: crear la vista del Dashboard (dashboard.js)
Crea src/js/modules/dashboard/dashboard.js. Este archivo renderiza el HTML exacto del diseño original de AG Services.

import { dashboardService } from './dashboardService.js';

export async function renderDashboard() {
  const data = await dashboardService.getSummary();
  const saldo = data.ingresos - data.gastos;

  return `
    <div class="dashboard-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Resumen financiero</h2>
          <p class="text-muted mb-0">Vista general del movimiento contable del negocio.</p>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="text-muted small text-uppercase fw-bold">Ingresos</h6>
              <h3 class="fw-bold text-success mb-0">$ ${data.ingresos.toLocaleString()}</h3>
              <small class="text-muted">Movimientos registrados</small>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="text-muted small text-uppercase fw-bold">Gastos</h6>
              <h3 class="fw-bold text-danger mb-0">$ ${data.gastos.toLocaleString()}</h3>
              <small class="text-muted">Egresos registrados</small>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="text-muted small text-uppercase fw-bold">Saldo</h6>
              <h3 class="fw-bold text-primary mb-0">$ ${saldo.toLocaleString()}</h3>
              <small class="text-muted">Ingresos menos gastos</small>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="text-muted small text-uppercase fw-bold">Alertas</h6>
              <h3 class="fw-bold text-warning mb-0">${data.alertas}</h3>
              <small class="text-muted">Pendientes e inventario bajo</small>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pt-3">
              <h5 class="fw-bold mb-0">Últimos movimientos</h5>
              <small class="text-muted">Ingresos y egresos recientes. Actualizado en la sesión</small>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Concepto</th>
                      <th>Estado</th>
                      <th class="text-end">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.ultimosMovimientos.map(m => `
                      <tr>
                        <td>${m.fecha}</td>
                        <td><span class="badge ${m.tipo === 'Ingreso' ? 'bg-success' : 'bg-danger'}">${m.tipo}</span></td>
                        <td>${m.concepto}</td>
                        <td>${m.estado}</td>
                        <td class="text-end fw-bold">$ ${m.valor.toLocaleString()}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 pt-3">
              <h5 class="fw-bold mb-0">Flujo del período</h5>
              <small class="text-muted">Comparación visual</small>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <div class="w-100 mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-success fw-bold">Ingresos</span>
                  <span class="text-success fw-bold">100%</span>
                </div>
                <div class="progress" style="height: 10px;">
                  <div class="progress-bar bg-success" style="width: 100%"></div>
                </div>
              </div>
              <div class="w-100">
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-danger fw-bold">Gastos</span>
                  <span class="text-danger fw-bold">${Math.round((data.gastos / data.ingresos) * 100)}%</span>
                </div>
                <div class="progress" style="height: 10px;">
                  <div class="progress-bar bg-danger" style="width: ${Math.round((data.gastos / data.ingresos) * 100)}%"></div>
                </div>
              </div>
              <div class="mt-4 text-center">
                <h6 class="fw-bold">Lectura rápida</h6>
                <p class="text-muted small mb-0">${saldo >= 0 ? 'Saldo positivo. Buen flujo de caja.' : 'Saldo negativo. Revisar gastos.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

Paso 3: integrar el Dashboard en main.js
Ajusta src/js/main.js para que cargue el Dashboard cuando se hace clic en el menú o al iniciar sesión.

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';
import { renderLogin } from './auth/login.js';
import { tokenManager } from './utils/tokenManager.js';
import { renderSidebar, initSidebarEvents } from './components/sidebar.js';
import { renderDashboard } from './modules/dashboard/dashboard.js';

function initApp() {
  if (!tokenManager.isAuthenticated()) {
    renderLogin();
    return;
  }

  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="d-flex">
      <div id="sidebar-container" class="w-25"></div>
      <main id="main-content" class="flex-grow-1 p-4 bg-light min-vh-100">
        <div class="text-center py-5"><div class="spinner-border text-primary"></div></div>
      </main>
    </div>
  `;

  document.getElementById('sidebar-container').innerHTML = renderSidebar('dashboard');

  initSidebarEvents(async (module) => {
    const content = document.getElementById('main-content');
    
    if (module === 'dashboard') {
      content.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';
      content.innerHTML = await renderDashboard();
    } else {
      content.innerHTML = `<h2>${module.charAt(0).toUpperCase() + module.slice(1)}</h2><p>Módulo en construcción...</p>`;
    }
  });

  // Cargar dashboard por defecto
  document.getElementById('main-content').innerHTML = await renderDashboard();
}

document.addEventListener('DOMContentLoaded', initApp);

## 6. Cómo validar que quedó bien
En este sprint no hay pruebas automatizadas. La validación consiste en:
- iniciar sesión y verificar que la pantalla principal muestre las 4 tarjetas (Ingresos, Gastos, Saldo, Alertas);
- la tabla de "Últimos movimientos" debe mostrar los datos del backend;
- el gráfico de barras de "Flujo del período" debe verse correctamente alineado;
- el diseño debe ser responsivo (las tarjetas se apilan en móvil).

Antes de cerrar el tutorial, confirma esta lista:
- existe src/js/modules/dashboard/dashboard.js;
- existe src/js/modules/dashboard/dashboardService.js;
- main.js carga el Dashboard al iniciar sesión;
- npm run dev funciona y muestra el Dashboard completo.

## 7. Errores comunes
Los errores más frecuentes en este tutorial son:
- usar innerHTML sin esperar a que la promesa del servicio se resuelva (provoca que la tabla salga vacía);
- no formatear los números con .toLocaleString() (se ven como 15000000 en vez de 15.000.000);
- olvidar que el Sidebar debe mantenerse fijo mientras cambia el contenido principal;
- no manejar el caso en que no haya datos (mostrar mensaje "Sin datos").

## 8. Guardar los cambios en Git
Antes de crear el commit, revisa git status para confirmar qué archivos se van a guardar.
git status
git add .
git commit -m "Sprint 4: dashboard y resumen financiero"
git push

## 9. Resultado esperado
Al terminar este Sprint 4 tendrás:
- el Dashboard completamente funcional y visualmente idéntico al HTML original;
- una arquitectura de servicios (dashboardService) separada de la vista;
- la base lista para replicar este mismo patrón (Service + View) en los módulos de Ventas, Gastos e Inventario en los siguientes sprints.
