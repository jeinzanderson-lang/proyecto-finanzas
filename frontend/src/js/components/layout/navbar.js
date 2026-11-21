import agLogo from '../../../assets/ag-logo.jpg';
import { sessionService } from '../../auth/session.service.js';

const ADMIN_ITEMS = [
  ['dashboard', 'fa-chart-pie', 'Dashboard'],
  ['ventas', 'fa-file-invoice-dollar', 'Ventas'],
  ['gastos', 'fa-receipt', 'Gastos'],
  ['inventario', 'fa-boxes-stacked', 'Inventario'],
  ['reportes', 'fa-chart-column', 'Reportes'],
  ['cuentas', 'fa-book', 'Cuentas']
];

const VENDEDOR_ITEMS = [
  ['dashboard', 'fa-chart-pie', 'Dashboard'],
  ['ventas', 'fa-file-invoice-dollar', 'Ventas'],
  ['inventario', 'fa-boxes-stacked', 'Inventario']
];

export function renderNavbar(currentRoute) {
  const user =
    sessionService.getUser();

  if (!user) {
    return '';
  }

  const items =
    user.role === 'ADMIN'
      ? ADMIN_ITEMS
      : VENDEDOR_ITEMS;

  return `
    <header
      class="sticky top-0 z-40 glass border-b border-slate-200/80"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6"
      >
        <div
          class="min-h-20 py-3 flex flex-col items-center justify-center gap-2"
        >

          <!-- Logo ORIGINAL del proyecto -->
          <div
            class="flex items-center justify-center gap-3"
          >
            <img
              src="${agLogo}"
              alt="Logo AG Services"
              class="h-11 sm:h-12 w-auto object-contain"
            />

            <div
              class="hidden sm:block h-8 w-px bg-slate-200"
            ></div>

            <div
              class="text-center sm:text-left"
            >
              <p
                class="text-sm font-bold text-slate-900 leading-tight"
              >
                Sistema Contable
              </p>

              <p
                class="text-xs text-slate-500 leading-tight"
              >
                Sesión activa ·
                ${
                  user.role === 'ADMIN'
                    ? 'Administrador AG Services'
                    : 'Vendedor AG Services'
                }
              </p>
            </div>
          </div>

          <!-- Navegación ORIGINAL tipo pestañas -->
          <nav
            class="w-full flex justify-center"
            aria-label="Navegación principal"
          >
            <div
              class="thin-scrollbar max-w-full overflow-x-auto"
            >
              <div
                class="inline-flex items-center justify-center gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm"
              >
                ${items
                  .map(
                    ([route, icon, label]) => `
                      <a
                        href="#${route}"
                        class="nav-pill ${
                          currentRoute === route
                            ? 'active'
                            : 'text-slate-600'
                        } rounded-xl px-3 py-2 text-sm font-semibold"
                      >
                        <i
                          class="fa-solid ${icon} mr-1.5"
                        ></i>
                        ${label}
                      </a>
                    `
                  )
                  .join('')}

                <button
                  id="logoutBtn"
                  type="button"
                  class="nav-pill logout-nav-link rounded-xl px-3 py-2 text-sm font-semibold"
                >
                  <i
                    class="fa-solid fa-arrow-right-from-bracket mr-1.5"
                  ></i>
                  Cerrar sesión
                </button>

              </div>
            </div>
          </nav>

        </div>
      </div>
    </header>
  `;
}

export function initNavbarEvents() {
  document
    .getElementById('logoutBtn')
    ?.addEventListener('click', () => {
      sessionService.clear();
      window.location.hash = 'login';
    });
}
