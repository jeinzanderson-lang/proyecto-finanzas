import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/main.css';

import { sessionService } from './auth/session.service.js';
import { renderLoginPage } from './pages/LoginPage.js';
import { renderSidebar, initSidebarEvents } from './components/layout/Sidebar.js';

function initApp() {
  const app = document.querySelector('#app');

  if (!sessionService.isAuthenticated()) {
    renderLoginPage();
  } else {
    renderAppLayout(app);
  }
}

function renderAppLayout(app) {
  app.innerHTML = `
    <div class="app-layout d-flex">
      <div id="sidebar-container"></div>
      <main id="main-content" class="flex-grow-1 p-4 bg-light" style="min-height: 100vh;">
        <h2 class="h4 fw-bold mb-4">Dashboard</h2>
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          El módulo de Dashboard se implementará en el Sprint 4.
          Por ahora, la sesión está activa y el Sidebar funciona.
        </div>
      </main>
    </div>
  `;

  document.getElementById('sidebar-container').innerHTML = renderSidebar('dashboard');

  initSidebarEvents((module) => {
    const content = document.getElementById('main-content');
    content.innerHTML = `
      <h2 class="h4 fw-bold mb-4">${module.charAt(0).toUpperCase() + module.slice(1)}</h2>
      <div class="alert alert-info">
        <i class="bi bi-tools me-2"></i>
        Este módulo se implementará en los próximos sprints.
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', initApp);