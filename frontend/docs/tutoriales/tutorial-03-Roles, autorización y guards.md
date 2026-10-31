## 1. Objetivo
Implementar el sistema de navegación lateral (Sidebar) y proteger las rutas según el rol del usuario (ADMIN, CONTADOR, VENDEDOR, BODEGUERO), asegurando que cada usuario solo vea los módulos permitidos.

## 2. Alcance de este sprint
En este sprint se construye el layout principal de la aplicación una vez el usuario inicia sesión. Se implementa:
- el Sidebar con el menú de navegación (Dashboard, Ventas, Gastos, Inventario, Reportes, Configuración);
- la lógica de guards para ocultar/mostrar opciones según el rol;
- el botón de "Cerrar sesión";
- la redirección al Login si el token expira o no existe.

No se implementa todavía:
- el contenido real del Dashboard;
- los módulos de Ventas, Gastos, Inventario, etc. (solo se dejan los placeholders).

## 3. Qué se instala
No se instalan nuevas dependencias. Se usan:
localStorage para leer el rol del usuario;
Bootstrap 5.3 y Bootstrap Icons (ya instalados).

## 4. Archivos que se crean o ajustan
Al terminar este sprint, estos archivos deben existir:
src/js/utils/roleManager.js;
src/js/components/sidebar.js;
src/js/main.js (se ajusta para renderizar el layout);
src/css/main.css (se añaden estilos para el Sidebar).
estructura esperada:

frontend/
└── src/
    ├── css/
    │   └── main.css
    └── js/
        ├── auth/
        │   ├── authService.js
        │   └── login.js
        ├── components/
        │   └── sidebar.js
        ├── utils/
        │   ├── apiClient.js
        │   ├── roleManager.js
        │   └── tokenManager.js
        └── main.js

## 5. Paso a paso
Paso 1: crear el gestor de roles (roleManager.js)
Crea src/js/utils/roleManager.js. Este archivo define qué módulos puede ver cada rol.

export const PERMISSIONS = {
  ADMIN: ['dashboard', 'ventas', 'gastos', 'inventario', 'reportes', 'configuracion'],
  CONTADOR: ['dashboard', 'ventas', 'gastos', 'inventario', 'reportes', 'configuracion:read'],
  VENDEDOR: ['dashboard', 'ventas', 'inventario:read'],
  BODEGUERO: ['inventario', 'dashboard:stock'],
};

export function hasPermission(role, module) {
  const allowed = PERMISSIONS[role] || [];
  return allowed.includes('*') || allowed.includes(module);
}

Paso 2: crear el componente Sidebar (sidebar.js)
Crea la carpeta src/js/components y dentro el archivo sidebar.js. Este archivo renderiza el menú lateral basándose en el HTML original de AG Services.

import { tokenManager } from '../utils/tokenManager.js';
import { hasPermission } from '../utils/roleManager.js';
import { authService } from '../auth/authService.js';

export function renderSidebar(activeModule = 'dashboard') {
  const user = tokenManager.getUser();
  if (!user) return '';

  const role = user.role;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'ventas', label: 'Ventas', icon: 'bi-cart-check' },
    { id: 'gastos', label: 'Gastos', icon: 'bi-cash-stack' },
    { id: 'inventario', label: 'Inventario', icon: 'bi-box-seam' },
    { id: 'reportes', label: 'Reportes', icon: 'bi-file-earmark-bar-graph' },
    { id: 'configuracion', label: 'Configuración', icon: 'bi-gear' },
  ];

  const navLinks = menuItems
    .filter(item => hasPermission(role, item.id))
    .map(item => `
      <li class="nav-item">
        <a class="nav-link ${activeModule === item.id ? 'active' : ''}" href="#" data-module="${item.id}">
          <i class="bi ${item.icon} me-2"></i>${item.label}
        </a>
      </li>
    `).join('');

  return `
    <nav class="sidebar bg-dark text-white min-vh-100 p-3">
      <div class="mb-4 px-2">
        <h5 class="fw-bold"><i class="bi bi-calculator-fill me-2"></i>AG Services</h5>
        <small class="text-muted">Sesión activa: ${user.username}</small>
      </div>
      <ul class="nav flex-column">
        ${navLinks}
      </ul>
      <div class="mt-auto pt-4 border-top border-secondary">
        <button id="btnLogout" class="btn btn-outline-danger w-100">
          <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
        </button>
      </div>
    </nav>
  `;
}

export function initSidebarEvents(onModuleChange) {
  document.querySelectorAll('.nav-link[data-module]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const module = e.currentTarget.dataset.module;
      onModuleChange(module);
    });
  });

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      authService.logout();
      window.location.reload();
    });
  }
}

Paso 3: crear el layout principal en main.js
Ajusta src/js/main.js para que, si hay sesión, renderice el Sidebar y un área de contenido.

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';
import { renderLogin } from './auth/login.js';
import { tokenManager } from './utils/tokenManager.js';
import { renderSidebar, initSidebarEvents } from './components/sidebar.js';

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
        <h2>Dashboard</h2>
        <p>Contenido del módulo...</p>
      </main>
    </div>
  `;

  document.getElementById('sidebar-container').innerHTML = renderSidebar('dashboard');

  initSidebarEvents((module) => {
    document.getElementById('main-content').innerHTML = `<h2>${module.charAt(0).toUpperCase() + module.slice(1)}</h2><p>Módulo en construcción...</p>`;
  });
}

document.addEventListener('DOMContentLoaded', initApp);

Paso 4: añadir estilos del Sidebar en main.css
Añade esto al final de src/css/main.css:

.sidebar .nav-link {
  color: rgba(255, 255, 255, 0.75);
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 0.25rem;
  transition: all 0.2s;
}

.sidebar .nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar .nav-link.active {
  color: #fff;
  background-color: var(--bs-primary);
}

## 6. Cómo validar que quedó bien
En este sprint no hay pruebas automatizadas. La validación consiste en:
- iniciar sesión con un usuario de prueba;
- verificar que se vea el Sidebar oscuro a la izquierda con el logo "AG Services" y el nombre del usuario;
- si el usuario es VENDEDOR, solo debe ver Dashboard, Ventas e Inventario;
- si el usuario es ADMIN, debe ver todas las opciones incluyendo Configuración;
- al hacer clic en "Cerrar sesión", debe borrar el token y volver al Login.

Antes de cerrar el tutorial, confirma esta lista:
- existe src/js/utils/roleManager.js;
- existe src/js/components/sidebar.js;
- main.js renderiza el Sidebar si hay sesión;
- el menú se filtra según el rol del usuario;
- el botón de cerrar sesión funciona;
- npm run dev funciona y muestra el layout con Sidebar.

## 7. Errores comunes
Los errores más frecuentes en este tutorial son:
- no filtrar los items del menú en el frontend (dejar que el usuario vea botones que no puede usar);
- olvidar que el backend también debe validar el rol (el guard del frontend es solo UX);
- perder la sesión al recargar la página (por no leer localStorage en initApp);
- no manejar el caso en que el usuario no tenga rol definido.

## 8. Guardar los cambios en Git
Antes de crear el commit, revisa git status para confirmar qué archivos se van a guardar.
git status
git add .
git commit -m "Sprint 3: roles, autorización y guards"
git push

## 9. Resultado esperado
Al terminar este Sprint 3 tendrás:
- un layout profesional con Sidebar y área de contenido;
- un menú dinámico que se adapta al rol del usuario;
- un flujo de Logout funcional;
- la arquitectura lista para inyectar los módulos reales (Dashboard, Ventas, etc.) en los siguientes sprints.