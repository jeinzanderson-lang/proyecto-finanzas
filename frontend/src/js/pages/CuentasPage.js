import { cuentasService } from '../services/cuentas.service.js';
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
import { escapeHtml } from '../utils/format.js';

let cuentas = [];
let selectedId = null;
let editingId = null;

function nombreTipo(tipo = '') {
  const tipos = {
    ACTIVO: 'Activo',
    PASIVO: 'Pasivo',
    PATRIMONIO: 'Patrimonio',
    INGRESO: 'Ingreso',
    GASTO: 'Gasto'
  };

  return (
    tipos[
      String(tipo).toUpperCase()
    ] ||
    tipo
  );
}

function renderCuentaDetail() {
  return sideDetailTemplate({
    id: 'cuentaDetail',
    eyebrow: 'Detalle de la cuenta',
    titleId: 'cuentaDetailTitle',
    descriptionId: 'cuentaDetailDescription',

    fields: [
      {
        id: 'cuentaDetailCodigo',
        label: 'Código'
      },
      {
        id: 'cuentaDetailTipo',
        label: 'Tipo'
      }
    ],

    actions: `
      <div
        class="grid grid-cols-[1fr_auto] gap-2 mt-5"
      >
        <button
          id="editarCuentaBtn"
          type="button"
          class="btn-ag rounded-xl py-2.5 px-4 font-bold text-sm"
        >
          <i class="fa-solid fa-pen-to-square mr-2"></i>
          Editar
        </button>

        <button
          id="eliminarCuentaBtn"
          type="button"
          class="h-11 w-11 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
          aria-label="Eliminar cuenta"
          title="Eliminar cuenta"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `
  });
}

function renderCuentaModal() {
  return modalTemplate({
    id: 'cuentaModal',
    titleId: 'cuentaModalTitle',
    subtitleId: 'cuentaModalSubtitle',

    body: `
      <form
        id="cuentaForm"
        class="p-5 space-y-4"
      >
        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Código
          </label>

          <input
            id="cuentaCodigo"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Nombre de la cuenta
          </label>

          <input
            id="cuentaNombre"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Tipo
          </label>

          <select
            id="cuentaTipo"
            required
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
          >
            <option value="ACTIVO">Activo</option>
            <option value="PASIVO">Pasivo</option>
            <option value="PATRIMONIO">Patrimonio</option>
            <option value="INGRESO">Ingreso</option>
            <option value="GASTO">Gasto</option>
          </select>
        </div>

        <div>
          <label
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Descripción
          </label>

          <textarea
            id="cuentaDescripcion"
            rows="3"
            class="input-ag w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 gap-2 pt-1">
          <button
            type="button"
            data-close-modal="cuentaModal"
            class="w-full rounded-xl border border-slate-200 py-3 font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn-ag w-full rounded-xl py-3 font-bold"
          >
            Guardar cuenta
          </button>
        </div>
      </form>
    `
  });
}

export async function renderCuentasPage() {
  cuentas =
    (await cuentasService.getAll()) || [];

  return `
    <section>

      <div
        class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"
      >
        <div>
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-agg"
          >
            Administración
          </p>

          <h2
            class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1"
          >
            Cuentas
          </h2>

          <p class="text-sm text-slate-500 mt-1">
            Consulta y administra el catálogo de cuentas.
          </p>
        </div>

        <button
          id="nuevaCuentaBtn"
          type="button"
          class="btn-ag rounded-xl px-4 py-2.5 text-sm font-bold self-start"
        >
          <i class="fa-solid fa-plus mr-2"></i>
          Nueva cuenta
        </button>
      </div>


      <div
        id="cuentasWorkspace"
        class="detail-workspace"
      >

        <article
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div
            class="px-5 py-4 border-b border-slate-100"
          >
            <h3 class="font-bold text-slate-900">
              Lista de cuentas
            </h3>

            <p
              class="text-xs text-slate-500 mt-0.5"
            >
              Selecciona una cuenta para ver sus detalles.
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
                    Código
                  </th>

                  <th
                    class="text-left px-5 py-3 font-semibold"
                  >
                    Cuenta
                  </th>

                  <th
                    class="text-left px-5 py-3 font-semibold"
                  >
                    Tipo
                  </th>
                </tr>
              </thead>

              <tbody
                class="divide-y divide-slate-100"
              >
                ${
                  cuentas.length
                    ? cuentas
                        .map(
                          cuenta => `
                            <tr
                              data-cuenta-id="${cuenta.id}"
                              class="cuenta-row hover:bg-slate-50/70 cursor-pointer"
                            >
                              <td class="px-5 py-4">
                                <button
                                  type="button"
                                  class="font-bold text-agnavy hover:underline text-left"
                                >
                                  ${escapeHtml(cuenta.codigo)}
                                </button>
                              </td>

                              <td
                                class="px-5 py-4 text-slate-700"
                              >
                                ${escapeHtml(cuenta.nombre)}
                              </td>

                              <td
                                class="px-5 py-4 text-slate-600"
                              >
                                ${escapeHtml(
                                  nombreTipo(cuenta.tipo)
                                )}
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
                          No hay cuentas registradas.
                        </td>
                      </tr>
                    `
                }
              </tbody>

            </table>
          </div>
        </article>

        ${renderCuentaDetail()}

      </div>

      ${renderCuentaModal()}

    </section>
  `;
}

function selectedCuenta() {
  return cuentas.find(
    cuenta =>
      cuenta.id === selectedId
  );
}

function showCuentaDetail(cuenta) {
  if (!cuenta) return;

  selectedId = cuenta.id;

  document
    .getElementById('cuentaDetailTitle')
    .textContent =
      cuenta.nombre;

  document
    .getElementById('cuentaDetailDescription')
    .textContent =
      cuenta.descripcion ||
      'Sin descripción.';

  document
    .getElementById('cuentaDetailCodigo')
    .textContent =
      cuenta.codigo;

  document
    .getElementById('cuentaDetailTipo')
    .textContent =
      nombreTipo(cuenta.tipo);

  openSideDetail(
    'cuentasWorkspace',
    'cuentaDetail'
  );
}

function openCuentaModal(cuenta = null) {
  editingId =
    cuenta?.id ?? null;

  document
    .getElementById('cuentaForm')
    .reset();

  document
    .getElementById('cuentaModalTitle')
    .textContent =
      cuenta
        ? 'Editar cuenta'
        : 'Nueva cuenta';

  document
    .getElementById('cuentaModalSubtitle')
    .textContent =
      cuenta
        ? 'Actualiza la información de la cuenta seleccionada.'
        : 'Registra una nueva cuenta contable.';

  if (cuenta) {
    document.getElementById('cuentaCodigo').value =
      cuenta.codigo;

    document.getElementById('cuentaNombre').value =
      cuenta.nombre;

    document.getElementById('cuentaTipo').value =
      String(cuenta.tipo).toUpperCase();

    document.getElementById('cuentaDescripcion').value =
      cuenta.descripcion || '';
  }

  openModal('cuentaModal');
}

export function initCuentasEvents() {
  initModalCloseEvents();

  initSideDetailEvents({
    cuentaDetail:
      'cuentasWorkspace'
  });

  document
    .getElementById('nuevaCuentaBtn')
    ?.addEventListener(
      'click',
      () => openCuentaModal()
    );

  document
    .querySelectorAll('.cuenta-row')
    .forEach(row => {
      row.addEventListener(
        'click',
        () => {
          const id =
            Number(
              row.dataset.cuentaId
            );

          showCuentaDetail(
            cuentas.find(
              cuenta =>
                cuenta.id === id
            )
          );
        }
      );
    });

  document
    .getElementById('editarCuentaBtn')
    ?.addEventListener(
      'click',
      () =>
        openCuentaModal(
          selectedCuenta()
        )
    );

  document
    .getElementById('eliminarCuentaBtn')
    ?.addEventListener(
      'click',
      async () => {
        const cuenta =
          selectedCuenta();

        if (!cuenta) return;

        const confirmed =
          await showConfirm({
            title: 'Eliminar cuenta',
            message: `¿Eliminar la cuenta "${cuenta.nombre}"?`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            type: 'danger'
          });

        if (!confirmed) {
          return;
        }

        try {
          await cuentasService.delete(
            cuenta.id
          );

          closeSideDetail(
            'cuentasWorkspace',
            'cuentaDetail'
          );

          showToast(
            'Cuenta eliminada correctamente.',
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
    .getElementById('cuentaForm')
    ?.addEventListener(
      'submit',
      async event => {
        event.preventDefault();

        const data = {
          codigo:
            document
              .getElementById('cuentaCodigo')
              .value
              .trim(),

          nombre:
            document
              .getElementById('cuentaNombre')
              .value
              .trim(),

          tipo:
            document.getElementById(
              'cuentaTipo'
            ).value,

          descripcion:
            document
              .getElementById('cuentaDescripcion')
              .value
              .trim()
        };

        try {
          if (editingId) {
            await cuentasService.update(
              editingId,
              data
            );

            showToast(
              'Cuenta actualizada correctamente.',
              'success'
            );

          } else {
            await cuentasService.create(
              data
            );

            showToast(
              'Cuenta creada correctamente.',
              'success'
            );
          }

          closeModal('cuentaModal');

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
