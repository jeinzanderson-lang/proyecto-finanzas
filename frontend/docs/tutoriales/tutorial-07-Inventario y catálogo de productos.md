## 1. Objetivo
Implementar el módulo de inventario para gestionar productos, stock, costos y precios, basándose en el diseño original del HTML de AG Services.
## 2. Alcance de este sprint
En este sprint se construye el módulo de Inventario. Se implementa:
- el botón "Nuevo producto" que abre un modal con el formulario;
- la tabla de "Catálogo de inventario" con paginación;
- el modal de "Detalle del producto";
- la lógica para resaltar visualmente los productos con stock bajo;
- el consumo de datos desde el endpoint /api/v1/inventory del backend.

No se implementa todavía:
- los módulos de Reportes y Configuración;
- gestión de múltiples bodegas.

## 3. Qué se instala
No se instalan nuevas dependencias. Se usan:
Fetch API nativa del navegador;
Bootstrap 5.3 y Bootstrap Icons (ya instalados).

## 4. Archivos que se crean o ajustan
Al terminar este sprint, estos archivos deben existir:
src/js/modules/inventory/inventory.js;
src/js/modules/inventory/inventoryService.js;
src/js/main.js (se ajusta para cargar el módulo de inventario).
Estructura esperada:

frontend/
└── src/
    └── js/
        └── modules/
            ├── dashboard/
            ├── sales/
            ├── expenses/
            └── inventory/
                ├── inventory.js
                └── inventoryService.js

## 5. Paso a paso
Paso 1: crear el servicio de Inventario (inventoryService.js)
Crea la carpeta src/js/modules/inventory y dentro el archivo inventoryService.js.

import { apiRequest } from '../../utils/apiClient.js';

export const inventoryService = {
  async list(page = 1) {
    return await apiRequest(`/inventory?page=${page}`);
  },

  async getById(id) {
    return await apiRequest(`/inventory/${id}`);
  },

  async create(data) {
    return await apiRequest('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return await apiRequest(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

Paso 2: crear la vista de Inventario (inventory.js)
Crea src/js/modules/inventory/inventory.js.

import { inventoryService } from './inventoryService.js';

export async function renderInventory() {
  const data = await inventoryService.list();

  return `
    <div class="inventory-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Control operativo</h2>
          <p class="text-muted mb-0">Consulta productos, precios y disponibilidad.</p>
        </div>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newProductModal">
          <i class="bi bi-plus-lg me-2"></i>Nuevo producto
        </button>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 pt-3">
          <h5 class="fw-bold mb-0">Catálogo de inventario</h5>
          <small class="text-muted">Selecciona el nombre de un producto para ver sus detalles.</small>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map(product => `
                  <tr class="${product.stock <= product.min_stock ? 'table-warning' : ''}">
                    <td>${product.name}</td>
                    <td>$ ${product.price.toLocaleString()}</td>
                    <td><span class="badge ${product.stock <= product.min_stock ? 'bg-warning' : 'bg-success'}">${product.stock <= product.min_stock ? 'Stock bajo' : 'Disponible'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Nuevo Producto -->
      <div class="modal fade" id="newProductModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nuevo producto</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p class="text-muted">Registra un producto en el inventario.</p>
              <form id="newProductForm">
                <div class="mb-3">
                  <label class="form-label">Descripción breve</label>
                  <input type="text" class="form-control" id="productName" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">SKU / ID</label>
                  <input type="text" class="form-control" id="productSku" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Producto</label>
                  <input type="text" class="form-control" id="productFullname" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Stock</label>
                  <input type="number" class="form-control" id="productStock" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Costo</label>
                  <input type="number" class="form-control" id="productCost" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Precio</label>
                  <input type="number" class="form-control" id="productPrice" required>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSaveProduct">Guardar producto</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initInventoryEvents() {
  document.getElementById('btnSaveProduct').addEventListener('click', async () => {
    const data = {
      name: document.getElementById('productName').value,
      sku: document.getElementById('productSku').value,
      fullname: document.getElementById('productFullname').value,
      stock: parseInt(document.getElementById('productStock').value),
      cost: parseFloat(document.getElementById('productCost').value),
      price: parseFloat(document.getElementById('productPrice').value),
    };

    try {
      await inventoryService.create(data);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  });
}

Paso 3: integrar Inventario en main.js
Ajusta src/js/main.js para que cargue el módulo de Inventario cuando se hace clic en el menú.

import { renderInventory, initInventoryEvents } from './modules/inventory/inventory.js';

// Dentro de initSidebarEvents, añade:
if (module === 'inventario') {
  content.innerHTML = await renderInventory();
  initInventoryEvents();
}

## 6. Cómo validar que quedó bien
En este sprint no hay pruebas automatizadas. La validación consiste en:
- hacer clic en "Inventario" en el Sidebar y verificar que se muestre la tabla de catálogo;
- hacer clic en "Nuevo producto" y verificar que se abra el modal con el formulario;
- registrar un producto y verificar que se guarde en el backend;
- los productos con stock bajo deben resaltarse en color amarillo.

Antes de cerrar el tutorial, confirma esta lista:
- existe src/js/modules/inventory/inventory.js;
- existe src/js/modules/inventory/inventoryService.js;
- main.js carga el módulo de Inventario al hacer clic en el menú;
- npm run dev funciona y muestra el módulo de Inventario completo.

## 7. Errores comunes
Los errores más frecuentes en este tutorial son:
- no validar que el stock sea mayor o igual a cero;
- permitir costos o precios negativos;
- no manejar errores de red al guardar;
- olvidar actualizar la lista después de crear/editar.

## 8. Guardar los cambios en Git
Antes de crear el commit, revisa git status para confirmar qué archivos se van a guardar.
git status
git add .
git commit -m "Sprint 7: módulo de inventario y catálogo de productos"
git push

## 9. Resultado esperado
Al terminar este Sprint 7 tendrás:
- el módulo de Inventario completamente funcional;
- formulario de nuevo producto con validaciones;
- tabla de catálogo con datos reales del backend;
- alertas visuales para productos con stock bajo.
