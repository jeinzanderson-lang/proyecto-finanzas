// src/js/pages/ReportesPage.js
import { reportesService } from '../services/reportes.service.js';
import { chartsService } from '../services/charts.service.js';


// ======================================================
// RENDER PRINCIPAL
// ======================================================

export async function renderReportesPage() {
  let resumen = {
    totalVentas: 0,
    totalGastos: 0,
    utilidad: 0,
    margen: 0
  };

  try {
    resumen = await reportesService.getResumen();
  } catch (error) {
    console.error(
      'Error cargando resumen financiero:',
      error
    );
  }

  return `
    <div class="container-fluid">

      <div
        class="d-flex justify-content-between align-items-center mb-4"
      >
        <div>
          <h2 class="h4 fw-bold mb-1">
            Centro de Reportes
          </h2>

          <p class="text-muted mb-0 small">
            Análisis financiero y operativo del sistema
          </p>
        </div>
      </div>


      <!-- TABS -->
      <ul
        class="nav nav-tabs mb-4"
        id="reportesTabs"
        role="tablist"
      >

        <li
          class="nav-item"
          role="presentation"
        >
          <button
            class="nav-link active"
            id="financiero-tab"
            data-bs-toggle="tab"
            data-bs-target="#financiero"
            type="button"
          >
            Financiero
          </button>
        </li>


        <li
          class="nav-item"
          role="presentation"
        >
          <button
            class="nav-link"
            id="inventario-tab"
            data-bs-toggle="tab"
            data-bs-target="#inventario"
            type="button"
          >
            Inventario
          </button>
        </li>


        <li
          class="nav-item"
          role="presentation"
        >
          <button
            class="nav-link"
            id="ventas-tab"
            data-bs-toggle="tab"
            data-bs-target="#ventas"
            type="button"
          >
            Ventas
          </button>
        </li>

      </ul>


      <div
        class="tab-content"
        id="reportesTabsContent"
      >


        <!-- ========================================== -->
        <!-- FINANCIERO -->
        <!-- ========================================== -->

        <div
          class="tab-pane fade show active"
          id="financiero"
          role="tabpanel"
        >

          <div class="row g-3 mb-4">


            <div class="col-md-4">

              <div
                class="card border-0 shadow-sm bg-primary text-white"
              >

                <div class="card-body">

                  <h6
                    class="card-title opacity-75"
                  >
                    Total Ventas
                  </h6>

                  <h3 class="fw-bold mb-0">
                    $${Number(
                      resumen.totalVentas || 0
                    ).toLocaleString(
                      'es-CO'
                    )}
                  </h3>

                </div>

              </div>

            </div>


            <div class="col-md-4">

              <div
                class="card border-0 shadow-sm bg-danger text-white"
              >

                <div class="card-body">

                  <h6
                    class="card-title opacity-75"
                  >
                    Total Gastos
                  </h6>

                  <h3 class="fw-bold mb-0">
                    $${Number(
                      resumen.totalGastos || 0
                    ).toLocaleString(
                      'es-CO'
                    )}
                  </h3>

                </div>

              </div>

            </div>


            <div class="col-md-4">

              <div
                class="
                  card
                  border-0
                  shadow-sm
                  ${
                    Number(
                      resumen.utilidad || 0
                    ) >= 0
                      ? 'bg-success'
                      : 'bg-warning'
                  }
                  text-white
                "
              >

                <div class="card-body">

                  <h6
                    class="card-title opacity-75"
                  >
                    Utilidad Neta
                  </h6>

                  <h3 class="fw-bold mb-0">

                    $${Number(
                      resumen.utilidad || 0
                    ).toLocaleString(
                      'es-CO'
                    )}

                    <small class="fs-6">
                      (${Number(
                        resumen.margen || 0
                      )}%)
                    </small>

                  </h3>

                </div>

              </div>

            </div>

          </div>


          <div class="row g-4">


            <div class="col-lg-8">

              <div
                class="card border-0 shadow-sm h-100"
              >

                <div
                  class="
                    card-header
                    bg-white
                    d-flex
                    justify-content-between
                    align-items-center
                  "
                >

                  <h5 class="fw-bold mb-0">
                    Gastos por Categoría
                  </h5>

                  <button
                    class="
                      btn
                      btn-sm
                      btn-outline-secondary
                      btn-export-gastos
                    "
                  >
                    <i class="bi bi-download"></i>
                    CSV
                  </button>

                </div>


                <div class="card-body">

                  <div style="height: 300px;">

                    <canvas
                      id="chartGastosCat"
                    ></canvas>

                  </div>

                </div>

              </div>

            </div>


            <div class="col-lg-4">

              <div
                class="card border-0 shadow-sm h-100"
              >

                <div
                  class="card-header bg-white"
                >

                  <h5 class="fw-bold mb-0">
                    Distribución de Pagos
                  </h5>

                </div>


                <div class="card-body">

                  <div style="height: 300px;">

                    <canvas
                      id="chartVentasMetodo"
                    ></canvas>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        <!-- ========================================== -->
        <!-- INVENTARIO -->
        <!-- ========================================== -->

        <div
          class="tab-pane fade"
          id="inventario"
          role="tabpanel"
        >

          <div
            class="card border-0 shadow-sm mb-4"
          >

            <div
              class="
                card-header
                bg-white
                d-flex
                justify-content-between
                align-items-center
              "
            >

              <h5 class="fw-bold mb-0">
                Valorización de Inventario por Categoría
              </h5>

              <button
                class="
                  btn
                  btn-sm
                  btn-outline-secondary
                  btn-export-inventario
                "
              >
                <i class="bi bi-download"></i>
                CSV
              </button>

            </div>


            <div class="card-body">

              <div style="height: 350px;">

                <canvas
                  id="chartInventarioCat"
                ></canvas>

              </div>

            </div>

          </div>


          <div
            class="card border-0 shadow-sm"
          >

            <div
              class="card-header bg-white"
            >

              <h5 class="fw-bold mb-0">
                Top 5 Productos con Mayor Valor en Stock
              </h5>

            </div>


            <div class="card-body p-0">

              <div class="table-responsive">

                <table
                  class="table table-hover mb-0 align-middle"
                >

                  <thead class="table-light">

                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Stock</th>
                      <th>Precio Unit.</th>
                      <th class="text-end">
                        Valor Total
                      </th>
                    </tr>

                  </thead>


                  <tbody
                    id="tablaTopProductos"
                  ></tbody>

                </table>

              </div>

            </div>

          </div>

        </div>


        <!-- ========================================== -->
        <!-- VENTAS -->
        <!-- ========================================== -->

        <div
          class="tab-pane fade"
          id="ventas"
          role="tabpanel"
        >

          <div class="row g-4 mb-4">


            <div class="col-lg-6">

              <div
                class="card border-0 shadow-sm h-100"
              >

                <div
                  class="
                    card-header
                    bg-white
                    d-flex
                    justify-content-between
                    align-items-center
                  "
                >

                  <h5 class="fw-bold mb-0">
                    Top 5 Clientes
                  </h5>

                  <button
                    class="
                      btn
                      btn-sm
                      btn-outline-secondary
                      btn-export-ventas-clientes
                    "
                  >
                    <i class="bi bi-download"></i>
                    CSV
                  </button>

                </div>


                <div class="card-body">

                  <div style="height: 300px;">

                    <canvas
                      id="chartVentasCliente"
                    ></canvas>

                  </div>

                </div>

              </div>

            </div>


            <div class="col-lg-6">

              <div
                class="card border-0 shadow-sm h-100"
              >

                <div
                  class="
                    card-header
                    bg-white
                    d-flex
                    justify-content-between
                    align-items-center
                  "
                >

                  <h5 class="fw-bold mb-0">
                    Productos Más Vendidos
                  </h5>

                  <button
                    class="
                      btn
                      btn-sm
                      btn-outline-secondary
                      btn-export-ventas-productos
                    "
                  >
                    <i class="bi bi-download"></i>
                    CSV
                  </button>

                </div>


                <div class="card-body">

                  <div style="height: 300px;">

                    <canvas
                      id="chartVentasProducto"
                    ></canvas>

                  </div>

                </div>

              </div>

            </div>

          </div>


          <div class="row g-4">


            <div class="col-lg-6">

              <div
                class="card border-0 shadow-sm h-100"
              >

                <div
                  class="card-header bg-white"
                >

                  <h5 class="fw-bold mb-0">
                    Ventas por Estado
                  </h5>

                </div>


                <div class="card-body">

                  <div style="height: 250px;">

                    <canvas
                      id="chartVentasEstado"
                    ></canvas>

                  </div>

                </div>

              </div>

            </div>


            <div class="col-lg-6">

              <div
                class="card border-0 shadow-sm h-100"
              >

                <div
                  class="
                    card-header
                    bg-white
                    d-flex
                    justify-content-between
                    align-items-center
                  "
                >

                  <h5 class="fw-bold mb-0">
                    Todas las Ventas
                  </h5>

                  <button
                    class="
                      btn
                      btn-sm
                      btn-outline-secondary
                      btn-export-ventas
                    "
                  >
                    <i class="bi bi-download"></i>
                    CSV
                  </button>

                </div>


                <div
                  class="card-body p-0"
                  style="
                    max-height: 300px;
                    overflow-y: auto;
                  "
                >

                  <table
                    class="
                      table
                      table-sm
                      table-hover
                      mb-0
                    "
                  >

                    <thead
                      class="
                        table-light
                        sticky-top
                      "
                    >

                      <tr>
                        <th>Número</th>
                        <th>Cliente</th>
                        <th class="text-end">
                          Total
                        </th>
                        <th>Estado</th>
                      </tr>

                    </thead>


                    <tbody
                      id="tablaTodasVentas"
                    ></tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  `;
}


// ======================================================
// INICIALIZAR REPORTES
// ======================================================

export async function initReportesEvents() {
  chartsService.destroyAll();

  try {

    const [
      gastosData,
      ventasMetodo,
      inventarioData,
      topProductos,
      ventasCliente,
      ventasProducto,
      ventasEstado,
      todasVentas
    ] = await Promise.all([
      reportesService.getGastosCategoria(),
      reportesService.getVentasMetodoPago(),
      reportesService.getInventarioCategoria(),
      reportesService.getTopProductos(),
      reportesService.getVentasCliente(),
      reportesService.getVentasProducto(),
      reportesService.getVentasEstado(),
      reportesService.getHistorialVentas()
    ]);


    // ==================================================
    // GRÁFICO GASTOS
    // ==================================================

    chartsService.createBarChart(
      'chartGastosCat',
      {
        labels:
          gastosData?.labels || [],

        datasets: [
          {
            label: 'Monto ($)',
            data:
              gastosData?.data || [],
            backgroundColor:
              '#dc3545',
            borderRadius: 5
          }
        ]
      }
    );


    // ==================================================
    // MÉTODOS DE PAGO
    // ==================================================

    chartsService.createDoughnutChart(
      'chartVentasMetodo',
      {
        labels:
          ventasMetodo?.labels || [],

        datasets: [
          {
            data:
              ventasMetodo?.data || [],

            backgroundColor: [
              '#0d6efd',
              '#198754',
              '#ffc107',
              '#6f42c1'
            ],

            borderWidth: 0
          }
        ]
      }
    );


    // ==================================================
    // INVENTARIO POR CATEGORÍA
    // ==================================================

    chartsService.createBarChart(
      'chartInventarioCat',
      {
        labels:
          inventarioData?.labels || [],

        datasets: [
          {
            label:
              'Valor en Stock ($)',

            data:
              inventarioData?.data || [],

            backgroundColor:
              '#0dcaf0',

            borderRadius: 5
          }
        ]
      },
      {
        indexAxis: 'y'
      }
    );


    // ==================================================
    // TOP PRODUCTOS
    // ==================================================

    const tbodyTop =
      document.getElementById(
        'tablaTopProductos'
      );

    if (tbodyTop) {

      if (
        !topProductos ||
        topProductos.length === 0
      ) {

        tbodyTop.innerHTML = `
          <tr>
            <td
              colspan="5"
              class="text-center text-muted py-4"
            >
              No hay productos registrados
            </td>
          </tr>
        `;

      } else {

        tbodyTop.innerHTML =
          topProductos
            .map(producto => `
              <tr>

                <td
                  class="fw-bold text-success"
                >
                  ${producto.codigo}
                </td>

                <td>
                  ${producto.nombre}
                </td>

                <td>
                  ${producto.stock}
                </td>

                <td>
                  $${Number(
                    producto.precio || 0
                  ).toLocaleString(
                    'es-CO'
                  )}
                </td>

                <td
                  class="text-end fw-bold"
                >
                  $${Number(
                    producto.valorTotal || 0
                  ).toLocaleString(
                    'es-CO',
                    {
                      minimumFractionDigits: 2
                    }
                  )}
                </td>

              </tr>
            `)
            .join('');
      }
    }


    // ==================================================
    // VENTAS POR CLIENTE
    // ==================================================

    chartsService.createBarChart(
      'chartVentasCliente',
      {
        labels:
          ventasCliente?.labels || [],

        datasets: [
          {
            label:
              'Total Ventas ($)',

            data:
              ventasCliente?.data || [],

            backgroundColor:
              '#0d6efd',

            borderRadius: 5
          }
        ]
      }
    );


    // ==================================================
    // VENTAS POR PRODUCTO
    // ==================================================

    chartsService.createBarChart(
      'chartVentasProducto',
      {
        labels:
          ventasProducto?.labels || [],

        datasets: [
          {
            label:
              'Cantidad Vendida',

            data:
              ventasProducto?.data || [],

            backgroundColor:
              '#198754',

            borderRadius: 5
          }
        ]
      },
      {
        indexAxis: 'y'
      }
    );


    // ==================================================
    // VENTAS POR ESTADO
    // ==================================================

    chartsService.createDoughnutChart(
      'chartVentasEstado',
      {
        labels:
          ventasEstado?.labels || [],

        datasets: [
          {
            data:
              ventasEstado?.data || [],

            backgroundColor: [
              '#198754',
              '#ffc107',
              '#dc3545'
            ],

            borderWidth: 0
          }
        ]
      }
    );


    // ==================================================
    // TABLA TODAS LAS VENTAS
    // ==================================================

    const tbodyVentas =
      document.getElementById(
        'tablaTodasVentas'
      );

    if (tbodyVentas) {

      if (
        !todasVentas ||
        todasVentas.length === 0
      ) {

        tbodyVentas.innerHTML = `
          <tr>
            <td
              colspan="4"
              class="text-center text-muted py-4"
            >
              No hay ventas registradas
            </td>
          </tr>
        `;

      } else {

        tbodyVentas.innerHTML =
          todasVentas
            .map(venta => {

              const estadoColor =
                venta.estado ===
                'Completada'
                  ? 'success'
                  : venta.estado ===
                    'Pendiente'
                    ? 'warning'
                    : 'danger';

              return `
                <tr>

                  <td
                    class="fw-bold text-primary"
                  >
                    ${venta.numero}
                  </td>

                  <td>
                    ${venta.cliente}
                  </td>

                  <td
                    class="text-end fw-bold"
                  >
                    $${Number(
                      venta.total || 0
                    ).toLocaleString(
                      'es-CO',
                      {
                        minimumFractionDigits: 2
                      }
                    )}
                  </td>

                  <td>
                    <span
                      class="
                        badge
                        bg-${estadoColor}-subtle
                        text-${estadoColor}
                      "
                    >
                      ${venta.estado}
                    </span>
                  </td>

                </tr>
              `;
            })
            .join('');
      }
    }


    // ==================================================
    // EXPORTAR GASTOS
    // ==================================================

    const btnGastos =
      document.querySelector(
        '.btn-export-gastos'
      );

    if (btnGastos) {

      btnGastos.addEventListener(
        'click',
        () => {

          const datos =
            (gastosData?.labels || [])
              .map(
                (categoria, index) => ({
                  Categoria:
                    categoria,

                  Monto:
                    gastosData.data[index]
                })
              );

          reportesService.exportarCSV(
            datos,
            'gastos_por_categoria'
          );
        }
      );
    }


    // ==================================================
    // EXPORTAR INVENTARIO
    // ==================================================

    const btnInventario =
      document.querySelector(
        '.btn-export-inventario'
      );

    if (btnInventario) {

      btnInventario.addEventListener(
        'click',
        () => {

          const datos =
            (
              inventarioData?.labels ||
              []
            ).map(
              (categoria, index) => ({
                Categoria:
                  categoria,

                Valor:
                  inventarioData
                    .data[index]
              })
            );

          reportesService.exportarCSV(
            datos,
            'valorizacion_inventario'
          );
        }
      );
    }


    // ==================================================
    // EXPORTAR CLIENTES
    // ==================================================

    const btnClientes =
      document.querySelector(
        '.btn-export-ventas-clientes'
      );

    if (btnClientes) {

      btnClientes.addEventListener(
        'click',
        () => {

          const datos =
            (
              ventasCliente?.labels ||
              []
            ).map(
              (cliente, index) => ({
                Cliente:
                  cliente,

                Total:
                  ventasCliente
                    .data[index]
              })
            );

          reportesService.exportarCSV(
            datos,
            'ventas_por_cliente'
          );
        }
      );
    }


    // ==================================================
    // EXPORTAR PRODUCTOS
    // ==================================================

    const btnProductos =
      document.querySelector(
        '.btn-export-ventas-productos'
      );

    if (btnProductos) {

      btnProductos.addEventListener(
        'click',
        () => {

          const datos =
            (
              ventasProducto?.labels ||
              []
            ).map(
              (producto, index) => ({
                Producto:
                  producto,

                Cantidad:
                  ventasProducto
                    .data[index]
              })
            );

          reportesService.exportarCSV(
            datos,
            'productos_mas_vendidos'
          );
        }
      );
    }


    // ==================================================
    // EXPORTAR TODAS LAS VENTAS
    // ==================================================

    const btnVentas =
      document.querySelector(
        '.btn-export-ventas'
      );

    if (btnVentas) {

      btnVentas.addEventListener(
        'click',
        () => {

          reportesService.exportarCSV(
            todasVentas || [],
            'todas_las_ventas'
          );
        }
      );
    }

  } catch (error) {

    console.error(
      'Error cargando reportes:',
      error
    );
  }
}