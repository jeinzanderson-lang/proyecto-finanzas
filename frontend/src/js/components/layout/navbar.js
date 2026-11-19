// src/js/components/layout/Navbar.js
import { sessionService } from '../../auth/session.service.js';
import { getAccessibleModules } from '../../auth/permissions.js';
import { routes, navigateTo, getCurrentRoute } from '../../router/routes.js';

export function renderNavbar() {
  const user = sessionService.getUser();
  if (!user) return '';

  const allowedModules = getAccessibleModules();
  const currentRoute = getCurrentRoute();

  const navLinks = allowedModules
    .map(moduleKey => {
      const route = routes[moduleKey];
      if (!route) return '';
      const isActive = currentRoute === moduleKey ? 'active' : '';
      return `
        <li class="nav-item">
          <a class="nav-link ${isActive}" href="#${route.path}">
            <i class="bi ${route.icon}"></i>${route.label}
          </a>
        </li>
      `;
    })
    .join('');

  return `
    <nav class="top-navbar">
      <div class="navbar-brand">
        <div class="logo">AG <span>Services</span></div>
        <div class="brand-info">
          <div class="brand-title">Sistema Contable</div>
          <div class="brand-subtitle">Sesión activa · ${user.role === 'ADMIN' ? 'Administrador' : 'Vendedor'}</div>
        </div>
      </div>
      
      <ul class="nav-menu">
        ${navLinks}
        <li class="nav-item">
          <a class="nav-link btn-logout" href="#" id="btnLogout">
            <i class="bi bi-box-arrow-right"></i>Cerrar sesión
          </a>
        </li>
      </ul>
    </nav>
  `;
}

export function initNavbarEvents() {
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      sessionService.logout();
      navigateTo('login');
      window.location.reload();
    });
  }
}