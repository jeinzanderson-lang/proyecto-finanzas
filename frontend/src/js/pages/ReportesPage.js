import { ventasService } from '../services/ventas.service.js';
import { gastosService } from '../services/gastos.service.js';

import {
  money,
  shortDate,
  escapeHtml
} from '../utils/format.js';

import {
  modalTemplate,
  openModal,
  closeModal,
  initModalCloseEvents
} from '../components/ui/modal.js';


let ventas = [];
let gastos = [];

let reportPeriod =
  'month';

let reportStartDate =
  '';

let reportEndDate =
  '';

let reportRows =
  [];


function parseDate(value) {
  if (!value) {
    return null;
  }

  return new Date(
    `${value}T00:00:00`
  );
}


function startOfWeek(date) {
  const result =
    new Date(date);

  const day =
    result.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() +
    difference
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}


function endOfWeek(date) {
  const result =
    startOfWeek(date);

  result.setDate(
    result.getDate() + 6
  );

  return result;
}


function dateKey(date) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      '0'
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      '0'
    );

  return `${year}-${month}-${day}`;
}


function periodInfo(
  date,
  period
) {
  const year =
    date.getFullYear();

  const month =
    date.getMonth();


  if (
    period === 'week'
  ) {
    const start =
      startOfWeek(date);

    const end =
      endOfWeek(date);

    return {
      key:
        `week-${dateKey(start)}`,

      label:
        `${shortDate(
          dateKey(start)
        )} - ${shortDate(
          dateKey(end)
        )}`,

      start
    };
  }


  if (
    period === 'quarter'
  ) {
    const quarter =
      Math.floor(
        month / 3
      ) + 1;

    return {
      key:
        `${year}-Q${quarter}`,

      label:
        `${year} · Trimestre ${quarter}`,

      start:
        new Date(
          year,
          (quarter - 1) * 3,
          1
        )
    };
  }


  if (
    period === 'semester'
  ) {
    const semester =
      month < 6
        ? 1
        : 2;

    return {
      key:
        `${year}-S${semester}`,

      label:
        `${year} · Semestre ${semester}`,

      start:
        new Date(
          year,
          semester === 1
            ? 0
            : 6,
          1
        )
    };
  }


  if (
    period === 'year'
  ) {
    return {
      key:
        `${year}`,

      label:
        `${year}`,

      start:
        new Date(
          year,
          0,
          1
        )
    };
  }


  const formatter =
    new Intl.DateTimeFormat(
      'es-CO',
      {
        month: 'long',
        year: 'numeric'
      }
    );


  return {
    key:
      `${year}-${String(
        month + 1
      ).padStart(
        2,
        '0'
      )}`,

    label:
      formatter.format(
        new Date(
          year,
          month,
          1
        )
      ),

    start:
      new Date(
        year,
        month,
        1
      )
  };
}


function inDateRange(date) {
  if (!date) {
    return false;
  }


  if (
    reportStartDate
  ) {
    const start =
      parseDate(
        reportStartDate
      );

    if (
      date < start
    ) {
      return false;
    }
  }


  if (
    reportEndDate
  ) {
    const end =
      parseDate(
        reportEndDate
      );

    end.setHours(
      23,
      59,
      59,
      999
    );

    if (
      date > end
    ) {
      return false;
    }
  }


  return true;
}


function allMovements() {
  const ventasMovements =
    ventas.map(
      venta => ({
        id:
          `venta-${venta.id}`,

        tipo:
          'Venta',

        fecha:
          venta.fecha,

        documento:
          venta.numero,

        tercero:
          venta.cliente,

        concepto:
          venta.producto,

        estado:
          venta.estado,

        valor:
          Number(
            venta.total || 0
          )
      })
    );


  const gastosMovements =
    gastos.map(
      gasto => ({
        id:
          `gasto-${gasto.id}`,

        tipo:
          'Gasto',

        fecha:
          gasto.fecha,

        documento:
          gasto.numero,

        tercero:
          gasto.proveedor,

        concepto:
          gasto.concepto,

        estado:
          gasto.estado,

        valor:
          Number(
            gasto.monto || 0
          )
      })
    );


  return [
    ...ventasMovements,
    ...gastosMovements
  ];
}


function buildReportRows() {
  const grouped =
    new Map();


  allMovements()
    .forEach(
      movement => {

        const date =
          parseDate(
            movement.fecha
          );


        if (
          !inDateRange(date)
        ) {
          return;
        }


        const info =
          periodInfo(
            date,
            reportPeriod
          );


        if (
          !grouped.has(
            info.key
          )
        ) {
          grouped.set(
            info.key,
            {
              key:
                info.key,

              label:
                info.label,

              start:
                info.start,

              ingresos:
                0,

              gastos:
                0,

              movements:
                []
            }
          );
        }


        const row =
          grouped.get(
            info.key
          );


        if (
          movement.tipo ===
          'Venta'
        ) {
          row.ingresos +=
            movement.valor;
        } else {
          row.gastos +=
            movement.valor;
        }


        row.movements.push(
          movement
        );
      }
    );


  reportRows =
    [...grouped.values()]
      .map(
        row => ({
          ...row,
          resultado:
            row.ingresos -
            row.gastos
        })
      )
      .sort(
        (a, b) =>
          b.start -
          a.start
      );
}


function periodSubtitle() {
  const labels = {
    week:
      'Resumen semanal de movimientos registrados.',

    month:
      'Resumen mensual de movimientos registrados.',

    quarter:
      'Resumen trimestral de movimientos registrados.',

    semester:
      'Resumen semestral de movimientos registrados.',

    year:
      'Resumen anual de movimientos registrados.'
  };

  return labels[
    reportPeriod
  ];
}


function reportModalTemplate() {
  return modalTemplate({
    id:
      'reportDetailModal',

    titleId:
      'reportDetailModalTitle',

    subtitleId:
      'reportDetailModalSubtitle',

    maxWidth:
      'max-w-3xl',

    body: `
      <div class="p-5 sm:p-6">

        <div
          class="grid sm:grid-cols-3 gap-3 mb-6"
        >

          <article
            class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <p
              class="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700"
            >
              Ingresos
            </p>

            <p
              id="reportModalIngresos"
              class="text-xl font-black text-emerald-700 mt-1"
            ></p>
          </article>


          <article
            class="rounded-2xl border border-red-200 bg-red-50 p-4"
          >
            <p
              class="text-xs font-bold uppercase tracking-[0.12em] text-red-700"
            >
              Gastos
            </p>

            <p
              id="reportModalGastos"
              class="text-xl font-black text-red-700 mt-1"
            ></p>
          </article>


          <article
            class="rounded-2xl border border-indigo-200 bg-indigo-50 p-4"
          >
            <p
              class="text-xs font-bold uppercase tracking-[0.12em] text-agnavy"
            >
              Resultado
            </p>

            <p
              id="reportModalResultado"
              class="text-xl font-black text-agnavy mt-1"
            ></p>
          </article>

        </div>


        <div
          class="flex items-center justify-between gap-4 mb-3"
        >
          <div>
            <h4
              class="font-bold text-slate-900"
            >
              Movimientos del período
            </h4>

            <p
              id="reportModalMovementCount"
              class="text-xs text-slate-500 mt-0.5"
            ></p>
          </div>
        </div>


        <div
          id="reportModalMovements"
          class="space-y-3"
        ></div>

      </div>
    `
  });
}


function renderReportMovement(
  movement
) {
  const isExpense =
    movement.tipo ===
    'Gasto';


  return `
    <article
      class="
        rounded-2xl
        border border-slate-200
        bg-white
        p-4
      "
    >
      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
      >

        <div class="min-w-0">

          <div
            class="flex items-center gap-2 flex-wrap"
          >
            <span
              class="
                inline-flex
                rounded-full
                px-2.5 py-1
                text-[11px] font-bold
                ${
                  isExpense
                    ? 'bg-red-50 text-red-700'
                    : 'bg-emerald-50 text-emerald-700'
                }
              "
            >
              ${escapeHtml(
                movement.tipo
              )}
            </span>

            <strong
              class="text-sm text-slate-900"
            >
              ${escapeHtml(
                movement.documento
              )}
            </strong>
          </div>


          <p
            class="text-sm text-slate-700 mt-2"
          >
            ${escapeHtml(
              movement.tercero ||
              'Sin tercero'
            )}
          </p>


          <p
            class="text-xs text-slate-500 mt-1"
          >
            ${escapeHtml(
              movement.concepto ||
              'Sin concepto'
            )}
            ·
            ${shortDate(
              movement.fecha
            )}
          </p>

        </div>


        <strong
          class="
            text-base whitespace-nowrap
            ${
              isExpense
                ? 'text-red-600'
                : 'text-agnavy'
            }
          "
        >
          ${
            isExpense
              ? '- '
              : ''
          }${money(
            movement.valor
          )}
        </strong>

      </div>
    </article>
  `;
}


function showReportDetail(key) {
  const row =
    reportRows.find(
      item =>
        item.key === key
    );


  if (!row) {
    return;
  }


  document
    .getElementById(
      'reportDetailModalTitle'
    )
    .textContent =
      'Detalle del reporte';


  document
    .getElementById(
      'reportDetailModalSubtitle'
    )
    .textContent =
      row.label;


  document
    .getElementById(
      'reportModalIngresos'
    )
    .textContent =
      money(
        row.ingresos
      );


  document
    .getElementById(
      'reportModalGastos'
    )
    .textContent =
      money(
        row.gastos
      );


  document
    .getElementById(
      'reportModalResultado'
    )
    .textContent =
      money(
        row.resultado
      );


  document
    .getElementById(
      'reportModalMovementCount'
    )
    .textContent =
      `${row.movements.length} movimiento${
        row.movements.length === 1
          ? ''
          : 's'
      } registrado${
        row.movements.length === 1
          ? ''
          : 's'
      }.`;


  document
    .getElementById(
      'reportModalMovements'
    )
    .innerHTML =
      row.movements
        .slice()
        .sort(
          (a, b) =>
            parseDate(
              b.fecha
            ) -
            parseDate(
              a.fecha
            )
        )
        .map(
          renderReportMovement
        )
        .join('');


  openModal(
    'reportDetailModal'
  );
}


function renderHistoryBody() {
  const body =
    document.getElementById(
      'reportHistoryBody'
    );


  if (!body) {
    return;
  }


  body.innerHTML =
    reportRows.length
      ? reportRows
          .map(
            row => `
              <tr
                data-report-key="${row.key}"
                class="report-row hover:bg-slate-50/70 cursor-pointer"
              >

                <td
                  class="px-5 py-4"
                >
                  <button
                    type="button"
                    class="font-bold text-agnavy hover:underline text-left"
                  >
                    ${escapeHtml(row.label)}
                  </button>
                </td>

                <td
                  class="px-5 py-4 text-right font-bold text-emerald-700"
                >
                  ${money(row.ingresos)}
                </td>

                <td
                  class="px-5 py-4 text-right font-bold text-red-600"
                >
                  ${money(row.gastos)}
                </td>

                <td
                  class="px-5 py-4 text-right font-bold ${
                    row.resultado >= 0
                      ? 'text-agnavy'
                      : 'text-red-600'
                  }"
                >
                  ${money(row.resultado)}
                </td>

                <td
                  class="px-5 py-4 text-right text-slate-600"
                >
                  ${row.movements.length}
                </td>

              </tr>
            `
          )
          .join('')
      : `
        <tr>
          <td
            colspan="5"
            class="px-5 py-8 text-center text-slate-500"
          >
            No hay movimientos para el período seleccionado.
          </td>
        </tr>
      `;


  document
    .getElementById(
      'reportHistorySubtitle'
    )
    .textContent =
      periodSubtitle();


  bindReportRows();
}


function bindReportRows() {
  document
    .querySelectorAll(
      '.report-row'
    )
    .forEach(row => {

      row.addEventListener(
        'click',
        () => {

          showReportDetail(
            row.dataset.reportKey
          );

        }
      );

    });
}


function updateDateLabel() {
  const label =
    document.getElementById(
      'dateFilterLabel'
    );


  if (!label) {
    return;
  }


  if (
    reportStartDate &&
    reportEndDate
  ) {
    label.textContent =
      `${shortDate(
        reportStartDate
      )} - ${shortDate(
        reportEndDate
      )}`;

    return;
  }


  if (
    reportStartDate
  ) {
    label.textContent =
      `Desde ${shortDate(
        reportStartDate
      )}`;

    return;
  }


  if (
    reportEndDate
  ) {
    label.textContent =
      `Hasta ${shortDate(
        reportEndDate
      )}`;

    return;
  }


  label.textContent =
    'Todas las fechas';
}


function refreshReports() {
  buildReportRows();

  renderHistoryBody();

  closeModal(
    'reportDetailModal'
  );
}


export async function renderReportesPage() {
  [
    ventas,
    gastos
  ] = await Promise.all([
    ventasService.getAll(),
    gastosService.getAll()
  ]);


  ventas =
    ventas || [];

  gastos =
    gastos || [];


  buildReportRows();


  return `
    <section>

      <div class="mb-6">

        <p
          class="text-xs font-bold uppercase tracking-[0.18em] text-agg"
        >
          Información financiera
        </p>

        <h2
          class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1"
        >
          Reportes
        </h2>

        <p class="text-sm text-slate-500 mt-1">
          Consulta el historial financiero por períodos y filtra por rango de fechas.
        </p>

      </div>


      <div
        class="flex flex-col sm:flex-row gap-3 mb-5 relative"
      >

        <div class="relative">

          <button
            id="dateFilterButton"
            type="button"
            class="w-full sm:w-56 rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 flex items-center justify-between gap-3"
          >
            <span id="dateFilterLabel">
              Todas las fechas
            </span>

            <i
              class="fa-solid fa-chevron-down text-slate-400"
            ></i>
          </button>


          <div
            id="dateFilterPanel"
            class="hidden absolute left-0 top-14 z-40 w-[min(92vw,340px)] rounded-2xl border border-slate-200 bg-white shadow-2xl p-4"
          >

            <div class="space-y-4">

              <div>
                <label
                  class="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Desde
                </label>

                <input
                  id="reportStartDate"
                  type="date"
                  class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>


              <div>
                <label
                  class="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Hasta
                </label>

                <input
                  id="reportEndDate"
                  type="date"
                  class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>


              <div
                class="grid grid-cols-1 gap-2"
              >

                <button
                  id="applyDateFilterBtn"
                  type="button"
                  class="btn-ag w-full rounded-xl py-2.5 text-sm font-bold"
                >
                  Aplicar fechas
                </button>

                <button
                  id="clearDateFilterBtn"
                  type="button"
                  class="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Todas las fechas
                </button>

              </div>

            </div>

          </div>

        </div>


        <select
          id="reportPeriodFilter"
          class="w-full sm:w-56 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
        >
          <option value="week">
            Semanal
          </option>

          <option
            value="month"
            selected
          >
            Mensual
          </option>

          <option value="quarter">
            Trimestral
          </option>

          <option value="semester">
            Semestral
          </option>

          <option value="year">
            Anual
          </option>
        </select>

      </div>


      <article
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >

        <div
          class="px-5 py-4 border-b border-slate-100"
        >
          <h3
            class="font-bold text-slate-900"
          >
            Historial de períodos
          </h3>

          <p
            id="reportHistorySubtitle"
            class="text-xs text-slate-500 mt-0.5"
          >
            ${periodSubtitle()}
          </p>
        </div>


        <div class="table-wrap">

          <table
            class="w-full text-sm"
            style="min-width:720px;"
          >

            <thead
              class="bg-slate-50 text-slate-500"
            >
              <tr>
                <th
                  class="text-left px-5 py-3 font-semibold"
                >
                  Período
                </th>

                <th
                  class="text-right px-5 py-3 font-semibold"
                >
                  Ingresos
                </th>

                <th
                  class="text-right px-5 py-3 font-semibold"
                >
                  Gastos
                </th>

                <th
                  class="text-right px-5 py-3 font-semibold"
                >
                  Resultado
                </th>

                <th
                  class="text-right px-5 py-3 font-semibold"
                >
                  Movimientos
                </th>
              </tr>
            </thead>

            <tbody
              id="reportHistoryBody"
              class="divide-y divide-slate-100"
            >
              ${
                reportRows.length
                  ? reportRows
                      .map(
                        row => `
                          <tr
                            data-report-key="${row.key}"
                            class="report-row hover:bg-slate-50/70 cursor-pointer"
                          >
                            <td class="px-5 py-4">
                              <button
                                type="button"
                                class="font-bold text-agnavy hover:underline text-left"
                              >
                                ${escapeHtml(row.label)}
                              </button>
                            </td>

                            <td
                              class="px-5 py-4 text-right font-bold text-emerald-700"
                            >
                              ${money(row.ingresos)}
                            </td>

                            <td
                              class="px-5 py-4 text-right font-bold text-red-600"
                            >
                              ${money(row.gastos)}
                            </td>

                            <td
                              class="px-5 py-4 text-right font-bold ${
                                row.resultado >= 0
                                  ? 'text-agnavy'
                                  : 'text-red-600'
                              }"
                            >
                              ${money(row.resultado)}
                            </td>

                            <td
                              class="px-5 py-4 text-right text-slate-600"
                            >
                              ${row.movements.length}
                            </td>
                          </tr>
                        `
                      )
                      .join('')
                  : `
                    <tr>
                      <td
                        colspan="5"
                        class="px-5 py-8 text-center text-slate-500"
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


      ${reportModalTemplate()}

    </section>
  `;
}


export function initReportesEvents() {
  initModalCloseEvents();


  bindReportRows();


  const dateButton =
    document.getElementById(
      'dateFilterButton'
    );

  const datePanel =
    document.getElementById(
      'dateFilterPanel'
    );


  dateButton
    ?.addEventListener(
      'click',
      () => {

        datePanel
          ?.classList.toggle(
            'hidden'
          );

      }
    );


  document
    .getElementById(
      'reportPeriodFilter'
    )
    ?.addEventListener(
      'change',
      event => {

        reportPeriod =
          event.target.value;

        refreshReports();

      }
    );


  document
    .getElementById(
      'applyDateFilterBtn'
    )
    ?.addEventListener(
      'click',
      () => {

        reportStartDate =
          document
            .getElementById(
              'reportStartDate'
            )
            .value;

        reportEndDate =
          document
            .getElementById(
              'reportEndDate'
            )
            .value;


        updateDateLabel();


        datePanel
          ?.classList.add(
            'hidden'
          );


        refreshReports();

      }
    );


  document
    .getElementById(
      'clearDateFilterBtn'
    )
    ?.addEventListener(
      'click',
      () => {

        reportStartDate =
          '';

        reportEndDate =
          '';


        document
          .getElementById(
            'reportStartDate'
          )
          .value =
            '';

        document
          .getElementById(
            'reportEndDate'
          )
          .value =
            '';


        updateDateLabel();


        datePanel
          ?.classList.add(
            'hidden'
          );


        refreshReports();

      }
    );
}
