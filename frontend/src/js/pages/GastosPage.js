// src/js/pages/GastosPage.js
import { gastosService } from '../services/gastos.service.js';
import * as bootstrap from 'bootstrap';
import { showToast, showConfirm } from '../utils/toast.js';

let modalGastoInstance = null;


// ======================================================
// RENDER PRINCIPAL
// ======================================================

export async function renderGastosPage() {
  const gastos = await gastosService.getAll();
  const estadisticas = calcularEstadisticas(gastos);

  const categorias = [
    'Servicios Públicos',
    'Insumos',
    'Transporte',
    'Nómina',
    'Mantenimiento',
    'Otros'
  ];

  const gastosRows = renderTablaGastos(gastos);

  const categoriasOptions = categorias
    .map(
      categoria =>
        `<option value="${categoria}">${categoria}</option>`
    )
    .join('');

  return `
    <div class="container-fluid">

      <div class="page-header d-flex justify-content-between align-items-start mb-4">
        <div>
          <div class="page-subtitle">GESTIÓN DE EGRESOS</div>
          <h2>Gastos</h2>
          <p class="page-description">
            Administra los egresos y gastos del sistema.
          </p>
        </div>

        <button class="btn btn-danger" id="btnNuevoGasto">
          <i class="bi bi-plus-circle me-2"></i>
          Nuevo Gasto
        </button>
      </div>


      <!-- KPIs -->
      <div class="row g-3 mb-4">

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Total Gastos</div>
            <div class="kpi-value">
              ${estadisticas.totalGastos}
            </div>
            <div class="kpi-trend down">
              Registros acumulados
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Monto Total</div>
            <div class="kpi-value">
              $${estadisticas.montoTotal.toLocaleString(
                'es-CO',
                { minimumFractionDigits: 0 }
              )}
            </div>
            <div class="kpi-trend down">
              Egresos totales
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Pagado</div>
            <div class="kpi-value">
              $${estadisticas.montoPagado.toLocaleString(
                'es-CO',
                { minimumFractionDigits: 0 }
              )}
            </div>
            <div class="kpi-trend up">
              Cancelados
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Pendiente</div>
            <div class="kpi-value">
              $${estadisticas.montoPendiente.toLocaleString(
                'es-CO',
                { minimumFractionDigits: 0 }
              )}
            </div>
            <div class="kpi-trend down">
              Por pagar
            </div>
          </div>
        </div>

      </div>


      <!-- FILTROS -->
      <div class="card mb-4">
        <div class="card-body">

          <div class="row g-3">

            <div class="col-12 col-md-5">
              <input
                type="text"
                class="form-control"
                id="buscarGasto"
                placeholder="🔍 Buscar por concepto, proveedor o número..."
              >
            </div>

            <div class="col-12 col-md-3">
              <select
                class="form-select"
                id="filtroEstadoGasto"
              >
                <option value="">
                  Todos los estados
                </option>
                <option value="Pagado">
                  Pagado
                </option>
                <option value="Pendiente">
                  Pendiente
                </option>
                <option value="Cancelado">
                  Cancelado
                </option>
              </select>
            </div>

            <div class="col-12 col-md-2">
              <select
                class="form-select"
                id="filtroCategoria"
              >
                <option value="">
                  Todas las categorías
                </option>
                ${categoriasOptions}
              </select>
            </div>

            <div class="col-12 col-md-2">
              <button
                class="btn btn-outline-secondary w-100"
                id="btnLimpiarGastos"
              >
                <i class="bi bi-x-circle"></i>
                Limpiar
              </button>
            </div>

          </div>

        </div>
      </div>


      <!-- TABLA -->
      <div class="card">
        <div class="card-body p-0">

          <div class="table-responsive">

            <table class="table table-hover mb-0 align-middle">

              <thead>
                <tr>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Categoría</th>
                  <th>Concepto</th>
                  <th>Proveedor</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody id="tablaGastosBody">
                ${gastosRows}
              </tbody>

            </table>

          </div>

        </div>
      </div>


      <!-- MODAL -->
      <div
        id="modalGasto"
        class="modal fade"
        tabindex="-1"
      >

        <div class="modal-dialog modal-lg">

          <div class="modal-content">

            <div class="modal-header">

              <h5
                class="modal-title fw-bold"
                id="modalTituloGasto"
              >
                Nuevo Gasto
              </h5>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>

            </div>


            <div class="modal-body">

              <form id="formGasto">

                <input
                  type="hidden"
                  id="gastoId"
                >

                <div class="row g-3">

                  <div class="col-12 col-md-6">

                    <label class="form-label">
                      Categoría
                    </label>

                    <select
                      class="form-select"
                      id="gastoCategoria"
                      required
                    >
                      ${categoriasOptions}
                    </select>

                  </div>


                  <div class="col-12 col-md-6">

                    <label class="form-label">
                      Proveedor
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      id="gastoProveedor"
                      required
                    >

                  </div>


                  <div class="col-12">

                    <label class="form-label">
                      Concepto
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      id="gastoConcepto"
                      required
                    >

                  </div>


                  <div class="col-12 col-md-4">

                    <label class="form-label">
                      Monto
                    </label>

                    <input
                      type="number"
                      class="form-control"
                      id="gastoMonto"
                      min="0"
                      step="0.01"
                      required
                    >

                  </div>


                  <div class="col-12 col-md-4">

                    <label class="form-label">
                      Método de Pago
                    </label>

                    <select
                      class="form-select"
                      id="gastoMetodoPago"
                      required
                    >
                      <option value="Efectivo">
                        Efectivo
                      </option>
                      <option value="Tarjeta">
                        Tarjeta
                      </option>
                      <option value="Transferencia">
                        Transferencia
                      </option>
                      <option value="Cheque">
                        Cheque
                      </option>
                    </select>

                  </div>


                  <div class="col-12 col-md-4">

                    <label class="form-label">
                      Estado
                    </label>

                    <select
                      class="form-select"
                      id="gastoEstado"
                      required
                    >
                      <option value="Pendiente">
                        Pendiente
                      </option>
                      <option value="Pagado">
                        Pagado
                      </option>
                      <option value="Cancelado">
                        Cancelado
                      </option>
                    </select>

                  </div>

                </div>

              </form>

            </div>


            <div class="modal-footer">

              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="btn btn-danger"
                id="btnGuardarGasto"
              >
                <i class="bi bi-check-circle me-2"></i>
                Guardar
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  `;
}


// ======================================================
// TABLA
// ======================================================

function renderTablaGastos(gastos) {
  if (!gastos || gastos.length === 0) {
    return `
      <tr>
        <td
          colspan="8"
          class="text-center text-muted py-4"
        >
          No hay gastos registrados
        </td>
      </tr>
    `;
  }

  return gastos
    .map(gasto => {
      const estadoColor =
        gasto.estado === 'Pagado'
          ? 'success'
          : gasto.estado === 'Pendiente'
            ? 'warning'
            : 'danger';

      return `
        <tr>

          <td>
            <span class="fw-bold text-danger">
              ${gasto.numero}
            </span>
          </td>

          <td>
            ${gasto.fecha}
          </td>

          <td>
            <span class="badge bg-secondary-subtle">
              ${gasto.categoria}
            </span>
          </td>

          <td>
            ${gasto.concepto}
          </td>

          <td>
            ${gasto.proveedor}
          </td>

          <td class="fw-bold text-danger">
            $${Number(gasto.monto).toLocaleString(
              'es-CO',
              { minimumFractionDigits: 0 }
            )}
          </td>

          <td>
            <span
              class="badge bg-${estadoColor}-subtle"
            >
              ${gasto.estado}
            </span>
          </td>

          <td>

            <button
              class="btn btn-sm btn-outline-primary me-1 btn-editar-gasto"
              data-id="${gasto.id}"
            >
              <i class="bi bi-pencil"></i>
            </button>

            <button
              class="btn btn-sm btn-outline-danger btn-eliminar-gasto"
              data-id="${gasto.id}"
            >
              <i class="bi bi-trash"></i>
            </button>

          </td>

        </tr>
      `;
    })
    .join('');
}


// ======================================================
// ESTADÍSTICAS
// ======================================================

function calcularEstadisticas(gastos) {
  const totalGastos = gastos.length;

  const montoTotal = gastos.reduce(
    (total, gasto) =>
      total + Number(gasto.monto || 0),
    0
  );

  const montoPagado = gastos
    .filter(
      gasto => gasto.estado === 'Pagado'
    )
    .reduce(
      (total, gasto) =>
        total + Number(gasto.monto || 0),
      0
    );

  const montoPendiente = gastos
    .filter(
      gasto => gasto.estado === 'Pendiente'
    )
    .reduce(
      (total, gasto) =>
        total + Number(gasto.monto || 0),
      0
    );

  return {
    totalGastos,
    montoTotal,
    montoPagado,
    montoPendiente
  };
}


// ======================================================
// FILTROS
// ======================================================

async function aplicarFiltros() {
  try {
    const busqueda =
      document
        .getElementById('buscarGasto')
        ?.value
        .trim()
        .toLowerCase() || '';

    const estado =
      document.getElementById(
        'filtroEstadoGasto'
      )?.value || '';

    const categoria =
      document.getElementById(
        'filtroCategoria'
      )?.value || '';

    const gastos =
      await gastosService.getAll();

    const gastosFiltrados =
      gastos.filter(gasto => {
        const coincideBusqueda =
          !busqueda ||
          gasto.concepto
            .toLowerCase()
            .includes(busqueda) ||
          gasto.proveedor
            .toLowerCase()
            .includes(busqueda) ||
          gasto.numero
            .toLowerCase()
            .includes(busqueda);

        const coincideEstado =
          !estado ||
          gasto.estado === estado;

        const coincideCategoria =
          !categoria ||
          gasto.categoria === categoria;

        return (
          coincideBusqueda &&
          coincideEstado &&
          coincideCategoria
        );
      });

    const tbody =
      document.getElementById(
        'tablaGastosBody'
      );

    if (tbody) {
      tbody.innerHTML =
        renderTablaGastos(
          gastosFiltrados
        );

      adjuntarEventosTabla();
    }

  } catch (error) {
    showToast(
      '❌ Error al cargar los gastos: ' +
      error.message,
      'error'
    );
  }
}


// ======================================================
// ACTUALIZAR KPIs
// ======================================================

async function actualizarEstadisticas() {
  try {
    const gastos =
      await gastosService.getAll();

    const estadisticas =
      calcularEstadisticas(gastos);

    const cards =
      document.querySelectorAll(
        '.row.g-3.mb-4 .kpi-card .kpi-value'
      );

    if (cards.length === 4) {

      cards[0].textContent =
        estadisticas.totalGastos;

      cards[1].textContent =
        '$' +
        estadisticas.montoTotal.toLocaleString(
          'es-CO',
          { minimumFractionDigits: 0 }
        );

      cards[2].textContent =
        '$' +
        estadisticas.montoPagado.toLocaleString(
          'es-CO',
          { minimumFractionDigits: 0 }
        );

      cards[3].textContent =
        '$' +
        estadisticas.montoPendiente.toLocaleString(
          'es-CO',
          { minimumFractionDigits: 0 }
        );
    }

  } catch (error) {
    console.error(
      'Error actualizando estadísticas de gastos:',
      error
    );
  }
}


// ======================================================
// EVENTOS DE TABLA
// ======================================================

function adjuntarEventosTabla() {

  // EDITAR
  document
    .querySelectorAll(
      '.btn-editar-gasto'
    )
    .forEach(btn => {

      btn.addEventListener(
        'click',
        async () => {

          try {
            const id =
              parseInt(
                btn.dataset.id
              );

            const gasto =
              await gastosService.getById(
                id
              );

            if (!gasto) {
              showToast(
                '❌ No se encontró el gasto',
                'error'
              );
              return;
            }

            document.getElementById(
              'modalTituloGasto'
            ).textContent =
              'Editar Gasto';

            document.getElementById(
              'gastoId'
            ).value =
              gasto.id;

            document.getElementById(
              'gastoCategoria'
            ).value =
              gasto.categoria;

            document.getElementById(
              'gastoProveedor'
            ).value =
              gasto.proveedor;

            document.getElementById(
              'gastoConcepto'
            ).value =
              gasto.concepto;

            document.getElementById(
              'gastoMonto'
            ).value =
              gasto.monto;

            document.getElementById(
              'gastoMetodoPago'
            ).value =
              gasto.metodoPago;

            document.getElementById(
              'gastoEstado'
            ).value =
              gasto.estado;

            if (!modalGastoInstance) {
              modalGastoInstance =
                new bootstrap.Modal(
                  document.getElementById(
                    'modalGasto'
                  )
                );
            }

            modalGastoInstance.show();

          } catch (error) {
            showToast(
              '❌ Error al cargar el gasto: ' +
              error.message,
              'error'
            );
          }
        }
      );

    });


  // ELIMINAR
  document
    .querySelectorAll(
      '.btn-eliminar-gasto'
    )
    .forEach(btn => {

      btn.addEventListener(
        'click',
        async () => {

          try {
            const id =
              parseInt(
                btn.dataset.id
              );

            const ok =
              await showConfirm(
                '¿Estás seguro de eliminar este gasto?'
              );

            if (!ok) {
              return;
            }

            await gastosService.delete(
              id
            );

            await aplicarFiltros();
            await actualizarEstadisticas();

            showToast(
              '✅ Gasto eliminado correctamente',
              'success'
            );

          } catch (error) {
            showToast(
              '❌ Error al eliminar el gasto: ' +
              error.message,
              'error'
            );
          }
        }
      );

    });
}


// ======================================================
// EVENTOS PRINCIPALES
// ======================================================

export function initGastosEvents() {

  // NUEVO
  const btnNuevo =
    document.getElementById(
      'btnNuevoGasto'
    );

  if (btnNuevo) {
    btnNuevo.addEventListener(
      'click',
      () => {

        document.getElementById(
          'modalTituloGasto'
        ).textContent =
          'Nuevo Gasto';

        document.getElementById(
          'formGasto'
        ).reset();

        document.getElementById(
          'gastoId'
        ).value = '';

        if (!modalGastoInstance) {
          modalGastoInstance =
            new bootstrap.Modal(
              document.getElementById(
                'modalGasto'
              )
            );
        }

        modalGastoInstance.show();
      }
    );
  }


  // GUARDAR / EDITAR
  const btnGuardar =
    document.getElementById(
      'btnGuardarGasto'
    );

  if (btnGuardar) {
    btnGuardar.addEventListener(
      'click',
      async () => {

        try {
          const id =
            document.getElementById(
              'gastoId'
            ).value;

          const monto =
            parseFloat(
              document.getElementById(
                'gastoMonto'
              ).value
            );

          const proveedor =
            document.getElementById(
              'gastoProveedor'
            ).value.trim();

          const concepto =
            document.getElementById(
              'gastoConcepto'
            ).value.trim();


          // VALIDACIONES
          if (!proveedor || !concepto) {
            showToast(
              '⚠️ Debes completar todos los campos',
              'warning'
            );
            return;
          }

          if (
            Number.isNaN(monto) ||
            monto <= 0
          ) {
            showToast(
              '⚠️ El monto debe ser mayor a cero',
              'error'
            );
            return;
          }


          const datos = {
            categoria:
              document.getElementById(
                'gastoCategoria'
              ).value,

            proveedor,

            concepto,

            monto,

            metodoPago:
              document.getElementById(
                'gastoMetodoPago'
              ).value,

            estado:
              document.getElementById(
                'gastoEstado'
              ).value
          };


          if (id) {
            await gastosService.update(
              parseInt(id),
              datos
            );
          } else {
            await gastosService.create(
              datos
            );
          }


          if (modalGastoInstance) {
            modalGastoInstance.hide();
          }


          await aplicarFiltros();
          await actualizarEstadisticas();


          showToast(
            id
              ? '✅ Gasto actualizado correctamente'
              : '✅ Gasto creado correctamente',
            'success'
          );

        } catch (error) {
          showToast(
            '❌ Error al guardar el gasto: ' +
            error.message,
            'error'
          );
        }
      }
    );
  }


  // BUSCADOR
  const buscarInput =
    document.getElementById(
      'buscarGasto'
    );

  if (buscarInput) {
    buscarInput.addEventListener(
      'input',
      aplicarFiltros
    );
  }


  // FILTRO ESTADO
  const filtroEstado =
    document.getElementById(
      'filtroEstadoGasto'
    );

  if (filtroEstado) {
    filtroEstado.addEventListener(
      'change',
      aplicarFiltros
    );
  }


  // FILTRO CATEGORÍA
  const filtroCategoria =
    document.getElementById(
      'filtroCategoria'
    );

  if (filtroCategoria) {
    filtroCategoria.addEventListener(
      'change',
      aplicarFiltros
    );
  }


  // LIMPIAR
  const btnLimpiar =
    document.getElementById(
      'btnLimpiarGastos'
    );

  if (btnLimpiar) {
    btnLimpiar.addEventListener(
      'click',
      async () => {

        document.getElementById(
          'buscarGasto'
        ).value = '';

        document.getElementById(
          'filtroEstadoGasto'
        ).value = '';

        document.getElementById(
          'filtroCategoria'
        ).value = '';

        await aplicarFiltros();

        showToast(
          'Filtros limpiados',
          'info'
        );
      }
    );
  }


  // EDITAR / ELIMINAR
  adjuntarEventosTabla();
}