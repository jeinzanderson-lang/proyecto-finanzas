## 1. Objetivo
Implementar el módulo de gastos para registrar egresos, cuentas por pagar y gestionar el estado de pago (Pendiente/Pagado), basándose en el diseño original del HTML de AG Services.

## 2. Alcance de este sprint
En este sprint se construye el módulo de Gastos. Se implementa:
- el botón "Nuevo gasto" que abre un modal con el formulario;
- la tabla de "Historial de gastos" con paginación;
- el modal de "Detalle del gasto";
- la lógica para cambiar el estado (Pendiente/Pagado);
- el consumo de datos desde el endpoint /api/v1/expenses del backend.
- No se implementa todavía:
- los módulos de Inventario, Reportes, Configuración;
- categorías de gastos avanzadas.

## 3. Qué se instala
No se instalan nuevas dependencias. Se usan:
Fetch API nativa del navegador;
Bootstrap 5.3 y Bootstrap Icons (ya instalados).

## 4. Archivos que se crean o ajustan
Al terminar este sprint, estos archivos deben existir:
src/js/modules/expenses/expenses.js;
src/js/modules/expenses/expensesService.js;
src/js/main.js (se ajusta para cargar el módulo de gastos).
Estructura esperada:

frontend/
└── src/
    └── js/
        ── modules/
            ├── dashboard/
            ├── sales/
            └── expenses/
                ├── expenses.js
                └── expensesService.js

## 5. Paso a paso
Paso 1: crear el servicio de Gastos (expensesService.js)
Crea la carpeta src/js/modules/expenses y dentro el archivo expensesService.js.

import { apiRequest } from '../../utils/apiClient.js';

export const expensesService = {
  async list(page = 1) {
    return await apiRequest(`/expenses?page=${page}`);
  },

  async getById(id) {
    return await apiRequest(`/expenses/${id}`);
  },

  async create(data) {
    return await apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return await apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

Paso 2: crear la vista de Gastos (expenses.js)
Crea src/js/modules/expenses/expenses.js.

import { expensesService } from './expensesService.js';

export async function renderExpenses() {
  const data = await expensesService.list();

  return `
    <div class="expenses-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Egresos</h2>
          <p class="text-muted mb-0">Consulta el historial de gastos y cuentas por pagar.</p>
        </div>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newExpenseModal">
          <i class="bi bi-plus-lg me-2"></i>Nuevo gasto
        </button>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 pt-3">
          <h5 class="fw-bold mb-0">Historial de gastos</h5>
          <small class="text-muted">Movimientos registrados.</small>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Referencia</th>
                  <th>Proveedor</th>
                  <th>Valor</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map(expense => `
                  <tr>
                    <td>${expense.reference}</td>
                    <td>${expense.provider}</td>
                    <td>$ ${expense.amount.toLocaleString()}</td>
                    <td><span class="badge ${expense.status === 'PAGADO' ? 'bg-success' : 'bg-warning'}">${expense.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Nuevo Gasto -->
      <div class="modal fade" id="newExpenseModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nuevo gasto</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p class="text-muted">Registra una cuenta por pagar o egreso.</p>
              <form id="newExpenseForm">
                <div class="mb-3">
                  <label class="form-label">Proveedor</label>
                  <input type="text" class="form-control" id="expenseProvider" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Concepto</label>
                  <input type="text" class="form-control" id="expenseConcept" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Vencimiento</label>
                  <input type="date" class="form-control" id="expenseDueDate" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Valor</label>
                  <input type="number" class="form-control" id="expenseAmount" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" id="expenseStatus">
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSaveExpense">Registrar gasto</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initExpensesEvents() {
  document.getElementById('btnSaveExpense').addEventListener('click', async () => {
    const data = {
      provider: document.getElementById('expenseProvider').value,
      concept: document.getElementById('expenseConcept').value,
      due_date: document.getElementById('expenseDueDate').value,
      amount: parseFloat(document.getElementById('expenseAmount').value),
      status: document.getElementById('expenseStatus').value,
    };

    try {
      await expensesService.create(data);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  });
}

Paso 3: integrar Gastos en main.js
Ajusta src/js/main.js para que cargue el módulo de Gastos cuando se hace clic en el menú.

import { renderExpenses, initExpensesEvents } from './modules/expenses/expenses.js';

// Dentro de initSidebarEvents, añade:
if (module === 'gastos') {
  content.innerHTML = await renderExpenses();
  initExpensesEvents();
}

## 6. Cómo validar que quedó bien
En este sprint no hay pruebas automatizadas. La validación consiste en:
- hacer clic en "Gastos" en el Sidebar y verificar que se muestre la tabla de historial;
- hacer clic en "Nuevo gasto" y verificar que se abra el modal con el formulario;
- registrar un gasto y verificar que se guarde en el backend;
- el diseño debe ser responsivo.

Antes de cerrar el tutorial, confirma esta lista:
- existe src/js/modules/expenses/expenses.js;
- existe src/js/modules/expenses/expensesService.js;
- main.js carga el módulo de Gastos al hacer clic en el menú;
- npm run dev funciona y muestra el módulo de Gastos completo.

## 7. Errores comunes
Los errores más frecuentes en este tutorial son:
- no validar la fecha de vencimiento;
- permitir valores negativos;
- no manejar errores de red al guardar;
- olvidar actualizar la lista después de crear/editar.

## 8. Guardar los cambios en Git
Antes de crear el commit, revisa git status para confirmar qué archivos se van a guardar.
git status
git add .
git commit -m "Sprint 6: módulo de gastos y cuentas por pagar"
git push

## 9. Resultado esperado
Al terminar este Sprint 6 tendrás:
- el módulo de Gastos completamente funcional;
- formulario de nuevo gasto con validaciones;
- tabla de historial con datos reales del backend;
- la base lista para replicar este patrón en los módulos de Inventario y Reportes.

