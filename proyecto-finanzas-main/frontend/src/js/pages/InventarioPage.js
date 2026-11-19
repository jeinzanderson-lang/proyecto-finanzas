// src/js/pages/InventarioPage.js
import { inventarioService } from '../services/inventario.service.js';
import * as bootstrap from 'bootstrap';

let modalProductoInstance = null;

export function renderInventarioPage() {
  const productos = inventarioService.getAll();
  const estadisticas = inventarioService.getEstadisticas();
  const categorias = inventarioService.getCategorias();

  const productosRows = renderTablaProductos(productos);
  const categoriasOptions = categorias.map(c => `<option value="${c}">${c}</option>`).join('');

  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Gestión de Inventario</h2>
          <p class="text-muted mb-0 small">Administra los productos y el stock del sistema</p>
        </div>
        <button class="btn btn-success" id="btnNuevoProducto">
          <i class="bi bi-plus-circle me-2"></i>Nuevo Producto
        </button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Total Productos</h6>
              <h3 class="fw-bold mb-0">${estadisticas.total}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Disponibles</h6>
              <h3 class="fw-bold mb-0 text-success">${estadisticas.disponibles}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Stock Bajo</h6>
              <h3 class="fw-bold mb-0 text-warning">${estadisticas.stockBajo}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Valor Inventario</h6>
              <h3 class="fw-bold mb-0 text-primary">$${estadisticas.valorInventario.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <input type="text" class="form-control" id="buscarProducto" placeholder="🔍 Buscar por nombre, código o proveedor...">
            </div>
            <div class="col-12 col-md-3">
              <select class="form-select" id="filtroEstado">
                <option value="">Todos los estados</option>
                <option value="Disponible">Disponible</option>
                <option value="Stock Bajo">Stock Bajo</option>
                <option value="Agotado">Agotado</option>
              </select>
            </div>
            <div class="col-12 col-md-3">
              <select class="form-select" id="filtroCategoria">
                <option value="">Todas las categorías</option>
                ${categoriasOptions}
              </select>
            </div>
            <div class="col-12 col-md-2">
              <button class="btn btn-outline-secondary w-100" id="btnLimpiar">
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
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th class="text-center">Stock</th>
                  <th class="text-center">Mín.</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="tablaProductosBody">
                ${productosRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="modalProducto" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title fw-bold" id="modalTitulo">Nuevo Producto</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formProducto">
                <input type="hidden" id="productoId">
                <div class="row g-3">
                  <div class="col-12 col-md-8">
                    <label class="form-label fw-bold">Nombre del Producto</label>
                    <input type="text" class="form-control" id="productoNombre" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Categoría</label>
                    <select class="form-select" id="productoCategoria" required>
                      <option value="Computadores">Computadores</option>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Monitores">Monitores</option>
                      <option value="Impresoras">Impresoras</option>
                      <option value="Almacenamiento">Almacenamiento</option>
                      <option value="Mobiliario">Mobiliario</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Precio</label>
                    <input type="number" class="form-control" id="productoPrecio" min="0" step="0.01" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Stock Actual</label>
                    <input type="number" class="form-control" id="productoStock" min="0" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold">Stock Mínimo</label>
                    <input type="number" class="form-control" id="productoStockMinimo" min="0" required>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-bold">Proveedor</label>
                    <input type="text" class="form-control" id="productoProveedor" required>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="btnGuardarProducto">
                <i class="bi bi-check-circle me-2"></i>Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTablaProductos(productos) {
  return productos.map(p => {
    const estadoColor = p.estado === 'Disponible' ? 'success' : p.estado === 'Stock Bajo' ? 'warning' : 'danger';
    const stockClass = p.estado === 'Stock Bajo' ? 'text-warning fw-bold' : p.estado === 'Agotado' ? 'text-danger fw-bold' : '';
    return `
      <tr>
        <td><span class="fw-bold text-success">${p.codigo}</span></td>
        <td>${p.nombre}</td>
        <td><span class="badge bg-secondary-subtle text-secondary">${p.categoria}</span></td>
        <td class="fw-bold">$${p.precio.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
        <td class="text-center ${stockClass}">${p.stock}</td>
        <td class="text-center text-muted">${p.stockMinimo}</td>
        <td><span class="badge bg-${estadoColor}-subtle text-${estadoColor}">${p.estado}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1 btn-editar-prod" data-id="${p.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar-prod" data-id="${p.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function aplicarFiltros() {
  const busqueda = document.getElementById('buscarProducto')?.value || '';
  const estado = document.getElementById('filtroEstado')?.value || '';
  const categoria = document.getElementById('filtroCategoria')?.value || '';

  const filtros = {};
  if (busqueda) filtros.busqueda = busqueda;
  if (estado) filtros.estado = estado;
  if (categoria) filtros.categoria = categoria;

  const productosFiltrados = inventarioService.getAll(filtros);
  const tbody = document.getElementById('tablaProductosBody');
  if (tbody) {
    tbody.innerHTML = renderTablaProductos(productosFiltrados);
    adjuntarEventosTabla();
  }
}

function adjuntarEventosTabla() {
  document.querySelectorAll('.btn-editar-prod').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const producto = inventarioService.getById(id);
      if (producto) {
        document.getElementById('modalTitulo').textContent = 'Editar Producto';
        document.getElementById('productoId').value = producto.id;
        document.getElementById('productoNombre').value = producto.nombre;
        document.getElementById('productoCategoria').value = producto.categoria;
        document.getElementById('productoPrecio').value = producto.precio;
        document.getElementById('productoStock').value = producto.stock;
        document.getElementById('productoStockMinimo').value = producto.stockMinimo;
        document.getElementById('productoProveedor').value = producto.proveedor;
        if (!modalProductoInstance) {
          modalProductoInstance = new bootstrap.Modal(document.getElementById('modalProducto'));
        }
        modalProductoInstance.show();
      }
    });
  });

  document.querySelectorAll('.btn-eliminar-prod').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (confirm('¿Estás seguro de eliminar este producto?')) {
        inventarioService.delete(id);
        aplicarFiltros();
        actualizarEstadisticas();
      }
    });
  });
}

function actualizarEstadisticas() {
  const estadisticas = inventarioService.getEstadisticas();
  const cards = document.querySelectorAll('.row.g-3.mb-4 .card-body h3');
  if (cards.length === 4) {
    cards[0].textContent = estadisticas.total;
    cards[1].textContent = estadisticas.disponibles;
    cards[2].textContent = estadisticas.stockBajo;
    cards[3].textContent = '$' + estadisticas.valorInventario.toLocaleString('es-CO', { minimumFractionDigits: 2 });
  }
}

export function initInventarioEvents() {
  const btnNuevo = document.getElementById('btnNuevoProducto');
  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
      document.getElementById('modalTitulo').textContent = 'Nuevo Producto';
      document.getElementById('formProducto').reset();
      document.getElementById('productoId').value = '';
      if (!modalProductoInstance) {
        modalProductoInstance = new bootstrap.Modal(document.getElementById('modalProducto'));
      }
      modalProductoInstance.show();
    });
  }

  const btnGuardar = document.getElementById('btnGuardarProducto');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
      const id = document.getElementById('productoId').value;
      const datos = {
        nombre: document.getElementById('productoNombre').value,
        categoria: document.getElementById('productoCategoria').value,
        precio: parseFloat(document.getElementById('productoPrecio').value),
        stock: parseInt(document.getElementById('productoStock').value),
        stockMinimo: parseInt(document.getElementById('productoStockMinimo').value),
        proveedor: document.getElementById('productoProveedor').value,
      };

      if (id) {
        inventarioService.update(parseInt(id), datos);
      } else {
        inventarioService.create(datos);
      }

      if (modalProductoInstance) {
        modalProductoInstance.hide();
      }

      aplicarFiltros();
      actualizarEstadisticas();
    });
  }

  adjuntarEventosTabla();

  const buscarInput = document.getElementById('buscarProducto');
  if (buscarInput) {
    buscarInput.addEventListener('input', aplicarFiltros);
  }

  const filtroEstado = document.getElementById('filtroEstado');
  if (filtroEstado) {
    filtroEstado.addEventListener('change', aplicarFiltros);
  }

  const filtroCategoria = document.getElementById('filtroCategoria');
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', aplicarFiltros);
  }

  const btnLimpiar = document.getElementById('btnLimpiar');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      document.getElementById('buscarProducto').value = '';
      document.getElementById('filtroEstado').value = '';
      document.getElementById('filtroCategoria').value = '';
      aplicarFiltros();
    });
  }
}