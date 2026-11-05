// src/js/pages/VentasPage.js
import { ventasService } from '../services/ventas.service.js';

export function renderVentasPage() {
  const ventas = ventasService.getAll();
  const estadisticas = ventasService.getEstadisticas();

  const ventasRows = ventas.map(v => {
    const estadoColor = v.estado === 'Completada' ? 'success' : v.estado === 'Pendiente' ? 'warning' : 'danger';
    return `
      <tr>
        <td><span class="fw-bold text-primary">${v.numero}</span></td>
        <td>${v.fecha}</td>
        <td>${v.cliente}</td>
        <td>${v.producto}</td>
        <td class="text-center">${v.cantidad}</td>
        <td class="fw-bold">$${v.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
        <td><span class="badge bg-${estadoColor}-subtle text-${estadoColor}">${v.estado}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1 btn-editar" data-id="${v.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${v.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="container-fluid">
      <!-- Encabezado -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Gestión de Ventas</h2>
          <p class="text-muted mb-0 small">Administra las facturas y ventas del sistema</p>
        </div>
        <button class="btn btn-primary" id="btnNuevaVenta">
          <i class="bi bi-plus-circle me-2"></i>Nueva Venta
        </button>
      </div>

      <!-- Tarjetas de estadísticas -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Total Ventas</h6>
              <h3 class="fw-bold mb-0">${estadisticas.totalVentas}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Monto Total</h6>
              <h3 class="fw-bold mb-0 text-success">$${estadisticas.montoTotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Completadas</h6>
              <h3 class="fw-bold mb-0 text-primary">${estadisticas.completadas}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Pendientes</h6>
              <h3 class="fw-bold mb-0 text-warning">${estadisticas.pendientes}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <input type="text" class="form-control" id="buscarVenta" placeholder="🔍 Buscar por cliente o número de factura...">
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
              <button class="btn btn-outline-secondary w-100" id="btnLimpiarFiltros">
                <i class="bi bi-x-circle"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de ventas -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
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
              <tbody>
                ${ventasRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal para crear/editar venta (oculto por defecto) -->
      <div id="modalVenta" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold" id="modalTitulo">Nueva Venta</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formVenta">
                <input type="hidden" id="ventaId">
                <div class="row g-3">
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Cliente</label>
                    <input type="text" class="form-control" id="ventaCliente" required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Producto</label>
                    <input type="text" class="form-control" id="ventaProducto" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Cantidad</label>
                    <input type="number" class="form-control" id="ventaCantidad" min="1" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Precio Unitario</label>
                    <input type="number" class="form-control" id="ventaPrecio" min="0" step="0.01" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Total</label>
                    <input type="text" class="form-control" id="ventaTotal" readonly>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Método de Pago</label>
                    <select class="form-select" id="ventaMetodoPago" required>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Crédito">Crédito</option>
                    </select>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Estado</label>
                    <select class="form-select" id="ventaEstado" required>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Completada">Completada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnGuardarVenta">
                <i class="bi bi-check-circle me-2"></i>Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initVentasEvents() {
  // Evento: Botón Nueva Venta
  const btnNueva = document.getElementById('btnNuevaVenta');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => {
      document.getElementById('modalTitulo').textContent = 'Nueva Venta';
      document.getElementById('formVenta').reset();
      document.getElementById('ventaId').value = '';
      document.getElementById('ventaTotal').value = '$0.00';
      const modal = new bootstrap.Modal(document.getElementById('modalVenta'));
      modal.show();
    });
  }

  // Evento: Calcular total automáticamente
  const cantidadInput = document.getElementById('ventaCantidad');
  const precioInput = document.getElementById('ventaPrecio');
  const totalInput = document.getElementById('ventaTotal');

  function calcularTotal() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const precio = parseFloat(precioInput.value) || 0;
    totalInput.value = '$' + (cantidad * precio).toLocaleString('es-CO', { minimumFractionDigits: 2 });
  }

  if (cantidadInput && precioInput) {
    cantidadInput.addEventListener('input', calcularTotal);
    precioInput.addEventListener('input', calcularTotal);
  }

  // Evento: Guardar venta
  const btnGuardar = document.getElementById('btnGuardarVenta');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
      const id = document.getElementById('ventaId').value;
      const datos = {
        cliente: document.getElementById('ventaCliente').value,
        producto: document.getElementById('ventaProducto').value,
        cantidad: parseInt(document.getElementById('ventaCantidad').value),
        precioUnitario: parseFloat(document.getElementById('ventaPrecio').value),
        metodoPago: document.getElementById('ventaMetodoPago').value,
        estado: document.getElementById('ventaEstado').value,
      };

      if (id) {
        ventasService.update(parseInt(id), datos);
      } else {
        ventasService.create(datos);
      }

      // Cerrar modal y recargar
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalVenta'));
      modal.hide();
      window.location.hash = '#ventas';
      window.location.reload();
    });
  }

  // Evento: Botones de editar
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const venta = ventasService.getById(id);
      if (venta) {
        document.getElementById('modalTitulo').textContent = 'Editar Venta';
        document.getElementById('ventaId').value = venta.id;
        document.getElementById('ventaCliente').value = venta.cliente;
        document.getElementById('ventaProducto').value = venta.producto;
        document.getElementById('ventaCantidad').value = venta.cantidad;
        document.getElementById('ventaPrecio').value = venta.precioUnitario;
        document.getElementById('ventaTotal').value = '$' + venta.total.toLocaleString('es-CO', { minimumFractionDigits: 2 });
        document.getElementById('ventaMetodoPago').value = venta.metodoPago;
        document.getElementById('ventaEstado').value = venta.estado;
        const modal = new bootstrap.Modal(document.getElementById('modalVenta'));
        modal.show();
      }
    });
  });

  // Evento: Botones de eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (confirm('¿Estás seguro de eliminar esta venta?')) {
        ventasService.delete(id);
        window.location.hash = '#ventas';
        window.location.reload();
      }
    });
  });

  // Evento: Búsqueda
  const buscarInput = document.getElementById('buscarVenta');
  if (buscarInput) {
    buscarInput.addEventListener('input', (e) => {
      const busqueda = e.target.value;
      const estado = document.getElementById('filtroEstado').value;
      const ventas = ventasService.getAll({ busqueda, estado: estado || undefined });
      // Aquí podrías re-renderizar la tabla, pero por simplicidad recargamos
      console.log('Buscando:', busqueda, 'Estado:', estado);
    });
  }

  // Evento: Filtro de estado
  const filtroEstado = document.getElementById('filtroEstado');
  if (filtroEstado) {
    filtroEstado.addEventListener('change', () => {
      window.location.hash = '#ventas';
      window.location.reload();
    });
  }

  // Evento: Limpiar filtros
  const btnLimpiar = document.getElementById('btnLimpiarFiltros');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      document.getElementById('buscarVenta').value = '';
      document.getElementById('filtroEstado').value = '';
      window.location.hash = '#ventas';
      window.location.reload();
    });
  }
}