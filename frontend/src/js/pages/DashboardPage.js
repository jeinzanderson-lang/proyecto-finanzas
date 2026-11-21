import { dashboardService } from '../services/dashboard.service.js';
import { money, shortDate, escapeHtml } from '../utils/format.js';

export async function renderDashboardPage() {
  const data =
    await dashboardService.get();

  const kpis =
    data.kpis || {};

  const movements =
    data.ultimasTransacciones || [];

  const cards = [
    [
      'Ventas del mes',
      money(
        kpis.ventasMes?.valor
      ),
      'fa-arrow-trend-up'
    ],
    [
      'Gastos del mes',
      money(
        kpis.gastosMes?.valor
      ),
      'fa-arrow-trend-down'
    ],
    [
      'Utilidad neta',
      money(
        kpis.utilidad?.valor
      ),
      'fa-scale-balanced'
    ],
    [
      'Stock bajo',
      Number(
        kpis.inventarioBajo?.valor || 0
      ),
      'fa-box-open'
    ]
  ];

  return `
    <section>

      <div class="mb-6">

        <p
          class="text-xs font-bold uppercase tracking-[0.18em] text-agg"
        >
          Resumen general
        </p>

        <h2
          class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1"
        >
          Dashboard
        </h2>

        <p class="text-sm text-slate-500 mt-1">
          Indicadores principales del sistema contable.
        </p>

      </div>


      <div
        class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
      >

        ${cards
          .map(
            ([label, value, icon]) => `
              <article
                class="rounded-2xl bg-white border border-slate-200 shadow-sm p-5"
              >

                <div
                  class="h-10 w-10 rounded-xl bg-indigo-50 text-agnavy grid place-items-center mb-4"
                >
                  <i class="fa-solid ${icon}"></i>
                </div>

                <p
                  class="text-xs font-semibold text-slate-500"
                >
                  ${label}
                </p>

                <p
                  class="text-2xl font-black text-slate-900 mt-1"
                >
                  ${value}
                </p>

              </article>
            `
          )
          .join('')}

      </div>


      <article
        class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
      >

        <div
          class="px-5 py-4 border-b border-slate-100"
        >
          <h3 class="font-bold text-slate-900">
            Últimos movimientos
          </h3>
        </div>

        <div class="table-wrap">

          <table class="w-full text-sm">

            <thead
              class="bg-slate-50 text-slate-500"
            >
              <tr>
                <th class="text-left px-5 py-3">
                  Documento
                </th>

                <th class="text-left px-5 py-3">
                  Tipo
                </th>

                <th class="text-left px-5 py-3">
                  Detalle
                </th>

                <th class="text-left px-5 py-3">
                  Fecha
                </th>

                <th class="text-right px-5 py-3">
                  Valor
                </th>
              </tr>
            </thead>

            <tbody
              class="divide-y divide-slate-100"
            >

              ${
                movements.length
                  ? movements
                      .map(
                        item => `
                          <tr>

                            <td
                              class="px-5 py-4 font-bold text-agnavy"
                            >
                              ${escapeHtml(item.id)}
                            </td>

                            <td class="px-5 py-4">
                              ${escapeHtml(item.tipo)}
                            </td>

                            <td
                              class="px-5 py-4 text-slate-600"
                            >
                              ${escapeHtml(
                                item.cliente ||
                                item.concepto ||
                                '—'
                              )}
                            </td>

                            <td
                              class="px-5 py-4 text-slate-600"
                            >
                              ${shortDate(item.fecha)}
                            </td>

                            <td
                              class="px-5 py-4 text-right font-bold"
                            >
                              ${money(item.monto)}
                            </td>

                          </tr>
                        `
                      )
                      .join('')
                  : `
                    <tr>
                      <td
                        colspan="5"
                        class="px-5 py-10 text-center text-slate-500"
                      >
                        No hay movimientos registrados.
                      </td>
                    </tr>
                  `
              }

            </tbody>

          </table>

        </div>

      </article>

    </section>
  `;
}
