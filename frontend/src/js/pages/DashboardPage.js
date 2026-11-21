// src/js/pages/DashboardPage.js
import { httpClient } from '../api/http.js';
import { renderKPICards } from '../components/dashboard/KPICard.js';
import { showToast } from '../utils/toast.js';


// ======================================================
// RENDER INICIAL
// ======================================================

export function renderDashboardPage() {
  return `
    <div class="container-fluid">

      <div class="page-header d-flex justify-content-between align-items-start">
        <div>
          <div class="page-subtitle">
            RESUMEN FINANCIERO
          </div>

          <h2>Dashboard</h2>

          <p class="page-description">
            Cargando datos del sistema...
          </p>
        </div>
      </div>

      <div class="text-center py-5">
        <div
          class="spinner-border text-primary"
          role="status"
        >
          <span class="visually-hidden">
            Cargando...
          </span>
        </div>
      </div>

    </div>
  `;
}


// ======================================================
// CARGAR DASHBOARD REAL
// ======================================================

export async function initDashboardCharts() {
  try {
    const data =
      await httpClient.get('/dashboard');

    const kpisBackend =
      data.kpis || {};

    const transacciones =
      data.ultimasTransacciones || [];


    // --------------------------------------------------
    // KPIs
    // --------------------------------------------------

    const ventasMes =
      kpisBackend.ventasMes || {
        valor: 0,
        cambio: 0,
        tendencia: 'up',
        label: 'Ventas del mes'
      };

    const gastosMes =
      kpisBackend.gastosMes || {
        valor: 0,
        cambio: 0,
        tendencia: 'down',
        label: 'Gastos del mes'
      };

    const utilidad =
      kpisBackend.utilidad || {
        valor: 0,
        cambio: 0,
        tendencia: 'up',
        label: 'Utilidad neta'
      };

    const inventarioBajo =
      kpisBackend.inventarioBajo || {
        valor: 0,
        cambio: 0,
        tendencia: 'down',
        label: 'Productos con stock bajo'
      };


    const kpis = [
      {
        ...ventasMes,
        valorFormateado:
          '$' +
          Number(
            ventasMes.valor || 0
          ).toLocaleString('es-CO')
      },

      {
        ...gastosMes,
        valorFormateado:
          '$' +
          Number(
            gastosMes.valor || 0
          ).toLocaleString('es-CO')
      },

      {
        ...utilidad,
        valorFormateado:
          '$' +
          Number(
            utilidad.valor || 0
          ).toLocaleString('es-CO')
      },

      {
        ...inventarioBajo,
        valorFormateado:
          Number(
            inventarioBajo.valor || 0
          ).toLocaleString('es-CO')
      }
    ];


    // --------------------------------------------------
    // TABLA DE MOVIMIENTOS
    // --------------------------------------------------

    const transaccionesRows =
      transacciones.length > 0
        ? transacciones
            .map(transaccion => {

              const esVenta =
                transaccion.tipo === 'Venta';

              const tipoColor =
                esVenta
                  ? 'success'
                  : 'danger';

              const tipoIcono =
                esVenta
                  ? 'bi-arrow-down-circle'
                  : 'bi-arrow-up-circle';

              const signo =
                esVenta ? '+' : '-';

              const concepto =
                esVenta
                  ? transaccion.cliente
                  : transaccion.concepto;

              const estadoColor =
                transaccion.estado === 'Completada' ||
                transaccion.estado === 'Pagado'
                  ? 'success'
                  : transaccion.estado === 'Pendiente'
                    ? 'warning'
                    : 'danger';

              return `
                <tr>

                  <td>
                    ${transaccion.fecha}
                  </td>

                  <td>
                    <span
                      class="badge bg-${tipoColor}-subtle text-${tipoColor}"
                    >
                      <i
                        class="bi ${tipoIcono} me-1"
                      ></i>

                      ${transaccion.tipo}
                    </span>
                  </td>

                  <td>
                    ${concepto || '-'}
                  </td>

                  <td>
                    <span
                      class="badge bg-${estadoColor}-subtle text-${estadoColor}"
                    >
                      ${transaccion.estado}
                    </span>
                  </td>

                  <td
                    class="fw-bold text-end text-${tipoColor}"
                  >
                    ${signo}$${Number(
                      transaccion.monto || 0
                    ).toLocaleString(
                      'es-CO',
                      {
                        minimumFractionDigits: 0
                      }
                    )}
                  </td>

                </tr>
              `;
            })
            .join('')
        : `
            <tr>
              <td
                colspan="5"
                class="text-center text-muted py-4"
              >
                No hay movimientos recientes
              </td>
            </tr>
          `;


    // --------------------------------------------------
    // FLUJO DEL PERÍODO
    // --------------------------------------------------

    const totalVentas =
      Number(ventasMes.valor || 0);

    const totalGastos =
      Number(gastosMes.valor || 0);

    const porcentajeGastos =
      totalVentas > 0
        ? Math.min(
            Math.round(
              (totalGastos / totalVentas) *
              100
            ),
            100
          )
        : 0;


    // --------------------------------------------------
    // RENDER FINAL
    // --------------------------------------------------

    const app =
      document.querySelector(
        '#app main.main-content'
      );

    if (!app) {
      return;
    }


    app.innerHTML = `
      <div class="container-fluid">

        <div
          class="page-header d-flex justify-content-between align-items-start"
        >

          <div>
            <div class="page-subtitle">
              RESUMEN FINANCIERO
            </div>

            <h2>Dashboard</h2>

            <p class="page-description">
              Vista general del movimiento contable del negocio.
            </p>
          </div>


          <div
            class="badge bg-success-subtle text-success px-3 py-2"
          >
            <i
              class="bi bi-circle-fill me-1"
              style="font-size: 0.5rem;"
            ></i>

            Datos en tiempo real
          </div>

        </div>


        <!-- KPIs -->
        <div class="row g-4 mb-4">
          ${renderKPICards(kpis)}
        </div>


        <div class="row g-4">


          <!-- ÚLTIMOS MOVIMIENTOS -->
          <div class="col-12 col-lg-8">

            <div class="card">

              <div
                class="card-header d-flex justify-content-between align-items-center"
              >

                <div>
                  <h5 class="fw-bold mb-1">
                    Últimos movimientos
                  </h5>

                  <small class="text-muted">
                    Ingresos y egresos recientes.
                  </small>
                </div>

              </div>


              <div class="card-body p-0">

                <div class="table-responsive">

                  <table
                    class="table table-hover mb-0 align-middle"
                  >

                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Concepto</th>
                        <th>Estado</th>
                        <th class="text-end">
                          Valor
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      ${transaccionesRows}
                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>


          <!-- FLUJO -->
          <div class="col-12 col-lg-4">

            <div class="card">

              <div class="card-header">

                <h5 class="fw-bold mb-1">
                  Flujo del período
                </h5>

                <small class="text-muted">
                  Comparación del mes actual.
                </small>

              </div>


              <div class="card-body">

                <div class="mb-4">

                  <div
                    class="d-flex justify-content-between mb-2"
                  >
                    <span class="fw-semibold">
                      Ventas
                    </span>

                    <span class="fw-bold">
                      100%
                    </span>
                  </div>

                  <div
                    class="progress"
                    style="height: 8px; border-radius: 4px;"
                  >
                    <div
                      class="progress-bar"
                      style="
                        width: 100%;
                        background: var(--primary);
                      "
                    ></div>
                  </div>

                </div>


                <div class="mb-4">

                  <div
                    class="d-flex justify-content-between mb-2"
                  >
                    <span class="fw-semibold">
                      Gastos
                    </span>

                    <span class="fw-bold">
                      ${porcentajeGastos}%
                    </span>
                  </div>

                  <div
                    class="progress"
                    style="height: 8px; border-radius: 4px;"
                  >
                    <div
                      class="progress-bar"
                      style="
                        width: ${porcentajeGastos}%;
                        background: var(--accent);
                      "
                    ></div>
                  </div>

                </div>


                <div
                  class="alert bg-info-subtle border-0 d-flex align-items-start"
                >

                  <i
                    class="bi bi-info-circle-fill me-2 mt-1"
                  ></i>

                  <div>

                    <strong>
                      Lectura rápida
                    </strong>

                    <div class="small text-muted">
                      La utilidad del mes es
                      $${Number(
                        utilidad.valor || 0
                      ).toLocaleString(
                        'es-CO'
                      )}.
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    `;


    initDashboardEvents();

  } catch (error) {

    console.error(
      'Error cargando dashboard:',
      error
    );

    showToast(
      '❌ Error al cargar el dashboard: ' +
      error.message,
      'error'
    );
  }
}


// ======================================================
// EVENTOS
// ======================================================

export function initDashboardEvents() {
  console.log(
    '✅ Dashboard conectado con API real'
  );
}