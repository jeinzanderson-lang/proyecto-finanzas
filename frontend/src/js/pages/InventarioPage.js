// src/js/pages/InventarioPage.js
import { inventarioService } from '../services/inventario.service.js';
import { sessionService } from '../auth/session.service.js';
import * as bootstrap from 'bootstrap';
import { showToast, showConfirm } from '../utils/toast.js';

let modalProductoInstance = null;

const categorias = [
  'Computadores',
  'Accesorios',
  'Monitores',
  'Impresoras',
  'Almacenamiento',
  'Mobiliario',
  'Otros'
];


// ======================================================
// RENDER PRINCIPAL
// ======================================================

export async function renderInventarioPage() {
  const productos = await inventarioService.getAll();
  const estadisticas = calcularEstadisticas(productos);

  const usuario = sessionService.getUser();
  const esAdmin = usuario?.role === 'ADMIN';

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
          <div class="page-subtitle">CONTROL DE STOCK</div>
          <h2>Inventario</h2>
          <p class="page-description">
            Administra los productos y el stock del sistema.
          </p>
        </div>

        ${
          esAdmin
            ? `
              <button
                class="btn btn-success"
                id="btnNuevoProducto"
              >
                <i class="bi bi-plus-circle me-2"></i>
                Nuevo Producto
              </button>
            `
            : ''
        }

      </div>


      <!-- KPIs -->
      <div class="row g-3 mb-4">

        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">
              Total Productos
            </div>
            <div class="kpi-value">
              ${estadisticas.total}
            </div>
            <div class="kpi-trend up">
              Registrados
            </div>
          </div>
        </div>


        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">
              Disponibles
            </div>
            <div class="kpi-value">
              ${estadisticas.disponibles}
            </div>
            <div class="kpi-trend up">
              En stock
            </div>
          </div>
        </div>


        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">
              Stock Bajo
            </div>
            <div class="kpi-value">
              ${estadisticas.stockBajo}
            </div>
            <div class="kpi-trend down">
              Por reponer
            </div>
          </div>
        </div>


        <div class="col-12 col-sm-6 col-lg-3">
          <div class="kpi-card">
            <div class="kpi-label">
              Valor Inventario
            </div>
            <div class="kpi-value">
              $${estadisticas.valorInventario.toLocaleString(
                'es-CO',
                { minimumFractionDigits: 0 }
              )}
            </div>
            <div class="kpi-trend up">
              Valor total
            </div>
          </div>
        </div>

      </div>


      <!-- FILTROS -->
      <div class="card mb-4">

        <div class="card-body">

          <div class="row g-3">

            <div class="col-12 col-md-4">
              <input
                type="text"
                class="form-control"
                id="buscarProducto"
                placeholder="🔍 Buscar por nombre, código o proveedor..."
              >
            </div>


            <div class="col-12 col-md-3">

              <select
                class="form-select"
                id="filtroEstado"
              >
                <option value="">
                  Todos los estados
                </option>
                <option value="Disponible">
                  Disponible
                </option>
                <option value="Stock Bajo">
                  Stock Bajo
                </option>
                <option value="Agotado">
                  Agotado
                </option>
              </select>

            </div>


            <div class="col-12 col-md-3">

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
                id="btnLimpiar"
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

            <table
              class="table table-hover mb-0 align-middle"
            >

              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th class="text-center">
                    Stock
                  </th>
                  <th class="text-center">
                    Mín.
                  </th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody id="tablaProductosBody">
                ${renderTablaProductos(
                  productos,
                  esAdmin
                )}
              </tbody>

            </table>

          </div>

        </div>

      </div>


      <!-- MODAL -->
      <div
        id="modalProducto"
        class="modal fade"
        tabindex="-1"
      >

        <div class="modal-dialog modal-lg">

          <div class="modal-content">

            <div class="modal-header">

              <h5
                class="modal-title fw-bold"
                id="modalTitulo"
              >
                Nuevo Producto
              </h5>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>

            </div>


            <div class="modal-body">

              <form id="formProducto">

                <input
                  type="hidden"
                  id="productoId"
                >

                <div class="row g-3">


                  <div class="col-12 col-md-8">

                    <label class="form-label">
                      Nombre del Producto
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      id="productoNombre"
                      required
                    >

                  </div>


                  <div class="col-12 col-md-4">

                    <label class="form-label">
                      Categoría
                    </label>

                    <select
                      class="form-select"
                      id="productoCategoria"
                      required
                    >
                      ${categoriasOptions}
                    </select>

                  </div>


                  <div class="col-12 col-md-4">

                    <label class="form-label">
                      Precio
                    </label>

                    <input
                      type="number"
                      class="form-control"
                      id="productoPrecio"
                      min="0"
                      step="0.01"
                      required
                    >

                  </div>


                  <div class="col-12 col-md-4">

                    <label class="form-label">
                      Stock Actual
                    </label>

                    <input
                      type="number"
                      class="form-control"
                      id="productoStock"
                      min="0"
                      required
                    >

                  </div>


                  <div class="col-12 col-md-4">

                    <label class="form-label">
                      Stock Mínimo
                    </label>

                    <input
                      type="number"
                      class="form-control"
                      id="productoStockMinimo"
                      min="0"
                      required
                    >

                  </div>


                  <div class="col-12">

                    <label class="form-label">
                      Proveedor
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      id="productoProveedor"
                    >

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
                class="btn btn-success"
                id="btnGuardarProducto"
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

function renderTablaProductos(
  productos,
  esAdmin
) {
  if (!productos || productos.length === 0) {
    return `
      <tr>
        <td
          colspan="8"
          class="text-center text-muted py-4"
        >
          No hay productos registrados
        </td>
      </tr>
    `;
  }

  return productos
    .map(producto => {

      const estadoColor =
        producto.estado === 'Disponible'
          ? 'success'
          : producto.estado === 'Stock Bajo'
            ? 'warning'
            : 'danger';

      const stockClass =
        producto.estado === 'Stock Bajo'
          ? 'text-warning fw-bold'
          : producto.estado === 'Agotado'
            ? 'text-danger fw-bold'
            : '';

      return `
        <tr>

          <td>
            <span class="fw-bold text-success">
              ${producto.codigo}
            </span>
          </td>

          <td>
            ${producto.nombre}
          </td>

          <td>
            <span class="badge bg-secondary-subtle">
              ${producto.categoria}
            </span>
          </td>

          <td class="fw-bold">
            $${Number(
              producto.precio
            ).toLocaleString(
              'es-CO',
              { minimumFractionDigits: 0 }
            )}
          </td>

          <td
            class="text-center ${stockClass}"
          >
            ${producto.stock}
          </td>

          <td class="text-center text-muted">
            ${producto.stockMinimo}
          </td>

          <td>
            <span
              class="badge bg-${estadoColor}-subtle"
            >
              ${producto.estado}
            </span>
          </td>

          <td>

            ${
              esAdmin
                ? `
                  <button
                    class="btn btn-sm btn-outline-primary me-1 btn-editar-prod"
                    data-id="${producto.id}"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>

                  <button
                    class="btn btn-sm btn-outline-danger btn-eliminar-prod"
                    data-id="${producto.id}"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                `
                : `
                  <span class="text-muted">
                    Solo lectura
                  </span>
                `
            }

          </td>

        </tr>
      `;
    })
    .join('');
}


// ======================================================
// ESTADÍSTICAS
// ======================================================

function calcularEstadisticas(productos) {
  const total = productos.length;

  const disponibles =
    productos.filter(
      producto =>
        producto.estado === 'Disponible'
    ).length;

  const stockBajo =
    productos.filter(
      producto =>
        producto.estado === 'Stock Bajo'
    ).length;

  const valorInventario =
    productos.reduce(
      (totalValor, producto) =>
        totalValor +
        (
          Number(producto.precio || 0) *
          Number(producto.stock || 0)
        ),
      0
    );

  return {
    total,
    disponibles,
    stockBajo,
    valorInventario
  };
}


// ======================================================
// FILTROS
// ======================================================

async function aplicarFiltros() {
  try {
    const busqueda =
      document
        .getElementById('buscarProducto')
        ?.value
        .trim()
        .toLowerCase() || '';

    const estado =
      document.getElementById(
        'filtroEstado'
      )?.value || '';

    const categoria =
      document.getElementById(
        'filtroCategoria'
      )?.value || '';

    const productos =
      await inventarioService.getAll();

    const usuario =
      sessionService.getUser();

    const esAdmin =
      usuario?.role === 'ADMIN';


    const productosFiltrados =
      productos.filter(producto => {

        const coincideBusqueda =
          !busqueda ||
          producto.nombre
            .toLowerCase()
            .includes(busqueda) ||
          producto.codigo
            .toLowerCase()
            .includes(busqueda) ||
          (producto.proveedor || '')
            .toLowerCase()
            .includes(busqueda);

        const coincideEstado =
          !estado ||
          producto.estado === estado;

        const coincideCategoria =
          !categoria ||
          producto.categoria === categoria;

        return (
          coincideBusqueda &&
          coincideEstado &&
          coincideCategoria
        );
      });


    const tbody =
      document.getElementById(
        'tablaProductosBody'
      );

    if (tbody) {
      tbody.innerHTML =
        renderTablaProductos(
          productosFiltrados,
          esAdmin
        );

      adjuntarEventosTabla();
    }

  } catch (error) {
    showToast(
      '❌ Error al cargar inventario: ' +
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
    const productos =
      await inventarioService.getAll();

    const estadisticas =
      calcularEstadisticas(productos);

    const cards =
      document.querySelectorAll(
        '.row.g-3.mb-4 .kpi-card .kpi-value'
      );

    if (cards.length === 4) {

      cards[0].textContent =
        estadisticas.total;

      cards[1].textContent =
        estadisticas.disponibles;

      cards[2].textContent =
        estadisticas.stockBajo;

      cards[3].textContent =
        '$' +
        estadisticas.valorInventario.toLocaleString(
          'es-CO',
          { minimumFractionDigits: 0 }
        );
    }

  } catch (error) {
    console.error(
      'Error actualizando estadísticas de inventario:',
      error
    );
  }
}


// ======================================================
// EVENTOS TABLA
// ======================================================

function adjuntarEventosTabla() {

  // EDITAR
  document
    .querySelectorAll(
      '.btn-editar-prod'
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

            const producto =
              await inventarioService.getById(
                id
              );

            if (!producto) {
              showToast(
                '❌ Producto no encontrado',
                'error'
              );
              return;
            }


            document.getElementById(
              'modalTitulo'
            ).textContent =
              'Editar Producto';

            document.getElementById(
              'productoId'
            ).value =
              producto.id;

            document.getElementById(
              'productoNombre'
            ).value =
              producto.nombre;

            document.getElementById(
              'productoCategoria'
            ).value =
              producto.categoria;

            document.getElementById(
              'productoPrecio'
            ).value =
              producto.precio;

            document.getElementById(
              'productoStock'
            ).value =
              producto.stock;

            document.getElementById(
              'productoStockMinimo'
            ).value =
              producto.stockMinimo;

            document.getElementById(
              'productoProveedor'
            ).value =
              producto.proveedor || '';


            if (!modalProductoInstance) {
              modalProductoInstance =
                new bootstrap.Modal(
                  document.getElementById(
                    'modalProducto'
                  )
                );
            }

            modalProductoInstance.show();

          } catch (error) {
            showToast(
              '❌ Error al cargar el producto: ' +
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
      '.btn-eliminar-prod'
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
                '¿Estás seguro de eliminar este producto?'
              );

            if (!ok) {
              return;
            }


            await inventarioService.delete(
              id
            );

            await aplicarFiltros();
            await actualizarEstadisticas();


            showToast(
              '✅ Producto eliminado correctamente',
              'success'
            );

          } catch (error) {
            showToast(
              '❌ Error al eliminar el producto: ' +
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

export function initInventarioEvents() {

  const usuario =
    sessionService.getUser();

  const esAdmin =
    usuario?.role === 'ADMIN';


  // NUEVO PRODUCTO
  const btnNuevo =
    document.getElementById(
      'btnNuevoProducto'
    );

  if (btnNuevo && esAdmin) {

    btnNuevo.addEventListener(
      'click',
      () => {

        document.getElementById(
          'modalTitulo'
        ).textContent =
          'Nuevo Producto';

        document.getElementById(
          'formProducto'
        ).reset();

        document.getElementById(
          'productoId'
        ).value = '';


        if (!modalProductoInstance) {
          modalProductoInstance =
            new bootstrap.Modal(
              document.getElementById(
                'modalProducto'
              )
            );
        }

        modalProductoInstance.show();
      }
    );
  }


  // GUARDAR / EDITAR
  const btnGuardar =
    document.getElementById(
      'btnGuardarProducto'
    );

  if (btnGuardar && esAdmin) {

    btnGuardar.addEventListener(
      'click',
      async () => {

        try {
          const id =
            document.getElementById(
              'productoId'
            ).value;

          const nombre =
            document.getElementById(
              'productoNombre'
            ).value.trim();

          const precio =
            parseFloat(
              document.getElementById(
                'productoPrecio'
              ).value
            );

          const stock =
            parseInt(
              document.getElementById(
                'productoStock'
              ).value
            );

          const stockMinimo =
            parseInt(
              document.getElementById(
                'productoStockMinimo'
              ).value
            );

          const proveedor =
            document.getElementById(
              'productoProveedor'
            ).value.trim();


          // VALIDACIONES
          if (!nombre) {
            showToast(
              '⚠️ Debes ingresar el nombre del producto',
              'warning'
            );
            return;
          }

          if (
            Number.isNaN(precio) ||
            precio < 0
          ) {
            showToast(
              '⚠️ El precio no puede ser negativo',
              'error'
            );
            return;
          }

          if (
            Number.isNaN(stock) ||
            stock < 0
          ) {
            showToast(
              '⚠️ El stock no puede ser negativo',
              'error'
            );
            return;
          }

          if (
            Number.isNaN(stockMinimo) ||
            stockMinimo < 0
          ) {
            showToast(
              '⚠️ El stock mínimo no puede ser negativo',
              'error'
            );
            return;
          }


          const datos = {
            nombre,

            categoria:
              document.getElementById(
                'productoCategoria'
              ).value,

            precio,

            stock,

            stockMinimo,

            proveedor
          };


          if (id) {
            await inventarioService.update(
              parseInt(id),
              datos
            );
          } else {
            await inventarioService.create(
              datos
            );
          }


          if (modalProductoInstance) {
            modalProductoInstance.hide();
          }


          await aplicarFiltros();
          await actualizarEstadisticas();


          showToast(
            id
              ? '✅ Producto actualizado correctamente'
              : '✅ Producto creado correctamente',
            'success'
          );

        } catch (error) {
          showToast(
            '❌ Error al guardar el producto: ' +
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
      'buscarProducto'
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
      'filtroEstado'
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
      'btnLimpiar'
    );

  if (btnLimpiar) {

    btnLimpiar.addEventListener(
      'click',
      async () => {

        document.getElementById(
          'buscarProducto'
        ).value = '';

        document.getElementById(
          'filtroEstado'
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