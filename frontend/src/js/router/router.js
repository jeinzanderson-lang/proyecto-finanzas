// src/js/router/router.js
import { sessionService } from '../auth/session.service.js';
import { moduleGuard } from './guards.js';
import { getCurrentRoute, navigateTo } from './routes.js';
import { renderNavbar, initNavbarEvents } from '../components/layout/navbar.js';
import { renderLoginPage, initLoginEvents } from '../pages/LoginPage.js';
import { renderForbiddenPage } from '../pages/ForbiddenPage.js';
import { renderDashboardPage, initDashboardCharts, initDashboardEvents } from '../pages/DashboardPage.js';
import { renderVentasPage, initVentasEvents } from '../pages/VentasPage.js';
import { renderGastosPage, initGastosEvents } from '../pages/GastosPage.js';
import { renderInventarioPage, initInventarioEvents } from '../pages/InventarioPage.js';
import { renderReportesPage, initReportesEvents } from '../pages/ReportesPage.js';
import { renderUsuariosPage, initUsuariosEvents } from '../pages/UsuariosPage.js';
import { renderConfiguracionPage, initConfiguracionEvents } from '../pages/ConfiguracionPage.js';
import { chartsService } from '../services/charts.service.js';

const moduleRenderers = {
  dashboard: () => renderDashboardPage(),
  ventas: () => renderVentasPage(),
  gastos: () => renderGastosPage(),
  inventario: () => renderInventarioPage(),
  reportes: () => renderReportesPage(),
  configuracion: () => renderConfiguracionPage(),
  usuarios: () => renderUsuariosPage(),
};

const postRenderInitializers = {
  dashboard: () => {
    chartsService.destroyAll();
    setTimeout(() => {
      initDashboardCharts();
      initDashboardEvents();
    }, 100);
  },
  ventas: () => {
    setTimeout(() => initVentasEvents(), 100);
  },
  gastos: () => {
    setTimeout(() => initGastosEvents(), 100);
  },
  inventario: () => {
    setTimeout(() => initInventarioEvents(), 100);
  },
  reportes: () => {
    setTimeout(() => {
      chartsService.destroyAll();
      initReportesEvents();
    }, 100);
  },
  usuarios: () => {
    setTimeout(() => initUsuariosEvents(), 100);
  },
  configuracion: () => {
    setTimeout(() => initConfiguracionEvents(), 100);
  },
};

export function initRouter() {
  async function handleRouteChange() {  
    const currentRoute = getCurrentRoute();
    const app = document.querySelector('#app');

    if (!sessionService.isAuthenticated()) {
      if (currentRoute !== 'login') {
        navigateTo('login');
      }
      app.innerHTML = renderLoginPage();
      setTimeout(() => initLoginEvents(), 100);
      return;
    }

    if (currentRoute === 'login') {
      navigateTo('dashboard');
      return;
    }

    const guardResult = moduleGuard(currentRoute);

    if (!guardResult.allowed) {
      if (guardResult.redirectTo === 'forbidden') {
        app.innerHTML = `
          <div class="app-container">
            ${renderNavbar()}
            <div class="main-content">
              ${renderForbiddenPage(guardResult.message)}
            </div>
          </div>
        `;
        initNavbarEvents();
      } else {
        navigateTo('login');
        app.innerHTML = renderLoginPage();
        setTimeout(() => initLoginEvents(), 100);
      }
      return;
    }

    const renderer = moduleRenderers[currentRoute] || moduleRenderers.dashboard;
const renderedPage = await renderer();

app.innerHTML = `
  <div class="app-container">
    ${renderNavbar()}
    <main class="main-content">
      ${renderedPage}
    </main>
  </div>
`;

    initNavbarEvents();

    if (postRenderInitializers[currentRoute]) {
      postRenderInitializers[currentRoute]();
    }
  }

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}