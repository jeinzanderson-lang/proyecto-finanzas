import { inventarioService } from '../services/inventario.service.js';
import { sessionService } from '../auth/session.service.js';
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
  escapeHtml
} from '../utils/format.js';

let productos = [];
let selectedId = null;
let editingId = null;

function renderProductoDetail() {
  return sideDetailTemplate({
    id: 'productoDetail',
    eyebrow: 'Detalle del producto',
    titleId: 'productoDetailTitle',
    descriptionId: 'productoDetailDescription',

    fields: [
      {
        id: 'productoDetailCodigo',
        label: 'ID / SKU'
      },
      {
        id: 'productoDetailCosto',
        label: 'Costo'
      },
      {
        id: 'productoDetailStock',
        label: 'Stock'
      }
    ],

    actions: `
      <div
        id="productoAdminActions"
        class="grid grid-cols-[1fr_auto] gap-2 mt-5"
      >
        <button
          id="editarProductoBtn"
          type="button"
          class="btn-ag rounded-xl py-2.5 px-4 font-bold text-sm"
        >
          <i class="fa-solid fa-pen-to-square mr-2"></i>
          Editar
        </button>

        <button
          id="eliminarProductoBtn"
          type="button"
          class="h-11 w-11 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
          aria-label="Eliminar producto"
          title="Eliminar producto"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `
  });
}

function renderProductoModal() {
  return modalTemplate({
    id: 'productoModal',
    titleId: 'productoModalTitle',
    subtitleId: 'productoModalSubtitle',

    body: `
      <form
        id="productoForm"
        class="p-5 space-y-4"
      >
        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Descripción breve
          </label>

          <input
            id="productoDescripcion"
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            SKU / ID
          </label>

          <input
            id="productoCodigo"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Producto
          </label>

          <input
            id="productoNombre"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Stock
          </label>

          <input
            id="productoStock"
            type="number"
            min="0"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Costo
          </label>

          <input
            id="productoCosto"
            type="number"
            min="0"
            step="any"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Precio
          </label>

          <input
            id="productoPrecio"
            type="number"
            min="0"
            step="any"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div class="grid grid-cols-1 gap-2 pt-1">
          <button
            type="button"
            data-close-modal="productoModal"
            class="w-full rounded-xl border border-slate-200 py-3 font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn-ag w-full rounded-xl py-3 font-bold"
          >
            Guardar producto
          </button>
        </div>
      </form>
    `
  });
}

export async function renderInventarioPage() {
  productos =
    (await inventarioService.getAll()) || [];

  const admin =
    sessionService.isAdmin();

  return `
    <section>

      <div
        class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"
      >
        <div>
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-agg"
          >
            Control operativo
          </p>

          <h2
            class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1"
          >
            Inventario
          </h2>

          <p class="text-sm text-slate-500 mt-1">
            Consulta productos, precios y disponibilidad.
          </p>
        </div>

        ${
          admin
            ? `
              <button
                id="nuevoProductoBtn"
                type="button"
                class="btn-ag rounded-xl px-4 py-2.5 text-sm font-bold self-start"
              >
                <i class="fa-solid fa-plus mr-2"></i>
                Nuevo producto
              </button>
            `
            : ''
        }
      </div>


      <div
        id="inventarioWorkspace"
        class="detail-workspace"
      >

        <article
          class="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div
            class="px-5 py-4 border-b border-slate-100"
          >
            <h3 class="font-bold text-slate-900">
              Catálogo de inventario
            </h3>

            <p
              class="text-xs text-slate-500 mt-0.5"
            >
              Selecciona el nombre de un producto para ver sus detalles.
            </p>
          </div>

          <div class="table-wrap">
            <table
              class="w-full text-sm"
              style="min-width: 560px;"
            >
              <thead
                class="bg-slate-50 text-slate-500"
              >
                <tr>
                  <th
                    class="text-left px-5 py-3 font-semibold"
                  >
                    Producto
                  </th>

                  <th
                    class="text-right px-5 py-3 font-semibold"
                  >
                    Precio
                  </th>

                  <th
                    class="text-left px-5 py-3 font-semibold"
                  >
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody
                class="divide-y divide-slate-100"
              >
                ${
                  productos.length
                    ? productos
                        .map(
                          producto => `
                            <tr
                              data-producto-id="${producto.id}"
                              class="producto-row hover:bg-slate-50/70 cursor-pointer"
                            >
                              <td class="px-5 py-4">
                                <button
                                  type="button"
                                  class="font-bold text-agnavy hover:underline text-left"
                                >
                                  ${escapeHtml(producto.nombre)}
                                </button>
                              </td>

                              <td
                                class="px-5 py-4 text-right font-bold text-slate-800"
                              >
                                ${money(producto.precio)}
                              </td>

                              <td
                                class="px-5 py-4"
                              >
                                ${escapeHtml(producto.estado)}
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
                          No hay productos registrados en el inventario.
                        </td>
                      </tr>
                    `
                }
              </tbody>
            </table>
          </div>
        </article>

        ${renderProductoDetail()}

      </div>

      ${renderProductoModal()}

    </section>
  `;
}

function selectedProducto() {
  return productos.find(
    producto =>
      producto.id === selectedId
  );
}

function showProductoDetail(producto) {
  if (!producto) return;

  selectedId = producto.id;

  document
    .getElementById('productoDetailTitle')
    .textContent =
      producto.nombre;

  document
    .getElementById('productoDetailDescription')
    .textContent =
      producto.descripcion ||
      'Sin descripción.';

  document
    .getElementById('productoDetailCodigo')
    .textContent =
      producto.codigo;

  document
    .getElementById('productoDetailCosto')
    .textContent =
      money(producto.costo);

  document
    .getElementById('productoDetailStock')
    .textContent =
      `${producto.stock} unidades`;

  document
    .getElementById('productoAdminActions')
    ?.classList.toggle(
      'hidden',
      !sessionService.isAdmin()
    );

  openSideDetail(
    'inventarioWorkspace',
    'productoDetail'
  );
}

function openProductoModal(producto = null) {
  editingId =
    producto?.id ?? null;

  document
    .getElementById('productoForm')
    .reset();

  document
    .getElementById('productoModalTitle')
    .textContent =
      producto
        ? 'Editar producto'
        : 'Nuevo producto';

  document
    .getElementById('productoModalSubtitle')
    .textContent =
      producto
        ? 'Actualiza la información del producto seleccionado.'
        : 'Registra un producto en el inventario.';

  if (producto) {
    document.getElementById('productoDescripcion').value =
      producto.descripcion || '';

    document.getElementById('productoCodigo').value =
      producto.codigo;

    document.getElementById('productoNombre').value =
      producto.nombre;

    document.getElementById('productoStock').value =
      producto.stock;

    document.getElementById('productoCosto').value =
      producto.costo;

    document.getElementById('productoPrecio').value =
      producto.precio;
  }

  openModal('productoModal');
}

export function initInventarioEvents() {
  initModalCloseEvents();

  initSideDetailEvents({
    productoDetail:
      'inventarioWorkspace'
  });

  document
    .getElementById('nuevoProductoBtn')
    ?.addEventListener(
      'click',
      () => openProductoModal()
    );

  document
    .querySelectorAll('.producto-row')
    .forEach(row => {
      row.addEventListener(
        'click',
        () => {
          const id =
            Number(
              row.dataset.productoId
            );

          showProductoDetail(
            productos.find(
              producto =>
                producto.id === id
            )
          );
        }
      );
    });

  document
    .getElementById('editarProductoBtn')
    ?.addEventListener(
      'click',
      () =>
        openProductoModal(
          selectedProducto()
        )
    );

  document
    .getElementById('eliminarProductoBtn')
    ?.addEventListener(
      'click',
      async () => {
        const producto =
          selectedProducto();

        if (!producto) return;

        const confirmed =
          await showConfirm({
            title: 'Eliminar producto',
            message: `¿Eliminar el producto "${producto.nombre}"?`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            type: 'danger'
          });

        if (!confirmed) {
          return;
        }

        try {
          await inventarioService.delete(
            producto.id
          );

          closeSideDetail(
            'inventarioWorkspace',
            'productoDetail'
          );

          showToast(
            'Producto eliminado correctamente.',
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
    .getElementById('productoForm')
    ?.addEventListener(
      'submit',
      async event => {
        event.preventDefault();

        const productoActual =
          selectedProducto();

        const data = {
          codigo:
            document
              .getElementById('productoCodigo')
              .value
              .trim(),

          nombre:
            document
              .getElementById('productoNombre')
              .value
              .trim(),

          categoria:
            productoActual?.categoria ||
            'Otros',

          precio:
            Number(
              document.getElementById(
                'productoPrecio'
              ).value
            ),

          costo:
            Number(
              document.getElementById(
                'productoCosto'
              ).value
            ),

          stock:
            Number(
              document.getElementById(
                'productoStock'
              ).value
            ),

          stockMinimo:
            productoActual?.stockMinimo ??
            5,

          proveedor:
            productoActual?.proveedor ||
            '',

          descripcion:
            document
              .getElementById('productoDescripcion')
              .value
              .trim()
        };

        try {
          if (editingId) {
            await inventarioService.update(
              editingId,
              data
            );

            showToast(
              'Producto actualizado correctamente.',
              'success'
            );

          } else {
            await inventarioService.create(
              data
            );

            showToast(
              'Producto creado correctamente.',
              'success'
            );
          }

          closeModal('productoModal');

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
