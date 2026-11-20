// src/js/pages/VentasPage.js
import { ventasService } from '../services/ventas.service.js';
import * as bootstrap from 'bootstrap';
import { showToast, showConfirm } from '../utils/toast.js';

let modalVentaInstance = null;


// ======================================================
// RENDER PRINCIPAL
// ======================================================

export async function renderVentasPage() {
  const ventas = await ventasService.getAll();
  const estadisticas = calcularEstadisticas(ventas);

  const ventasRows = renderTablaVentas(ventas);

  return `
    <div class="container-fluid">

      <div class="page-header d-flex justify-content-between align-items-start mb-4">
        <div>
          <div class="page-subtitle">GESTIÓN COMERCIAL</div>
          <h2>Ventas</h2>
          <p class="page-description">
            Administra las facturas y ventas del sistema.
          </p>
        </div>

        <button class="btn btn-primary" id="btnNuevaVenta">
          <i class="bi bi-plus-circle me-2"></i>
          Nueva Venta
        </button>
      </div>


      <!-- KPIs -->
      <div class="row g-3 mb-4">

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Total Ventas</div>
            <div class="kpi-value">${estadisticas.totalVentas}</div>
            <div class="kpi-trend up">Facturas registradas</div>
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
            <div class="kpi-trend up">Ingresos acumulados</div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Completadas</div>
            <div class="kpi-value">${estadisticas.completadas}</div>
            <div class="kpi-trend up">Ventas finalizadas</div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Pendientes</div>
            <div class="kpi-value">${estadisticas.pendientes}</div>
            <div class="kpi-trend down">Por cobrar</div>
          </div>
        </div>

      </div>


      <!-- FILTROS -->
      <div class="card mb-4">
        <div class="card-body">

          <div class="row g-3">

            <div class="col-12 col-md-6">
              <input
                type="text"
                class="form-control"
                id="buscarVenta"
                placeholder="🔍 Buscar por cliente o número de factura..."
              >
            </div>

            <div class="col-12 col-md-4">
              <select class="form-select" id="filtroEstado">
                <option value="">Todos los estados</option>
                <option value="Completada">Completada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <div class="col-12 col-md-2">
              <button
                class="btn btn-outline-secondary w-100"
                id="btnLimpiarFiltros"
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
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th class="text-center">Cant.</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody id="tablaVentasBody">
                ${ventasRows}
              </tbody>

            </table>

          </div>

        </div>
      </div>


      <!-- MODAL -->
      <div id="modalVenta" class="modal fade" tabindex="-1">

        <div class="modal-dialog modal-lg">

          <div class="modal-content">

            <div class="modal-header">
              <h5 class="modal-title fw-bold" id="modalTitulo">
                Nueva Venta
              </h5>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>


            <div class="modal-body">

              <form id="formVenta">

                <input type="hidden" id="ventaId">

                <div class="row g-3">

                  <div class="col-12 col-md-6">
                    <label class="form-label">Cliente</label>
                    <input
                      type="text"
                      class="form-control"
                      id="ventaCliente"
                      required
                    >
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Producto</label>
                    <input
                      type="text"
                      class="form-control"
                      id="ventaProducto"
                      required
                    >
                  </div>

                  <div class="col-12 col-md-4">
                    <label class="form-label">Cantidad</label>
                    <input
                      type="number"
                      class="form-control"
                      id="ventaCantidad"
                      min="1"
                      required
                    >
                  </div>

                  <div class="col-12 col-md-4">
                    <label class="form-label">Precio Unitario</label>
                    <input
                      type="number"
                      class="form-control"
                      id="ventaPrecio"
                      min="0"
                      step="0.01"
                      required
                    >
                  </div>

                  <div class="col-12 col-md-4">
                    <label class="form-label">Total</label>
                    <input
                      type="text"
                      class="form-control"
                      id="ventaTotal"
                      readonly
                    >
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Método de Pago</label>

                    <select
                      class="form-select"
                      id="ventaMetodoPago"
                      required
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Crédito">Crédito</option>
                    </select>
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label">Estado</label>

                    <select
                      class="form-select"
                      id="ventaEstado"
                      required
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Completada">Completada</option>
                      <option value="Cancelada">Cancelada</option>
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
                class="btn btn-primary"
                id="btnGuardarVenta"
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

function renderTablaVentas(ventas) {
  if (!ventas || ventas.length === 0) {
    return `
      <tr>
        <td colspan="8" class="text-center text-muted py-4">
          No hay ventas registradas
        </td>
      </tr>
    `;
  }

  return ventas.map((venta) => {
    const estadoColor =
      venta.estado === 'Completada'
        ? 'success'
        : venta.estado === 'Pendiente'
          ? 'warning'
          : 'danger';

    return `
      <tr>

        <td>
          <span class="fw-bold text-primary">
            ${venta.numero}
          </span>
        </td>

        <td>${venta.fecha}</td>

        <td>${venta.cliente}</td>

        <td>${venta.producto}</td>

        <td class="text-center">
          ${venta.cantidad}
        </td>

        <td class="fw-bold">
          $${Number(venta.total).toLocaleString(
            'es-CO',
            { minimumFractionDigits: 0 }
          )}
        </td>

        <td>
          <span class="badge bg-${estadoColor}-subtle">
            ${venta.estado}
          </span>
        </td>

        <td>

          <button
            class="btn btn-sm btn-outline-primary me-1 btn-editar"
            data-id="${venta.id}"
          >
            <i class="bi bi-pencil"></i>
          </button>

          <button
            class="btn btn-sm btn-outline-danger btn-eliminar"
            data-id="${venta.id}"
          >
            <i class="bi bi-trash"></i>
          </button>

        </td>

      </tr>
    `;
  }).join('');
}


// ======================================================
// ESTADÍSTICAS
// ======================================================

function calcularEstadisticas(ventas) {
  const totalVentas = ventas.length;

  const montoTotal = ventas.reduce(
    (total, venta) => total + Number(venta.total || 0),
    0
  );

  const completadas = ventas.filter(
    (venta) => venta.estado === 'Completada'
  ).length;

  const pendientes = ventas.filter(
    (venta) => venta.estado === 'Pendiente'
  ).length;

  return {
    totalVentas,
    montoTotal,
    completadas,
    pendientes
  };
}


// ======================================================
// FILTROS
// ======================================================

async function aplicarFiltros() {
  try {
    const busqueda =
      document.getElementById('buscarVenta')?.value
        .trim()
        .toLowerCase() || '';

    const estado =
      document.getElementById('filtroEstado')?.value || '';

    const ventas = await ventasService.getAll();

    const ventasFiltradas = ventas.filter((venta) => {
      const coincideBusqueda =
        !busqueda ||
        venta.cliente.toLowerCase().includes(busqueda) ||
        venta.numero.toLowerCase().includes(busqueda) ||
        venta.producto.toLowerCase().includes(busqueda);

      const coincideEstado =
        !estado ||
        venta.estado === estado;

      return coincideBusqueda && coincideEstado;
    });

    const tbody =
      document.getElementById('tablaVentasBody');

    if (tbody) {
      tbody.innerHTML =
        renderTablaVentas(ventasFiltradas);

      adjuntarEventosTabla();
    }

  } catch (error) {
    showToast(
      '❌ Error al cargar las ventas: ' + error.message,
      'error'
    );
  }
}


// ======================================================
// ACTUALIZAR KPIs
// ======================================================

async function actualizarEstadisticas() {
  try {
    const ventas = await ventasService.getAll();
    const estadisticas = calcularEstadisticas(ventas);

    const cards = document.querySelectorAll(
      '.row.g-3.mb-4 .kpi-card .kpi-value'
    );

    if (cards.length === 4) {
      cards[0].textContent =
        estadisticas.totalVentas;

      cards[1].textContent =
        '$' +
        estadisticas.montoTotal.toLocaleString(
          'es-CO',
          { minimumFractionDigits: 0 }
        );

      cards[2].textContent =
        estadisticas.completadas;

      cards[3].textContent =
        estadisticas.pendientes;
    }

  } catch (error) {
    console.error(
      'Error actualizando estadísticas:',
      error
    );
  }
}


// ======================================================
// EVENTOS DE LA TABLA
// ======================================================

function adjuntarEventosTabla() {

  // EDITAR
  document
    .querySelectorAll('.btn-editar')
    .forEach((btn) => {

      btn.addEventListener('click', async () => {
        try {
          const id =
            parseInt(btn.dataset.id);

          const venta =
            await ventasService.getById(id);

          if (!venta) {
            showToast(
              '❌ No se encontró la venta',
              'error'
            );
            return;
          }

          document.getElementById(
            'modalTitulo'
          ).textContent = 'Editar Venta';

          document.getElementById(
            'ventaId'
          ).value = venta.id;

          document.getElementById(
            'ventaCliente'
          ).value = venta.cliente;

          document.getElementById(
            'ventaProducto'
          ).value = venta.producto;

          document.getElementById(
            'ventaCantidad'
          ).value = venta.cantidad;

          document.getElementById(
            'ventaPrecio'
          ).value = venta.precioUnitario;

          document.getElementById(
            'ventaTotal'
          ).value =
            '$' +
            Number(venta.total).toLocaleString(
              'es-CO',
              { minimumFractionDigits: 2 }
            );

          document.getElementById(
            'ventaMetodoPago'
          ).value = venta.metodoPago;

          document.getElementById(
            'ventaEstado'
          ).value = venta.estado;

          if (!modalVentaInstance) {
            modalVentaInstance =
              new bootstrap.Modal(
                document.getElementById(
                  'modalVenta'
                )
              );
          }

          modalVentaInstance.show();

        } catch (error) {
          showToast(
            '❌ Error al cargar la venta: ' +
            error.message,
            'error'
          );
        }
      });

    });


  // ELIMINAR
  document
    .querySelectorAll('.btn-eliminar')
    .forEach((btn) => {

      btn.addEventListener('click', async () => {
        try {
          const id =
            parseInt(btn.dataset.id);

          const ok =
            await showConfirm(
              '¿Estás seguro de eliminar esta venta?'
            );

          if (!ok) {
            return;
          }

          await ventasService.delete(id);

          await aplicarFiltros();
          await actualizarEstadisticas();

          showToast(
            '✅ Venta eliminada correctamente',
            'success'
          );

        } catch (error) {
          showToast(
            '❌ Error al eliminar la venta: ' +
            error.message,
            'error'
          );
        }
      });

    });
}


// ======================================================
// EVENTOS PRINCIPALES
// ======================================================

export function initVentasEvents() {

  // NUEVA VENTA
  const btnNueva =
    document.getElementById('btnNuevaVenta');

  if (btnNueva) {
    btnNueva.addEventListener('click', () => {

      document.getElementById(
        'modalTitulo'
      ).textContent = 'Nueva Venta';

      document.getElementById(
        'formVenta'
      ).reset();

      document.getElementById(
        'ventaId'
      ).value = '';

      document.getElementById(
        'ventaTotal'
      ).value = '$0.00';

      if (!modalVentaInstance) {
        modalVentaInstance =
          new bootstrap.Modal(
            document.getElementById(
              'modalVenta'
            )
          );
      }

      modalVentaInstance.show();
    });
  }


  // CALCULAR TOTAL
  const cantidadInput =
    document.getElementById('ventaCantidad');

  const precioInput =
    document.getElementById('ventaPrecio');

  const totalInput =
    document.getElementById('ventaTotal');

  function calcularTotal() {
    const cantidad =
      parseFloat(cantidadInput?.value) || 0;

    const precio =
      parseFloat(precioInput?.value) || 0;

    if (totalInput) {
      totalInput.value =
        '$' +
        (cantidad * precio).toLocaleString(
          'es-CO',
          { minimumFractionDigits: 2 }
        );
    }
  }

  if (cantidadInput && precioInput) {
    cantidadInput.addEventListener(
      'input',
      calcularTotal
    );

    precioInput.addEventListener(
      'input',
      calcularTotal
    );
  }


  // GUARDAR O EDITAR
  const btnGuardar =
    document.getElementById('btnGuardarVenta');

  if (btnGuardar) {
    btnGuardar.addEventListener(
      'click',
      async () => {

        try {
          const id =
            document.getElementById(
              'ventaId'
            ).value;

          const cantidad =
            parseInt(
              document.getElementById(
                'ventaCantidad'
              ).value
            );

          const precio =
            parseFloat(
              document.getElementById(
                'ventaPrecio'
              ).value
            );

          const cliente =
            document.getElementById(
              'ventaCliente'
            ).value.trim();

          const producto =
            document.getElementById(
              'ventaProducto'
            ).value.trim();


          // VALIDACIONES
          if (!cliente || !producto) {
            showToast(
              '⚠️ Debes completar todos los campos',
              'warning'
            );
            return;
          }

          if (
            Number.isNaN(cantidad) ||
            cantidad <= 0
          ) {
            showToast(
              '⚠️ La cantidad debe ser mayor a cero',
              'error'
            );
            return;
          }

          if (
            Number.isNaN(precio) ||
            precio <= 0
          ) {
            showToast(
              '⚠️ El precio unitario debe ser mayor a cero',
              'error'
            );
            return;
          }


          const datos = {
            cliente,
            producto,
            cantidad,
            precioUnitario: precio,
            metodoPago:
              document.getElementById(
                'ventaMetodoPago'
              ).value,
            estado:
              document.getElementById(
                'ventaEstado'
              ).value
          };


          if (id) {
            await ventasService.update(
              parseInt(id),
              datos
            );
          } else {
            await ventasService.create(
              datos
            );
          }


          if (modalVentaInstance) {
            modalVentaInstance.hide();
          }


          await aplicarFiltros();
          await actualizarEstadisticas();


          showToast(
            id
              ? '✅ Venta actualizada correctamente'
              : '✅ Venta creada correctamente',
            'success'
          );

        } catch (error) {
          showToast(
            '❌ Error al guardar la venta: ' +
            error.message,
            'error'
          );
        }
      }
    );
  }


  // FILTRO DE BÚSQUEDA
  const buscarInput =
    document.getElementById('buscarVenta');

  if (buscarInput) {
    buscarInput.addEventListener(
      'input',
      aplicarFiltros
    );
  }


  // FILTRO ESTADO
  const filtroEstado =
    document.getElementById('filtroEstado');

  if (filtroEstado) {
    filtroEstado.addEventListener(
      'change',
      aplicarFiltros
    );
  }


  // LIMPIAR FILTROS
  const btnLimpiar =
    document.getElementById(
      'btnLimpiarFiltros'
    );

  if (btnLimpiar) {
    btnLimpiar.addEventListener(
      'click',
      async () => {

        document.getElementById(
          'buscarVenta'
        ).value = '';

        document.getElementById(
          'filtroEstado'
        ).value = '';

        await aplicarFiltros();

        showToast(
          'Filtros limpiados',
          'info'
        );
      }
    );
  }


  // EVENTOS DE EDITAR Y ELIMINAR
  adjuntarEventosTabla();
}