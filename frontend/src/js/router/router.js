import { sessionService } from '../auth/session.service.js';

import {
  renderNavbar,
  initNavbarEvents
} from '../components/layout/navbar.js';

import { showToast } from '../components/ui/toast.js';

import {
  renderLoginPage,
  initLoginEvents
} from '../pages/LoginPage.js';

import {
  renderDashboardPage
} from '../pages/DashboardPage.js';

import {
  renderVentasPage,
  initVentasEvents
} from '../pages/VentasPage.js';

import {
  renderGastosPage,
  initGastosEvents
} from '../pages/GastosPage.js';

import {
  renderInventarioPage,
  initInventarioEvents
} from '../pages/InventarioPage.js';

import {
  renderReportesPage,
  initReportesEvents
} from '../pages/ReportesPage.js';

import {
  renderCuentasPage,
  initCuentasEvents
} from '../pages/CuentasPage.js';


const routes = {
  dashboard: {
    render:
      renderDashboardPage
  },

  ventas: {
    render:
      renderVentasPage,

    init:
      initVentasEvents
  },

  gastos: {
    render:
      renderGastosPage,

    init:
      initGastosEvents,

    adminOnly:
      true
  },

  inventario: {
    render:
      renderInventarioPage,

    init:
      initInventarioEvents
  },

  reportes: {
    render:
      renderReportesPage,

    init:
      initReportesEvents,

    adminOnly:
      true
  },

  cuentas: {
    render:
      renderCuentasPage,

    init:
      initCuentasEvents,

    adminOnly:
      true
  }
};


function currentRoute() {
  return (
    window.location.hash
      .replace(
        '#',
        ''
      ) ||
    'dashboard'
  );
}


async function renderCurrent() {
  /*
   * Si venimos de una vista que tenía
   * detalle abierto, limpiamos el estado.
   */
  document.body.classList.remove(
    'detail-menu-open'
  );


  const app =
    document.getElementById(
      'app'
    );


  const route =
    currentRoute();


  if (
    !sessionService.isAuthenticated()
  ) {

    if (
      route !== 'login'
    ) {
      window.location.hash =
        'login';

      return;
    }


    app.innerHTML =
      renderLoginPage();


    initLoginEvents();

    return;
  }


  if (
    route === 'login'
  ) {
    window.location.hash =
      'dashboard';

    return;
  }


  const config =
    routes[route] ||
    routes.dashboard;


  if (
    config.adminOnly &&
    !sessionService.isAdmin()
  ) {

    showToast(
      'No tienes permisos para acceder a este módulo.',
      'warning'
    );


    window.location.hash =
      'dashboard';

    return;
  }


  try {

    const page =
      await config.render();


    app.innerHTML = `
      <div class="min-h-screen">

        ${renderNavbar(route)}

        <main
          class="main-page-content max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        >
          ${page}
        </main>

      </div>
    `;


    initNavbarEvents();

    config.init?.();


  } catch (error) {

    if (
      error.status === 401
    ) {

      sessionService.clear();

      window.location.hash =
        'login';

      return;
    }


    app.innerHTML = `
      <div
        class="min-h-screen grid place-items-center p-4"
      >

        <div
          class="max-w-lg w-full rounded-3xl bg-white border border-slate-200 shadow-lg p-7"
        >

          <p
            class="text-xs font-bold uppercase tracking-[0.16em] text-agg"
          >
            Error
          </p>

          <h2
            class="text-2xl font-black text-slate-900 mt-1"
          >
            No se pudo cargar la vista
          </h2>

          <p
            class="text-sm text-slate-500 mt-3"
          >
            ${error.message}
          </p>

          <button
            id="retryBtn"
            class="btn-ag rounded-xl px-4 py-2.5 text-sm font-bold mt-5"
          >
            Reintentar
          </button>

        </div>

      </div>
    `;


    document
      .getElementById(
        'retryBtn'
      )
      ?.addEventListener(
        'click',
        renderCurrent
      );
  }
}


export function initRouter() {
  window.addEventListener(
    'hashchange',
    renderCurrent
  );


  window.addEventListener(
    'app:refresh',
    renderCurrent
  );


  renderCurrent();
}
