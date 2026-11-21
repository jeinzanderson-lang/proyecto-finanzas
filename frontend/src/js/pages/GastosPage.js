import { gastosService } from '../services/gastos.service.js';
import { showToast, showConfirm } from '../components/ui/toast.js';
import {
  modalTemplate,
  openModal,
  closeModal,
  initModalCloseEvents
} from '../components/ui/modal.js';
import {
  sideDetailTemplate,
  openSideDetail,
  closeSideDetail,
  initSideDetailEvents
} from '../components/ui/sideDetail.js';
import {
  money,
  shortDate,
  escapeHtml
} from '../utils/format.js';

let gastos = [];
let selectedId = null;
let editingId = null;

function renderGastoDetail() {
  return sideDetailTemplate({
    id: 'gastoDetail',
    eyebrow: 'Detalle del gasto',
    titleId: 'gastoDetailTitle',
    descriptionId: null,

    fields: [
      {
        id: 'gastoDetailProveedor',
        label: 'Proveedor'
      },
      {
        id: 'gastoDetailConcepto',
        label: 'Concepto'
      },
      {
        id: 'gastoDetailFecha',
        label: 'Vencimiento'
      },
      {
        id: 'gastoDetailEstado',
        label: 'Estado'
      },
      {
        id: 'gastoDetailValor',
        label: 'Valor',
        divider: true,
        accent: true
      }
    ],

    actions: `
      <div
        class="grid grid-cols-[1fr_auto] gap-2 mt-5"
      >
        <button
          id="editarGastoBtn"
          type="button"
          class="btn-ag rounded-xl py-2.5 px-4 font-bold text-sm"
        >
          <i class="fa-solid fa-pen-to-square mr-2"></i>
          Editar
        </button>

        <button
          id="eliminarGastoBtn"
          type="button"
          class="h-11 w-11 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
          aria-label="Eliminar gasto"
          title="Eliminar gasto"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `
  });
}

function renderGastoModal() {
  return modalTemplate({
    id: 'gastoModal',
    titleId: 'gastoModalTitle',
    subtitleId: 'gastoModalSubtitle',

    body: `
      <form
        id="gastoForm"
        class="p-5 space-y-4"
      >
        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Proveedor
          </label>

          <input
            id="gastoProveedor"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Concepto
          </label>

          <input
            id="gastoConcepto"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Categoría
          </label>

          <input
            id="gastoCategoria"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Valor
          </label>

          <input
            id="gastoMonto"
            type="number"
            min="0"
            step="any"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label
              class="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Método de pago
            </label>

            <select
              id="gastoMetodo"
              class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
            >
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Tarjeta</option>
            </select>
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Estado
            </label>

            <select
              id="gastoEstado"
              class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
            >
              <option>Pendiente</option>
              <option>Pagado</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2 pt-1">
          <button
            type="button"
            data-close-modal="gastoModal"
            class="w-full rounded-xl border border-slate-200 py-3 font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn-ag w-full rounded-xl py-3 font-bold"
          >
            Guardar gasto
          </button>
        </div>
      </form>
    `
  });
}

export async function renderGastosPage() {
  gastos =
    (await gastosService.getAll()) || [];

  return `
    <section>

      <div
        class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"
      >
        <div>
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-agg"
          >
            Egresos
          </p>

          <h2
            class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1"
          >
            Gastos
          </h2>

          <p class="text-sm text-slate-500 mt-1">
            Consulta el historial de gastos y cuentas por pagar.
          </p>
        </div>

        <button
          id="nuevoGastoBtn"
          type="button"
          class="btn-ag rounded-xl px-4 py-2.5 text-sm font-bold self-start"
        >
          <i class="fa-solid fa-plus mr-2"></i>
          Nuevo gasto
        </button>
      </div>


      <div
        id="gastosWorkspace"
        class="detail-workspace"
      >

        <article
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div
            class="px-5 py-4 border-b border-slate-100"
          >
            <h3 class="font-bold text-slate-900">
              Historial de gastos
            </h3>

            <p
              class="text-xs text-slate-500 mt-0.5"
            >
              Movimientos registrados.
            </p>
          </div>

          <div class="table-wrap">
            <table class="w-full text-sm">

              <thead
                class="bg-slate-50 text-slate-500"
              >
                <tr>
                  <th
                    class="text-left px-5 py-3 font-semibold"
                  >
                    Referencia
                  </th>

                  <th
                    class="text-left px-5 py-3 font-semibold"
                  >
                    Proveedor
                  </th>

                  <th
                    class="text-right px-5 py-3 font-semibold"
                  >
                    Valor
                  </th>

                  <th
                    class="text-center px-5 py-3 font-semibold"
                  >
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody
                class="divide-y divide-slate-100"
              >
                ${
                  gastos.length
                    ? gastos
                        .map(
                          gasto => `
                            <tr
                              data-gasto-id="${gasto.id}"
                              class="gasto-row hover:bg-slate-50/70 cursor-pointer"
                            >
                              <td class="px-5 py-4">
                                <button
                                  type="button"
                                  class="font-bold text-agnavy hover:underline text-left"
                                >
                                  ${escapeHtml(gasto.numero)}
                                </button>
                              </td>

                              <td
                                class="px-5 py-4 text-slate-700"
                              >
                                ${escapeHtml(gasto.proveedor)}
                              </td>

                              <td
                                class="px-5 py-4 text-right font-bold text-slate-800"
                              >
                                ${money(gasto.monto)}
                              </td>

                              <td
                                class="px-5 py-4 text-center"
                              >
                                ${escapeHtml(gasto.estado)}
                              </td>
                            </tr>
                          `
                        )
                        .join('')
                    : `
                      <tr>
                        <td
                          colspan="4"
                          class="px-5 py-8 text-center text-slate-500"
                        >
                          No hay gastos registrados.
                        </td>
                      </tr>
                    `
                }
              </tbody>

            </table>
          </div>
        </article>

        ${renderGastoDetail()}

      </div>

      ${renderGastoModal()}

    </section>
  `;
}

function selectedGasto() {
  return gastos.find(
    gasto =>
      gasto.id === selectedId
  );
}

function showGastoDetail(gasto) {
  if (!gasto) return;

  selectedId = gasto.id;

  document
    .getElementById('gastoDetailTitle')
    .textContent =
      gasto.numero;

  document
    .getElementById('gastoDetailProveedor')
    .textContent =
      gasto.proveedor;

  document
    .getElementById('gastoDetailConcepto')
    .textContent =
      gasto.concepto;

  document
    .getElementById('gastoDetailFecha')
    .textContent =
      shortDate(gasto.fecha);

  document
    .getElementById('gastoDetailEstado')
    .textContent =
      gasto.estado;

  document
    .getElementById('gastoDetailValor')
    .textContent =
      money(gasto.monto);

  openSideDetail(
    'gastosWorkspace',
    'gastoDetail'
  );
}

function openGastoModal(gasto = null) {
  editingId =
    gasto?.id ?? null;

  document
    .getElementById('gastoForm')
    .reset();

  document
    .getElementById('gastoModalTitle')
    .textContent =
      gasto
        ? 'Editar gasto'
        : 'Nuevo gasto';

  document
    .getElementById('gastoModalSubtitle')
    .textContent =
      gasto
        ? 'Actualiza la información del gasto seleccionado.'
        : 'Registra una cuenta por pagar o egreso.';

  if (gasto) {
    document.getElementById('gastoProveedor').value =
      gasto.proveedor;

    document.getElementById('gastoConcepto').value =
      gasto.concepto;

    document.getElementById('gastoCategoria').value =
      gasto.categoria;

    document.getElementById('gastoMonto').value =
      gasto.monto;

    document.getElementById('gastoMetodo').value =
      gasto.metodoPago;

    document.getElementById('gastoEstado').value =
      gasto.estado;
  }

  openModal('gastoModal');
}

export function initGastosEvents() {
  initModalCloseEvents();

  initSideDetailEvents({
    gastoDetail:
      'gastosWorkspace'
  });

  document
    .getElementById('nuevoGastoBtn')
    ?.addEventListener(
      'click',
      () => openGastoModal()
    );

  document
    .querySelectorAll('.gasto-row')
    .forEach(row => {
      row.addEventListener(
        'click',
        () => {
          const id =
            Number(
              row.dataset.gastoId
            );

          showGastoDetail(
            gastos.find(
              gasto =>
                gasto.id === id
            )
          );
        }
      );
    });

  document
    .getElementById('editarGastoBtn')
    ?.addEventListener(
      'click',
      () =>
        openGastoModal(
          selectedGasto()
        )
    );

  document
    .getElementById('eliminarGastoBtn')
    ?.addEventListener(
      'click',
      async () => {
        const gasto =
          selectedGasto();

        if (!gasto) return;

        const confirmed =
          await showConfirm({
            title: 'Eliminar gasto',
            message: `¿Eliminar el gasto ${gasto.numero}?`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            type: 'danger'
          });

        if (!confirmed) {
          return;
        }

        try {
          await gastosService.delete(
            gasto.id
          );

          closeSideDetail(
            'gastosWorkspace',
            'gastoDetail'
          );

          showToast(
            'Gasto eliminado correctamente.',
            'success'
          );

          window.dispatchEvent(
            new Event('app:refresh')
          );

        } catch (error) {
          showToast(
            error.message,
            'error'
          );
        }
      }
    );

  document
    .getElementById('gastoForm')
    ?.addEventListener(
      'submit',
      async event => {
        event.preventDefault();

        const data = {
          categoria:
            document
              .getElementById('gastoCategoria')
              .value
              .trim(),

          proveedor:
            document
              .getElementById('gastoProveedor')
              .value
              .trim(),

          concepto:
            document
              .getElementById('gastoConcepto')
              .value
              .trim(),

          monto:
            Number(
              document.getElementById(
                'gastoMonto'
              ).value
            ),

          metodoPago:
            document.getElementById(
              'gastoMetodo'
            ).value,

          estado:
            document.getElementById(
              'gastoEstado'
            ).value,

          comprobante: ''
        };

        try {
          if (editingId) {
            await gastosService.update(
              editingId,
              data
            );

            showToast(
              'Gasto actualizado correctamente.',
              'success'
            );

          } else {
            await gastosService.create(
              data
            );

            showToast(
              'Gasto creado correctamente.',
              'success'
            );
          }

          closeModal('gastoModal');

          window.dispatchEvent(
            new Event('app:refresh')
          );

        } catch (error) {
          showToast(
            error.message,
            'error'
          );
        }
      }
    );
}
