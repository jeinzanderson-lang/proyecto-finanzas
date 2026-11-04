// src/js/components/layout/Sidebar.js
import { sessionService } from '../../auth/session.service.js';
import { getAccessibleModules } from '../../auth/permissions.js';
import { routes, navigateTo, getCurrentRoute } from '../../router/routes.js';

export function renderSidebar() {
  const user = sessionService.getUser();
  if (!user) return '';

  // Obtener módulos permitidos según el rol
  const allowedModules = getAccessibleModules();
  const currentRoute = getCurrentRoute();

  // Construir los enlaces del menú dinámicamente
  const navLinks = allowedModules
    .map(moduleKey => {
      const route = routes[moduleKey];
      if (!route) return '';
      
      const isActive = currentRoute === moduleKey ? 'active' : '';
      return `
        <li class="nav-item">
          <a class="nav-link ${isActive}" href="#${route.path}">
            <i class="bi ${route.icon} me-2"></i>${route.label}
          </a>
        </li>
      `;
    })
    .join('');

  return `
    <nav class="sidebar bg-dark text-white d-flex flex-column p-3" style="min-width: 250px; min-height: 100vh;">
      <div class="mb-4 px-2">
        <h5 class="fw-bold text-white"><i class="bi bi-calculator-fill me-2"></i>AG Services</h5>
        <div class="d-flex align-items-center mt-3">
          <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style="width: 40px; height: 40px;">
            ${(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div class="ms-2">
            <div class="small fw-bold">${user.full_name || user.username}</div>
            <div class="text-muted" style="font-size: 0.75rem;">${user.role || 'Usuario'}</div>
          </div>
        </div>
      </div>
      
      <ul class="nav flex-column mb-auto">
        ${navLinks}
      </ul>
      
      <div class="mt-auto pt-3 border-top border-secondary">
        <button id="btnLogout" class="btn btn-outline-danger w-100">
          <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
        </button>
      </div>
    </nav>
  `;
}

export function initSidebarEvents() {
  // Evento de cerrar sesión
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionService.logout();
      navigateTo('login');
      window.location.reload();
    });
  }
}
