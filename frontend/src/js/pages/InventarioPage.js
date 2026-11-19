// src/js/pages/InventarioPage.js
import { inventarioService } from '../services/inventario.service.js';
import * as bootstrap from 'bootstrap';
import { showToast, showConfirm } from '../utils/toast.js';

let modalProductoInstance = null;

export function renderInventarioPage() {
  const productos = inventarioService.getAll();
  const estadisticas = inventarioService.getEstadisticas();
  const categorias = inventarioService.getCategorias();

  const productosRows = renderTablaProductos(productos);
  const categoriasOptions = categorias.map(c => `<option value="${c}">${c}</option>`).join('');

  return `
    <div class="container-fluid">
      <div class="page-header d-flex justify-content-between align-items-start mb-4">
        <div>
          <div class="page-subtitle">CONTROL DE STOCK</div>
          <h2>Inventario</h2>
          <p class="page-description">Administra los productos y el stock del sistema.</p>
        </div>
        <button class="btn btn-success" id="btnNuevoProducto">
          <i class="bi bi-plus-circle me-2"></i>Nuevo Producto
        </button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Total Productos</div>
            <div class="kpi-value">${estadisticas.total}</div>
            <div class="kpi-trend up">Registrados</div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Disponibles</div>
            <div class="kpi-value">${estadisticas.disponibles}</div>
            <div class="kpi-trend up">En stock</div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Stock Bajo</div>
            <div class="kpi-value">${estadisticas.stockBajo}</div>
            <div class="kpi-trend down">Por reponer</div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">Valor Inventario</div>
            <div class="kpi-value">$${estadisticas.valorInventario.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</div>
            <div class="kpi-trend up">Valor total</div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
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

      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead>
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
            <div class="modal-header">
              <h5 class="modal-title fw-bold" id="modalTitulo">Nuevo Producto</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formProducto">
                <input type="hidden" id="productoId">
                <div class="row g-3">
                  <div class="col-12 col-md-8">
                    <label class="form-label">Nombre del Producto</label>
                    <input type="text" class="form-control" id="productoNombre" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label">Categoría</label>
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
                    <label class="form-label">Precio</label>
                    <input type="number" class="form-control" id="productoPrecio" min="0" step="0.01" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label">Stock Actual</label>
                    <input type="number" class="form-control" id="productoStock" min="0" required>
                  </div>
                  <div class="col-12 col-md-4">
                    <label class="form-label">Stock Mínimo</label>
                    <input type="number" class="form-control" id="productoStockMinimo" min="0" required>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Proveedor</label>
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
  if (productos.length === 0) {
    return '<tr><td colspan="8" class="text-center text-muted py-4">No hay productos registrados</td></tr>';
  }
  return productos.map(p => {
    const estadoColor = p.estado === 'Disponible' ? 'success' : p.estado === 'Stock Bajo' ? 'warning' : 'danger';
    const stockClass = p.estado === 'Stock Bajo' ? 'text-warning fw-bold' : p.estado === 'Agotado' ? 'text-danger fw-bold' : '';
    return `
      <tr>
        <td><span class="fw-bold text-success">${p.codigo}</span></td>
        <td>${p.nombre}</td>
        <td><span class="badge bg-secondary-subtle">${p.categoria}</span></td>
        <td class="fw-bold">$${p.precio.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</td>
        <td class="text-center ${stockClass}">${p.stock}</td>
        <td class="text-center text-muted">${p.stockMinimo}</td>
        <td><span class="badge bg-${estadoColor}-subtle">${p.estado}</span></td>
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
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.id);
      const ok = await showConfirm('¿Estás seguro de eliminar este producto?');
      if (ok) {
        inventarioService.delete(id);
        aplicarFiltros();
        actualizarEstadisticas();
        showToast('Producto eliminado correctamente', 'success');
      }
    });
  });
}

function actualizarEstadisticas() {
  const estadisticas = inventarioService.getEstadisticas();
  const cards = document.querySelectorAll('.row.g-3.mb-4 .kpi-card .kpi-value');
  if (cards.length === 4) {
    cards[0].textContent = estadisticas.total;
    cards[1].textContent = estadisticas.disponibles;
    cards[2].textContent = estadisticas.stockBajo;
    cards[3].textContent = '$' + estadisticas.valorInventario.toLocaleString('es-CO', { minimumFractionDigits: 0 });
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
      const nombre = document.getElementById('productoNombre').value.trim();
      const precio = parseFloat(document.getElementById('productoPrecio').value);
      const stock = parseInt(document.getElementById('productoStock').value);
      const stockMinimo = parseInt(document.getElementById('productoStockMinimo').value);
      const proveedor = document.getElementById('productoProveedor').value.trim();

      // Validaciones
      if (!nombre || !proveedor) {
        showToast('⚠️ Debes completar todos los campos', 'warning');
        return;
      }

      if (isNaN(precio) || precio <= 0) {
        showToast('⚠️ El precio debe ser mayor a cero', 'error');
        return;
      }

      if (isNaN(stock) || stock < 0) {
        showToast('⚠️ El stock actual no puede ser negativo', 'error');
        return;
      }

      if (isNaN(stockMinimo) || stockMinimo < 0) {
        showToast('⚠️ El stock mínimo no puede ser negativo', 'error');
        return;
      }

      const datos = {
        nombre: nombre,
        categoria: document.getElementById('productoCategoria').value,
        precio: precio,
        stock: stock,
        stockMinimo: stockMinimo,
        proveedor: proveedor,
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
      showToast(id ? 'Producto actualizado correctamente' : 'Producto creado correctamente', 'success');
    });
  }

  adjuntarEventosTabla();

  const buscarInput = document.getElementById('buscarProducto');
  if (buscarInput) { buscarInput.addEventListener('input', aplicarFiltros); }

  const filtroEstado = document.getElementById('filtroEstado');
  if (filtroEstado) { filtroEstado.addEventListener('change', aplicarFiltros); }

  const filtroCategoria = document.getElementById('filtroCategoria');
  if (filtroCategoria) { filtroCategoria.addEventListener('change', aplicarFiltros); }

  const btnLimpiar = document.getElementById('btnLimpiar');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      document.getElementById('buscarProducto').value = '';
      document.getElementById('filtroEstado').value = '';
      document.getElementById('filtroCategoria').value = '';
      aplicarFiltros();
      showToast('Filtros limpiados', 'info');
    });
  }
}
