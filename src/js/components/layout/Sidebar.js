// src/js/components/layout/Sidebar.js
import { sessionService } from '../../auth/session.service.js';

export function renderSidebar(activeModule = 'dashboard') {
  const user = sessionService.getUser();
  if (!user) return '';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'ventas', label: 'Ventas', icon: 'bi-cart-check' },
    { id: 'gastos', label: 'Gastos', icon: 'bi-cash-stack' },
    { id: 'inventario', label: 'Inventario', icon: 'bi-box-seam' },
    { id: 'reportes', label: 'Reportes', icon: 'bi-file-earmark-bar-graph' },
    { id: 'configuracion', label: 'Configuración', icon: 'bi-gear' },
  ];

  // En el Sprint 3 filtraremos esto por rol. Por ahora mostramos todo.
  const navLinks = menuItems.map(item => `
    <li class="nav-item">
      <a class="nav-link ${activeModule === item.id ? 'active' : ''}" href="#" data-module="${item.id}">
        <i class="bi ${item.icon} me-2"></i>${item.label}
      </a>
    </li>
  `).join('');

  return `
    <nav class="sidebar bg-dark text-white d-flex flex-column p-3" style="min-width: 250px; min-height: 100vh;">
      <div class="mb-4 px-2">
        <h5 class="fw-bold text-white"><i class="bi bi-calculator-fill me-2"></i>AG Services</h5>
        <small class="text-muted">Sesión activa: ${user.username || user.full_name}</small>
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

export function initSidebarEvents(onModuleChange) {
  // Eventos de los enlaces del menú
  document.querySelectorAll('.nav-link[data-module]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const module = e.currentTarget.dataset.module;
      onModuleChange(module);
    });
  });

  // Evento de cerrar sesión
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionService.logout();
      window.location.reload(); // Recarga para volver al login
    });
  }
}