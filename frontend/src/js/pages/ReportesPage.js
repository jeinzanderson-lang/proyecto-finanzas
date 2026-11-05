// src/js/pages/ReportesPage.js
import { reportesService } from '../services/reportes.service.js';
import { chartsService } from '../services/charts.service.js';

export function renderReportesPage() {
  const resumen = reportesService.getResumenFinanciero();

  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Centro de Reportes</h2>
          <p class="text-muted mb-0 small">Análisis financiero y operativo del sistema</p>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" id="reportesTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="financiero-tab" data-bs-toggle="tab" data-bs-target="#financiero" type="button">Financiero</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="inventario-tab" data-bs-toggle="tab" data-bs-target="#inventario" type="button">Inventario</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="ventas-tab" data-bs-toggle="tab" data-bs-target="#ventas" type="button">Ventas</button>
        </li>
      </ul>

      <div class="tab-content" id="reportesTabsContent">
        
        <div class="tab-pane fade show active" id="financiero" role="tabpanel">
          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="card border-0 shadow-sm bg-primary text-white">
                <div class="card-body">
                  <h6 class="card-title opacity-75">Total Ventas</h6>
                  <h3 class="fw-bold mb-0">$${resumen.totalVentas.toLocaleString('es-CO')}</h3>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-0 shadow-sm bg-danger text-white">
                <div class="card-body">
                  <h6 class="card-title opacity-75">Total Gastos</h6>
                  <h3 class="fw-bold mb-0">$${resumen.totalGastos.toLocaleString('es-CO')}</h3>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-0 shadow-sm ${resumen.utilidad >= 0 ? 'bg-success' : 'bg-warning'} text-white">
                <div class="card-body">
                  <h6 class="card-title opacity-75">Utilidad Neta</h6>
                  <h3 class="fw-bold mb-0">$${resumen.utilidad.toLocaleString('es-CO')} <small class="fs-6">(${resumen.margen}%)</small></h3>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-4">
            <div class="col-lg-8">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 class="fw-bold mb-0">Gastos por Categoría</h5>
                  <button class="btn btn-sm btn-outline-secondary btn-export-gastos"><i class="bi bi-download"></i> CSV</button>
                </div>
                <div class="card-body"><div style="height: 300px;"><canvas id="chartGastosCat"></canvas></div></div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white">
                  <h5 class="fw-bold mb-0">Distribución de Pagos</h5>
                </div>
                <div class="card-body"><div style="height: 300px;"><canvas id="chartVentasMetodo"></canvas></div></div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="inventario" role="tabpanel">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">Valorización de Inventario por Categoría</h5>
              <button class="btn btn-sm btn-outline-secondary btn-export-inventario"><i class="bi bi-download"></i> CSV</button>
            </div>
            <div class="card-body"><div style="height: 350px;"><canvas id="chartInventarioCat"></canvas></div></div>
          </div>
          
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="fw-bold mb-0">Top 5 Productos con Mayor Valor en Stock</h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                  <thead class="table-light">
                    <tr><th>Código</th><th>Producto</th><th>Stock</th><th>Precio Unit.</th><th class="text-end">Valor Total</th></tr>
                  </thead>
                  <tbody id="tablaTopProductos"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="ventas" role="tabpanel">
          <div class="row g-4 mb-4">
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 class="fw-bold mb-0">Top 5 Clientes</h5>
                  <button class="btn btn-sm btn-outline-secondary btn-export-ventas-clientes"><i class="bi bi-download"></i> CSV</button>
                </div>
                <div class="card-body"><div style="height: 300px;"><canvas id="chartVentasCliente"></canvas></div></div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 class="fw-bold mb-0">Productos Más Vendidos</h5>
                  <button class="btn btn-sm btn-outline-secondary btn-export-ventas-productos"><i class="bi bi-download"></i> CSV</button>
                </div>
                <div class="card-body"><div style="height: 300px;"><canvas id="chartVentasProducto"></canvas></div></div>
              </div>
            </div>
          </div>

          <div class="row g-4">
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white">
                  <h5 class="fw-bold mb-0">Ventas por Estado</h5>
                </div>
                <div class="card-body"><div style="height: 250px;"><canvas id="chartVentasEstado"></canvas></div></div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 class="fw-bold mb-0">Todas las Ventas</h5>
                  <button class="btn btn-sm btn-outline-secondary btn-export-ventas"><i class="bi bi-download"></i> CSV</button>
                </div>
                <div class="card-body p-0" style="max-height: 300px; overflow-y: auto;">
                  <table class="table table-sm table-hover mb-0">
                    <thead class="table-light sticky-top">
                      <tr><th>Número</th><th>Cliente</th><th class="text-end">Total</th><th>Estado</th></tr>
                    </thead>
                    <tbody id="tablaTodasVentas"></tbody>
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

export function initReportesEvents() {
  chartsService.destroyAll();

  const gastosData = reportesService.getGastosPorCategoria();
  chartsService.createBarChart('chartGastosCat', {
    labels: gastosData.labels,
    datasets: [{ label: 'Monto ($)', data: gastosData.data, backgroundColor: '#dc3545', borderRadius: 5 }]
  });

  const ventasMetodo = reportesService.getVentasPorMetodoPago();
  chartsService.createDoughnutChart('chartVentasMetodo', {
    labels: ventasMetodo.labels,
    datasets: [{ data: ventasMetodo.data, backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#6f42c1'], borderWidth: 0 }]
  });

  const invData = reportesService.getInventarioPorCategoria();
  chartsService.createBarChart('chartInventarioCat', {
    labels: invData.labels,
    datasets: [{ label: 'Valor en Stock ($)', data: invData.data, backgroundColor: '#0dcaf0', borderRadius: 5 }],
    indexAxis: 'y'
  });

  const topProductos = reportesService.getTopProductosValor();
  const tbody = document.getElementById('tablaTopProductos');
  if (tbody) {
    tbody.innerHTML = topProductos.map(p => `
      <tr>
        <td class="fw-bold text-success">${p.codigo}</td>
        <td>${p.nombre}</td>
        <td>${p.stock}</td>
        <td>$${p.precio.toLocaleString('es-CO')}</td>
        <td class="text-end fw-bold">$${p.valorTotal.toLocaleString('es-CO', {minimumFractionDigits: 2})}</td>
      </tr>
    `).join('');
  }

  const ventasCliente = reportesService.getVentasPorCliente();
  chartsService.createBarChart('chartVentasCliente', {
    labels: ventasCliente.labels,
    datasets: [{ label: 'Total Ventas ($)', data: ventasCliente.data, backgroundColor: '#0d6efd', borderRadius: 5 }]
  });

  const ventasProducto = reportesService.getVentasPorProducto();
  chartsService.createBarChart('chartVentasProducto', {
    labels: ventasProducto.labels,
    datasets: [{ label: 'Cantidad Vendida', data: ventasProducto.data, backgroundColor: '#198754', borderRadius: 5 }],
    indexAxis: 'y'
  });

  const ventasEstado = reportesService.getVentasPorEstado();
  chartsService.createDoughnutChart('chartVentasEstado', {
    labels: ventasEstado.labels,
    datasets: [{ data: ventasEstado.data, backgroundColor: ['#198754', '#ffc107', '#dc3545'], borderWidth: 0 }]
  });

  const todasVentas = reportesService.getAllVentas();
  const tbodyVentas = document.getElementById('tablaTodasVentas');
  if (tbodyVentas) {
    tbodyVentas.innerHTML = todasVentas.map(v => {
      const estadoColor = v.estado === 'Completada' ? 'success' : v.estado === 'Pendiente' ? 'warning' : 'danger';
      return `
        <tr>
          <td class="fw-bold text-primary">${v.numero}</td>
          <td>${v.cliente}</td>
          <td class="text-end fw-bold">$${v.total.toLocaleString('es-CO', {minimumFractionDigits: 2})}</td>
          <td><span class="badge bg-${estadoColor}-subtle text-${estadoColor}">${v.estado}</span></td>
        </tr>
      `;
    }).join('');
  }

  const btnExpGastos = document.querySelector('.btn-export-gastos');
  if (btnExpGastos) {
    btnExpGastos.addEventListener('click', () => {
      const datos = reportesService.getGastosPorCategoria();
      const csvData = datos.labels.map((l, i) => ({ Categoria: l, Monto: datos.data[i] }));
      reportesService.exportarCSV(csvData, 'gastos_por_categoria');
    });
  }

  const btnExpInv = document.querySelector('.btn-export-inventario');
  if (btnExpInv) {
    btnExpInv.addEventListener('click', () => {
      const datos = reportesService.getInventarioPorCategoria();
      const csvData = datos.labels.map((l, i) => ({ Categoria: l, Valor: datos.data[i] }));
      reportesService.exportarCSV(csvData, 'valorizacion_inventario');
    });
  }

  const btnExpVentasClientes = document.querySelector('.btn-export-ventas-clientes');
  if (btnExpVentasClientes) {
    btnExpVentasClientes.addEventListener('click', () => {
      const datos = reportesService.getVentasPorCliente();
      const csvData = datos.labels.map((l, i) => ({ Cliente: l, Total: datos.data[i] }));
      reportesService.exportarCSV(csvData, 'ventas_por_cliente');
    });
  }

  const btnExpVentasProductos = document.querySelector('.btn-export-ventas-productos');
  if (btnExpVentasProductos) {
    btnExpVentasProductos.addEventListener('click', () => {
      const datos = reportesService.getVentasPorProducto();
      const csvData = datos.labels.map((l, i) => ({ Producto: l, Cantidad: datos.data[i] }));
      reportesService.exportarCSV(csvData, 'productos_mas_vendidos');
    });
  }

  const btnExpVentas = document.querySelector('.btn-export-ventas');
  if (btnExpVentas) {
    btnExpVentas.addEventListener('click', () => {
      const datos = reportesService.getAllVentas();
      reportesService.exportarCSV(datos, 'todas_las_ventas');
    });
  }
}