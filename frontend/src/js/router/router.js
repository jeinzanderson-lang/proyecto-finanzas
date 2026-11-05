// src/js/router/router.js
import { sessionService } from '../auth/session.service.js';
import { moduleGuard } from './guards.js';
import { getCurrentRoute, navigateTo } from './routes.js';
import { renderSidebar, initSidebarEvents } from '../components/layout/Sidebar.js';
import { renderLoginPage } from '../pages/LoginPage.js';
import { renderForbiddenPage } from '../pages/ForbiddenPage.js';
import { renderUsersPage } from '../pages/UsersPage.js';
import { renderVentasPage, initVentasEvents } from '../pages/VentasPage.js';
import { renderDashboardPage, initDashboardCharts } from '../pages/DashboardPage.js';
import { chartsService } from '../services/charts.service.js';

const moduleRenderers = {
  dashboard: () => renderDashboardPage(),
  ventas: () => renderVentasPage(),
  gastos: () => `<h2 class="h4 fw-bold mb-4">Gastos</h2><div class="alert alert-info">Módulo en desarrollo (Sprint 6).</div>`,
  inventario: () => `<h2 class="h4 fw-bold mb-4">Inventario</h2><div class="alert alert-info">Módulo en desarrollo (Sprint 7).</div>`,
  reportes: () => `<h2 class="h4 fw-bold mb-4">Reportes</h2><div class="alert alert-info">Módulo en desarrollo (Sprint 8).</div>`,
  configuracion: () => `<h2 class="h4 fw-bold mb-4">Configuración</h2><div class="alert alert-info">Módulo en desarrollo (Sprint 9).</div>`,
  usuarios: () => renderUsersPage(),
};

const postRenderInitializers = {
  dashboard: () => {
    chartsService.destroyAll();
    setTimeout(() => initDashboardCharts(), 50);
  },
  ventas: () => {
    setTimeout(() => initVentasEvents(), 50);
  },
};

export function initRouter() {
  function handleRouteChange() {
    const currentRoute = getCurrentRoute();
    const app = document.querySelector('#app');

    if (!sessionService.isAuthenticated()) {
      if (currentRoute !== 'login') navigateTo('login');
      renderLoginPage();
      return;
    }

    if (currentRoute === 'login') {
      navigateTo('dashboard');
      return;
    }

    const guardResult = moduleGuard(currentRoute);

    if (!guardResult.allowed) {
      if (guardResult.redirectTo === 'forbidden') {
        renderForbiddenPage(guardResult.message);
        document.getElementById('sidebar-container').innerHTML = renderSidebar();
        initSidebarEvents();
      } else {
        navigateTo('login');
        renderLoginPage();
      }
      return;
    }

    const renderer = moduleRenderers[currentRoute] || moduleRenderers.dashboard;
    
    app.innerHTML = `
      <div class="d-flex">
        <div id="sidebar-container"></div>
        <main id="main-content" class="flex-grow-1 p-4 bg-light" style="min-height: 100vh;">
          ${renderer()}
        </main>
      </div>
    `;

    document.getElementById('sidebar-container').innerHTML = renderSidebar();
    initSidebarEvents();

    if (postRenderInitializers[currentRoute]) {
      postRenderInitializers[currentRoute]();
    }
  }

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}
