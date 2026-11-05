// src/js/pages/GastosPage.js
import { gastosService } from '../services/gastos.service.js';
import * as bootstrap from 'bootstrap';

// Variable para mantener el modal entre re-renderizados
let modalGastoInstance = null;

export function renderGastosPage() {
  const gastos = gastosService.getAll();
  const estadisticas = gastosService.getEstadisticas();
  const categorias = gastosService.getCategorias();

  const gastosRows = renderTablaGastos(gastos);
  const categoriasOptions = categorias.map(c => `<option value="${c}">${c}</option>`).join('');

  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Gestión de Gastos</h2>
          <p class="text-muted mb-0 small">Administra los egresos y gastos del sistema</p>
        </div>
        <button class="btn btn-danger" id="btnNuevoGasto">
          <i class="bi bi-plus-circle me-2"></i>Nuevo Gasto
        </button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Total Gastos</h6>
              <h3 class="fw-bold mb-0">${estadisticas.totalGastos}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Monto Total</h6>
              <h3 class="fw-bold mb-0 text-danger">$${estadisticas.montoTotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Pagado</h6>
              <h3 class="fw-bold mb-0 text-success">$${estadisticas.montoPagado.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Pendiente</h6>
              <h3 class="fw-bold mb-0 text-warning">$${estadisticas.montoPendiente.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-5">
              <input type="text" class="form-control" id="buscarGasto" placeholder="🔍 Buscar por concepto, proveedor o número...">
            </div>
            <div class="col-12 col-md-3">
              <select class="form-select" id="filtroEstadoGasto">
                <option value="">Todos los estados</option>
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <select class="form-select" id="filtroCategoria">
                <option value="">Todas las categorías</option>
                ${categoriasOptions}
              </select>
            </div>
            <div class="col-12 col-md-2">
              <button class="btn btn-outline-secondary w-100" id="btnLimpiarGastos">
                <i class="bi bi-x-circle"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
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

      <div id="modalGasto" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title fw-bold" id="modalTituloGasto">Nuevo Gasto</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formGasto">
                <input type="hidden" id="gastoId">
                <div class="row g-3">
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Categoría</label>
                    <select class="form-select" id="gastoCategoria" required>
                      <option value="Servicios Públicos">Servicios Públicos</option>
                      <option value="Insumos">Insumos</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Nómina">Nómina</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Proveedor</label>
                    <input type="text" class="form-control" id="gastoProveedor" required>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-bold">Concepto</label>
                    <input type="text" class="form-control" id="gastoConcepto" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Monto</label>
                    <input type="number" class="form-control" id="gastoMonto" min="0" step="0.01" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Método de Pago</label>
                    <select class="form-select" id="gastoMetodoPago" required>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Estado</label>
                    <select class="form-select" id="gastoEstado" required>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" id="btnGuardarGasto">
                <i class="bi bi-check-circle me-2"></i>Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTablaGastos(gastos) {
  return gastos.map(g => {
    const estadoColor = g.estado === 'Pagado' ? 'success' : g.estado === 'Pendiente' ? 'warning' : 'danger';
    return `
      <tr>
        <td><span class="fw-bold text-danger">${g.numero}</span></td>
        <td>${g.fecha}</td>
        <td><span class="badge bg-secondary-subtle text-secondary">${g.categoria}</span></td>
        <td>${g.concepto}</td>
        <td>${g.proveedor}</td>
        <td class="fw-bold text-danger">$${g.monto.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
        <td><span class="badge bg-${estadoColor}-subtle text-${estadoColor}">${g.estado}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1 btn-editar-gasto" data-id="${g.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar-gasto" data-id="${g.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function aplicarFiltros() {
  const busqueda = document.getElementById('buscarGasto')?.value || '';
  const estado = document.getElementById('filtroEstadoGasto')?.value || '';
  const categoria = document.getElementById('filtroCategoria')?.value || '';

  const filtros = {};
  if (busqueda) filtros.busqueda = busqueda;
  if (estado) filtros.estado = estado;
  if (categoria) filtros.categoria = categoria;

  const gastosFiltrados = gastosService.getAll(filtros);
  const tbody = document.getElementById('tablaGastosBody');
  if (tbody) {
    tbody.innerHTML = renderTablaGastos(gastosFiltrados);
    adjuntarEventosTabla();
  }
}

function adjuntarEventosTabla() {
  document.querySelectorAll('.btn-editar-gasto').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const gasto = gastosService.getById(id);
      if (gasto) {
        document.getElementById('modalTituloGasto').textContent = 'Editar Gasto';
        document.getElementById('gastoId').value = gasto.id;
        document.getElementById('gastoCategoria').value = gasto.categoria;
        document.getElementById('gastoProveedor').value = gasto.proveedor;
        document.getElementById('gastoConcepto').value = gasto.concepto;
        document.getElementById('gastoMonto').value = gasto.monto;
        document.getElementById('gastoMetodoPago').value = gasto.metodoPago;
        document.getElementById('gastoEstado').value = gasto.estado;
        if (!modalGastoInstance) {
          modalGastoInstance = new bootstrap.Modal(document.getElementById('modalGasto'));
        }
        modalGastoInstance.show();
      }
    });
  });

  document.querySelectorAll('.btn-eliminar-gasto').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (confirm('¿Estás seguro de eliminar este gasto?')) {
        gastosService.delete(id);
        aplicarFiltros();
        actualizarEstadisticas();
      }
    });
  });
}

function actualizarEstadisticas() {
  const estadisticas = gastosService.getEstadisticas();
  const cards = document.querySelectorAll('.row.g-3.mb-4 .card-body h3');
  if (cards.length === 4) {
    cards[0].textContent = estadisticas.totalGastos;
    cards[1].textContent = '$' + estadisticas.montoTotal.toLocaleString('es-CO', { minimumFractionDigits: 2 });
    cards[2].textContent = '$' + estadisticas.montoPagado.toLocaleString('es-CO', { minimumFractionDigits: 2 });
    cards[3].textContent = '$' + estadisticas.montoPendiente.toLocaleString('es-CO', { minimumFractionDigits: 2 });
  }
}

export function initGastosEvents() {
  const btnNuevo = document.getElementById('btnNuevoGasto');
  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
      document.getElementById('modalTituloGasto').textContent = 'Nuevo Gasto';
      document.getElementById('formGasto').reset();
      document.getElementById('gastoId').value = '';
      if (!modalGastoInstance) {
        modalGastoInstance = new bootstrap.Modal(document.getElementById('modalGasto'));
      }
      modalGastoInstance.show();
    });
  }

  const btnGuardar = document.getElementById('btnGuardarGasto');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
      const id = document.getElementById('gastoId').value;
      const datos = {
        categoria: document.getElementById('gastoCategoria').value,
        proveedor: document.getElementById('gastoProveedor').value,
        concepto: document.getElementById('gastoConcepto').value,
        monto: parseFloat(document.getElementById('gastoMonto').value),
        metodoPago: document.getElementById('gastoMetodoPago').value,
        estado: document.getElementById('gastoEstado').value,
      };

      if (id) {
        gastosService.update(parseInt(id), datos);
      } else {
        gastosService.create(datos);
      }

      if (modalGastoInstance) {
        modalGastoInstance.hide();
      }
      
      aplicarFiltros();
      actualizarEstadisticas();
    });
  }

  adjuntarEventosTabla();

  const buscarInput = document.getElementById('buscarGasto');
  if (buscarInput) {
    buscarInput.addEventListener('input', aplicarFiltros);
  }

  const filtroEstado = document.getElementById('filtroEstadoGasto');
  if (filtroEstado) {
    filtroEstado.addEventListener('change', aplicarFiltros);
  }

  const filtroCategoria = document.getElementById('filtroCategoria');
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', aplicarFiltros);
  }

  const btnLimpiar = document.getElementById('btnLimpiarGastos');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      document.getElementById('buscarGasto').value = '';
      document.getElementById('filtroEstadoGasto').value = '';
      document.getElementById('filtroCategoria').value = '';
      aplicarFiltros();
    });
  }
}