import { ventasService } from '../services/ventas.service.js';
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

let ventas = [];
let selectedId = null;
let editingId = null;

function renderVentaDetail() {
  return sideDetailTemplate({
    id: 'ventaDetail',
    eyebrow: 'Detalle de la venta',
    titleId: 'ventaDetailTitle',
    descriptionId: null,

    fields: [
      {
        id: 'ventaDetailCliente',
        label: 'Cliente'
      },
      {
        id: 'ventaDetailFecha',
        label: 'Fecha'
      },
      {
        id: 'ventaDetailConcepto',
        label: 'Concepto'
      },
      {
        id: 'ventaDetailEstado',
        label: 'Estado'
      },
      {
        id: 'ventaDetailValor',
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
          id="editarVentaBtn"
          type="button"
          class="btn-ag rounded-xl py-2.5 px-4 font-bold text-sm"
        >
          <i class="fa-solid fa-pen-to-square mr-2"></i>
          Editar
        </button>

        <button
          id="eliminarVentaBtn"
          type="button"
          class="h-11 w-11 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
          aria-label="Eliminar venta"
          title="Eliminar venta"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `
  });
}

function renderVentaModal() {
  return modalTemplate({
    id: 'ventaModal',
    titleId: 'ventaModalTitle',
    subtitleId: 'ventaModalSubtitle',

    body: `
      <form
        id="ventaForm"
        class="p-5 space-y-4"
      >
        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Cliente
          </label>

          <input
            id="ventaCliente"
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
            id="ventaProducto"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label
              class="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Cantidad
            </label>

            <input
              id="ventaCantidad"
              type="number"
              min="1"
              step="1"
              required
              class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Precio unitario
            </label>

            <input
              id="ventaPrecio"
              type="number"
              min="0"
              step="any"
              required
              class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label
              class="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Método de pago
            </label>

            <select
              id="ventaMetodo"
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
              id="ventaEstado"
              class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
            >
              <option>Pendiente</option>
              <option>Pagada</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2 pt-1">
          <button
            type="button"
            data-close-modal="ventaModal"
            class="w-full rounded-xl border border-slate-200 py-3 font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn-ag w-full rounded-xl py-3 font-bold"
          >
            Guardar venta
          </button>
        </div>
      </form>
    `
  });
}

export async function renderVentasPage() {
  ventas =
    (await ventasService.getAll()) || [];

  return `
    <section>

      <!-- Encabezado ORIGINAL -->
      <div
        class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"
      >
        <div>
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-agg"
          >
            Facturación
          </p>

          <h2
            class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1"
          >
            Ventas
          </h2>

          <p class="text-sm text-slate-500 mt-1">
            Consulta el historial de facturas registradas.
          </p>
        </div>

        <button
          id="nuevaVentaBtn"
          type="button"
          class="btn-ag rounded-xl px-4 py-2.5 text-sm font-bold self-start"
        >
          <i class="fa-solid fa-plus mr-2"></i>
          Nueva venta
        </button>
      </div>


      <!-- LISTA + MENÚ LATERAL DERECHO -->
      <div
        id="ventasWorkspace"
        class="detail-workspace"
      >

        <article
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div
            class="px-5 py-4 border-b border-slate-100"
          >
            <h3 class="font-bold text-slate-900">
              Historial de ventas
            </h3>

            <p
              class="text-xs text-slate-500 mt-0.5"
            >
              Selecciona una venta para ver sus detalles.
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
                    Factura
                  </th>

                  <th
                    class="text-left px-5 py-3 font-semibold"
                  >
                    Cliente
                  </th>

                  <th
                    class="text-right px-5 py-3 font-semibold"
                  >
                    Precio
                  </th>
                </tr>
              </thead>

              <tbody
                class="divide-y divide-slate-100"
              >
                ${
                  ventas.length
                    ? ventas
                        .map(
                          venta => `
                            <tr
                              data-venta-id="${venta.id}"
                              class="venta-row hover:bg-slate-50/70 cursor-pointer"
                            >
                              <td
                                class="px-5 py-4"
                              >
                                <button
                                  type="button"
                                  class="font-bold text-agnavy hover:underline text-left"
                                >
                                  ${escapeHtml(venta.numero)}
                                </button>
                              </td>

                              <td
                                class="px-5 py-4 text-slate-700"
                              >
                                ${escapeHtml(venta.cliente)}
                              </td>

                              <td
                                class="px-5 py-4 text-right font-bold text-slate-800"
                              >
                                ${money(venta.total)}
                              </td>
                            </tr>
                          `
                        )
                        .join('')
                    : `
                      <tr>
                        <td
                          colspan="3"
                          class="px-5 py-8 text-center text-slate-500"
                        >
                          No hay ventas registradas.
                        </td>
                      </tr>
                    `
                }
              </tbody>

            </table>
          </div>
        </article>

        ${renderVentaDetail()}

      </div>

      ${renderVentaModal()}

    </section>
  `;
}

function selectedVenta() {
  return ventas.find(
    venta =>
      venta.id === selectedId
  );
}

function showVentaDetail(venta) {
  if (!venta) return;

  selectedId = venta.id;

  document
    .getElementById('ventaDetailTitle')
    .textContent =
      venta.numero;

  document
    .getElementById('ventaDetailCliente')
    .textContent =
      venta.cliente;

  document
    .getElementById('ventaDetailFecha')
    .textContent =
      shortDate(venta.fecha);

  document
    .getElementById('ventaDetailConcepto')
    .textContent =
      venta.producto;

  document
    .getElementById('ventaDetailEstado')
    .textContent =
      venta.estado;

  document
    .getElementById('ventaDetailValor')
    .textContent =
      money(venta.total);

  openSideDetail(
    'ventasWorkspace',
    'ventaDetail'
  );
}

function openVentaModal(venta = null) {
  editingId =
    venta?.id ?? null;

  document
    .getElementById('ventaForm')
    .reset();

  document
    .getElementById('ventaModalTitle')
    .textContent =
      venta
        ? 'Editar venta'
        : 'Nueva venta';

  document
    .getElementById('ventaModalSubtitle')
    .textContent =
      venta
        ? 'Actualiza la información de la venta seleccionada.'
        : 'Registra una factura o ingreso.';

  if (venta) {
    document.getElementById('ventaCliente').value =
      venta.cliente;

    document.getElementById('ventaProducto').value =
      venta.producto;

    document.getElementById('ventaCantidad').value =
      venta.cantidad;

    document.getElementById('ventaPrecio').value =
      venta.precioUnitario;

    document.getElementById('ventaMetodo').value =
      venta.metodoPago;

    document.getElementById('ventaEstado').value =
      venta.estado;
  }

  openModal('ventaModal');
}

export function initVentasEvents() {
  initModalCloseEvents();

  initSideDetailEvents({
    ventaDetail:
      'ventasWorkspace'
  });

  document
    .getElementById('nuevaVentaBtn')
    ?.addEventListener(
      'click',
      () => openVentaModal()
    );

  document
    .querySelectorAll('.venta-row')
    .forEach(row => {
      row.addEventListener(
        'click',
        () => {
          const id =
            Number(
              row.dataset.ventaId
            );

          showVentaDetail(
            ventas.find(
              venta =>
                venta.id === id
            )
          );
        }
      );
    });

  document
    .getElementById('editarVentaBtn')
    ?.addEventListener(
      'click',
      () =>
        openVentaModal(
          selectedVenta()
        )
    );

  document
    .getElementById('eliminarVentaBtn')
    ?.addEventListener(
      'click',
      async () => {
        const venta =
          selectedVenta();

        if (!venta) return;

        const confirmed =
          await showConfirm({
            title: 'Eliminar venta',
            message: `¿Eliminar la venta ${venta.numero}?`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            type: 'danger'
          });

        if (!confirmed) {
          return;
        }

        try {
          await ventasService.delete(
            venta.id
          );

          closeSideDetail(
            'ventasWorkspace',
            'ventaDetail'
          );

          showToast(
            'Venta eliminada correctamente.',
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
    .getElementById('ventaForm')
    ?.addEventListener(
      'submit',
      async event => {
        event.preventDefault();

        const data = {
          cliente:
            document
              .getElementById('ventaCliente')
              .value
              .trim(),

          producto:
            document
              .getElementById('ventaProducto')
              .value
              .trim(),

          cantidad:
            Number(
              document.getElementById(
                'ventaCantidad'
              ).value
            ),

          precioUnitario:
            Number(
              document.getElementById(
                'ventaPrecio'
              ).value
            ),

          metodoPago:
            document.getElementById(
              'ventaMetodo'
            ).value,

          estado:
            document.getElementById(
              'ventaEstado'
            ).value
        };

        try {
          if (editingId) {
            await ventasService.update(
              editingId,
              data
            );

            showToast(
              'Venta actualizada correctamente.',
              'success'
            );

          } else {
            await ventasService.create(
              data
            );

            showToast(
              'Venta creada correctamente.',
              'success'
            );
          }

          closeModal(
            'ventaModal'
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
}
