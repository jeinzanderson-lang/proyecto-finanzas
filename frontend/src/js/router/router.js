// src/js/router/router.js
import { sessionService } from '../auth/session.service.js';
import { moduleGuard } from './guards.js';
import { getCurrentRoute, navigateTo, routes } from './routes.js';
import { renderSidebar, initSidebarEvents } from '../components/layout/Sidebar.js';
import { renderLoginPage } from '../pages/LoginPage.js';
import { renderForbiddenPage } from '../pages/ForbiddenPage.js';
import { renderUsersPage } from '../pages/UsersPage.js';

// Mapa de renderizado de módulos
const moduleRenderers = {
  dashboard: () => `
    <h2 class="h4 fw-bold mb-4">Dashboard</h2>
    <div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>Módulo en desarrollo (Sprint 4).</div>
  `,
  ventas: () => `
    <h2 class="h4 fw-bold mb-4">Ventas</h2>
    <div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>Módulo en desarrollo (Sprint 5).</div>
  `,
  gastos: () => `<h2 class="h4 fw-bold mb-4">Gastos</h2><div class="alert alert-info">Módulo futuro.</div>`,
  inventario: () => `<h2 class="h4 fw-bold mb-4">Inventario</h2><div class="alert alert-info">Módulo futuro.</div>`,
  reportes: () => `<h2 class="h4 fw-bold mb-4">Reportes</h2><div class="alert alert-info">Módulo futuro.</div>`,
  configuracion: () => `<h2 class="h4 fw-bold mb-4">Configuración</h2><div class="alert alert-info">Módulo futuro.</div>`,
  usuarios: () => renderUsersPage(),
};

export function initRouter() {
  function handleRouteChange() {
    const currentRoute = getCurrentRoute();
    const app = document.querySelector('#app');

    // 1. Si no está autenticado
    if (!sessionService.isAuthenticated()) {
      if (currentRoute !== 'login') {
        navigateTo('login');
      }
      renderLoginPage();
      return;
    }

    // 2. Si está autenticado pero intenta ir al login, redirigir al dashboard
    if (currentRoute === 'login') {
      navigateTo('dashboard');
      return;
    }

    // 3. Aplicar Guard de Módulo
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

    // 4. Renderizar Layout Principal
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
  }

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}
