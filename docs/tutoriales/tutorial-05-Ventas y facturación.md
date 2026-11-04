## 1. Objetivo
Implementar el módulo de ventas para registrar facturas, consultar el historial y gestionar el estado de pago (Pendiente/Pagada), basándose en el diseño original del HTML de AG Services.

## 2. Alcance de este sprint
En este sprint se construye el módulo de Ventas. Se implementa:
- el botón "Nueva venta" que abre un modal con el formulario;
- la tabla de "Historial de ventas" con paginación;
- el modal de "Detalle de la venta";
- la lógica para cambiar el estado de la factura (Pendiente/Pagada);
- el consumo de datos desde el endpoint /api/v1/sales del backend.

No se implementa todavía:
- los módulos de Gastos, Inventario, Reportes, Configuración;
- generación de PDF de factura.

## 3. Qué se instala
No se instalan nuevas dependencias. Se usan:
Fetch API nativa del navegador;
Bootstrap 5.3 y Bootstrap Icons (ya instalados).

## 4. Archivos que se crean o ajustan
Al terminar este sprint, estos archivos deben existir:
src/js/modules/sales/sales.js;
src/js/modules/sales/salesService.js;
src/js/main.js (se ajusta para cargar el módulo de ventas);
src/css/main.css (se añaden estilos específicos si es necesario).
Estructura esperada:

frontend/
└── src/
    ├── css/
    │   └── main.css
    └── js/
        ├── auth/
        │   ├── authService.js
        │   └── login.js
        ├── components/
        │   ── sidebar.js
        ├── modules/
        │   ├── dashboard/
        │   │   ├── dashboard.js
        │   │   └── dashboardService.js
        │   └── sales/
        │       ├── sales.js
        │       └── salesService.js
        ├── utils/
        │   ├── apiClient.js
        │   ├── roleManager.js
        │   └── tokenManager.js
        └── main.js

## 5. Paso a paso
Paso 1: crear el servicio de Ventas (salesService.js)
Crea la carpeta src/js/modules/sales y dentro el archivo salesService.js para gestionar las peticiones al backend.

import { apiRequest } from '../../utils/apiClient.js';

export const salesService = {
  async list(page = 1) {
    return await apiRequest(`/sales?page=${page}`);
  },

  async getById(id) {
    return await apiRequest(`/sales/${id}`);
  },

  async create(data) {
    return await apiRequest('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return await apiRequest(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

Paso 2: crear la vista de Ventas (sales.js)
Crea src/js/modules/sales/sales.js. Este archivo renderiza el HTML del módulo de ventas basándose en el diseño original.

import { salesService } from './salesService.js';

export async function renderSales() {
  const data = await salesService.list();

  return `
    <div class="sales-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Facturación</h2>
          <p class="text-muted mb-0">Consulta el historial de facturas registradas.</p>
        </div>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newSaleModal">
          <i class="bi bi-plus-lg me-2"></i>Nueva venta
        </button>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 pt-3">
          <h5 class="fw-bold mb-0">Historial de ventas</h5>
          <small class="text-muted">Movimientos registrados.</small>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map(sale => `
                  <tr>
                    <td>${sale.invoice_number}</td>
                    <td>${sale.client_name}</td>
                    <td>$ ${sale.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Nueva Venta -->
      <div class="modal fade" id="newSaleModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nueva venta</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p class="text-muted">Registra una factura o ingreso.</p>
              <form id="newSaleForm">
                <div class="mb-3">
                  <label class="form-label">Cliente</label>
                  <input type="text" class="form-control" id="saleClient" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Fecha</label>
                  <input type="date" class="form-control" id="saleDate" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Valor</label>
                  <input type="number" class="form-control" id="saleAmount" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Concepto</label>
                  <input type="text" class="form-control" id="saleConcept">
                </div>
                <div class="mb-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" id="saleStatus">
                    <option value="PAGADA">Pagada</option>
                    <option value="PENDIENTE">Pendiente</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSaveSale">Registrar venta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSalesEvents() {
  document.getElementById('btnSaveSale').addEventListener('click', async () => {
    const data = {
      client_name: document.getElementById('saleClient').value,
      issued_at: document.getElementById('saleDate').value,
      amount: parseFloat(document.getElementById('saleAmount').value),
      concept: document.getElementById('saleConcept').value,
      status: document.getElementById('saleStatus').value,
    };

    try {
      await salesService.create(data);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  });
}

Paso 3: integrar Ventas en main.js
Ajusta src/js/main.js para que cargue el módulo de Ventas cuando se hace clic en el menú.

import { renderSales, initSalesEvents } from './modules/sales/sales.js';

// Dentro de initSidebarEvents, añade:
if (module === 'ventas') {
  content.innerHTML = await renderSales();
  initSalesEvents();
}

## 6. Cómo validar que quedó bien
En este sprint no hay pruebas automatizadas. La validación consiste en:
- hacer clic en "Ventas" en el Sidebar y verificar que se muestre la tabla de historial;
- hacer clic en "Nueva venta" y verificar que se abra el modal con el formulario;
- registrar una venta y verificar que se guarde en el backend;
- el diseño debe ser responsivo.

Antes de cerrar el tutorial, confirma esta lista:
- existe src/js/modules/sales/sales.js;
- existe src/js/modules/sales/salesService.js;
- main.js carga el módulo de Ventas al hacer clic en el menú;
- npm run dev funciona y muestra el módulo de Ventas completo.

## 7. Errores comunes
Los errores más frecuentes en este tutorial son:
- no validar que el valor sea mayor a cero;
- permitir duplicar números de factura;
- no manejar errores de red al guardar;
- olvidar actualizar la lista después de crear/editar.

## 8. Guardar los cambios en Git
Antes de crear el commit, revisa git status para confirmar qué archivos se van a guardar.
git status
git add .
git commit -m "Sprint 5: módulo de ventas y facturación"
git push

## 9. Resultado esperado
Al terminar este Sprint 5 tendrás:
- el módulo de Ventas completamente funcional;
- formulario de nueva venta con validaciones;
- tabla de historial con datos reales del backend;
- la base lista para replicar este patrón en los módulos de Gastos e Inventario.