// src/js/router/routes.js

// Definición de rutas públicas y privadas
export const routes = {
  // Rutas públicas
  login: {
    path: 'login',
    isPublic: true,
    label: 'Iniciar sesión',
  },

  // Rutas privadas
  dashboard: {
    path: 'dashboard',
    isPublic: false,
    label: 'Dashboard',
    icon: 'bi-speedometer2',
  },
  ventas: {
    path: 'ventas',
    isPublic: false,
    label: 'Ventas',
    icon: 'bi-cart-check',
  },
  gastos: {
    path: 'gastos',
    isPublic: false,
    label: 'Gastos',
    icon: 'bi-cash-stack',
  },
  inventario: {
    path: 'inventario',
    isPublic: false,
    label: 'Inventario',
    icon: 'bi-box-seam',
  },
  reportes: {
    path: 'reportes',
    isPublic: false,
    label: 'Reportes',
    icon: 'bi-file-earmark-bar-graph',
  },
  configuracion: {
    path: 'configuracion',
    isPublic: false,
    label: 'Configuración',
    icon: 'bi-gear',
  },
  usuarios: {
    path: 'usuarios',
    isPublic: false,
    label: 'Usuarios',
    icon: 'bi-people',
    requiresAdmin: true,
  },
};

/**
 * Obtiene la ruta actual del hash de la URL
 * Ejemplo: #dashboard -> 'dashboard'
 */
export function getCurrentRoute() {
  const hash = window.location.hash.slice(1); // Quita el '#'
  return hash || 'dashboard'; // Por defecto va al dashboard
}

/**
 * Navega a una ruta específica
 */
export function navigateTo(route) {
  window.location.hash = route;
}

/**
 * Obtiene todas las rutas disponibles para el menú
 */
export function getNavigationRoutes() {
  return Object.values(routes).filter(route => !route.isPublic);
}
