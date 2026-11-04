## 1. Objetivo
Implementar el módulo de configuración para gestionar el catálogo de cuentas contables y preferencias generales, basándose en el diseño original del HTML de AG Services.

## 2. Alcance de este sprint
En este sprint se construye el módulo de Configuración. Se implementa:
- el botón "Nueva cuenta" que abre un modal con el formulario;
- la tabla de "Catálogo de Cuentas" (Activos, Pasivos y Patrimonio);
- el toggle de modo Oscuro/Claro;
- el consumo de datos desde el endpoint /api/v1/settings/accounts del backend.

No se implementa todavía:
- integración final y optimizaciones.

## 3. Qué se instala
No se instalan nuevas dependencias. Se usan:
Fetch API nativa del navegador;
Bootstrap 5.3 y Bootstrap Icons (ya instalados).

## 4. Archivos que se crean o ajustan
Al terminar este sprint, estos archivos deben existir:
src/js/modules/settings/settings.js;
src/js/modules/settings/settingsService.js;
src/js/main.js (se ajusta para cargar el módulo de configuración);
src/css/main.css (se añaden estilos para modo oscuro).
Estructura esperada:

frontend/
└── src/
    ├── css/
    │   └── main.css
    └── js/
        ── modules/
            ├── dashboard/
            ├── sales/
            ├── expenses/
            ├── inventory/
            ├── reports/
            └── settings/
                ├── settings.js
                └── settingsService.js

## 5. Paso a paso
Paso 1: crear el servicio de Configuración (settingsService.js)
Crea la carpeta src/js/modules/settings y dentro el archivo settingsService.js.

import { apiRequest } from '../../utils/apiClient.js';

export const settingsService = {
  async listAccounts() {
    return await apiRequest('/settings/accounts');
  },

  async createAccount(data) {
    return await apiRequest('/settings/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAccount(id, data) {
    return await apiRequest(`/settings/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

Paso 2: crear la vista de Configuración (settings.js)
Crea src/js/modules/settings/settings.js.

import { settingsService } from './settingsService.js';

export async function renderSettings() {
  const data = await settingsService.listAccounts();

  return `
    <div class="settings-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Administración</h2>
          <p class="text-muted mb-0">Preferencias generales y catálogo de cuentas.</p>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <h5 class="fw-bold mb-3">Elige apariencia</h5>
          <p class="text-muted">Activa el modo oscuro o déjalo desactivado para usar el modo claro.</p>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="darkModeToggle">
            <label class="form-check-label" for="darkModeToggle">Desactivado</label>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="fw-bold mb-0">Catálogo de Cuentas</h5>
          <small class="text-muted">Activos, Pasivos y Patrimonio.</small>
        </div>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newAccountModal">
          <i class="bi bi-plus-lg me-2"></i>Nueva cuenta
        </button>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 pt-3">
          <h5 class="fw-bold mb-0">Administración</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Código</th>
                  <th>Cuenta</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map(account => `
                  <tr>
                    <td>${account.code}</td>
                    <td>${account.name}</td>
                    <td>${account.type}</td>
                    <td><span class="badge ${account.active ? 'bg-success' : 'bg-secondary'}">${account.active ? 'Activa' : 'Inactiva'}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary">Editar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Nueva Cuenta -->
      <div class="modal fade" id="newAccountModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nueva cuenta</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="newAccountForm">
                <div class="mb-3">
                  <label class="form-label">Código</label>
                  <input type="text" class="form-control" id="accountCode" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Cuenta</label>
                  <input type="text" class="form-control" id="accountName" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Tipo</label>
                  <select class="form-select" id="accountType">
                    <option value="ACTIVO">Activo</option>
                    <option value="PASIVO">Pasivo</option>
                    <option value="PATRIMONIO">Patrimonio</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSaveAccount">Guardar cuenta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSettingsEvents() {
  document.getElementById('btnSaveAccount').addEventListener('click', async () => {
    const data = {
      code: document.getElementById('accountCode').value,
      name: document.getElementById('accountName').value,
      type: document.getElementById('accountType').value,
    };

    try {
      await settingsService.createAccount(data);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  });

  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
    e.target.nextElementSibling.textContent = e.target.checked ? 'Activado' : 'Desactivado';
  });
}

Paso 3: añadir estilos de modo oscuro en main.css
Añade esto al final de src/css/main.css:

body.dark-mode {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

body.dark-mode .card {
  background-color: #2d2d2d;
  color: #f5f5f5;
}

body.dark-mode .table {
  color: #f5f5f5;
}

body.dark-mode .table-light {
  background-color: #3d3d3d;
  color: #f5f5f5;
}

Paso 4: integrar Configuración en main.js
Ajusta src/js/main.js para que cargue el módulo de Configuración cuando se hace clic en el menú.

import { renderSettings, initSettingsEvents } from './modules/settings/settings.js';

// Dentro de initSidebarEvents, añade:
if (module === 'configuracion') {
  content.innerHTML = await renderSettings();
  initSettingsEvents();
}

## 6. Cómo validar que quedó bien
En este sprint no hay pruebas automatizadas. La validación consiste en:
- hacer clic en "Configuración" en el Sidebar y verificar que se muestre la tabla de catálogo;
- hacer clic en "Nueva cuenta" y verificar que se abra el modal con el formulario;
- registrar una cuenta y verificar que se guarde en el backend;
- activar el modo oscuro y verificar que cambie la apariencia.

Antes de cerrar el tutorial, confirma esta lista:
- existe src/js/modules/settings/settings.js;
- existe src/js/modules/settings/settingsService.js;
- main.js carga el módulo de Configuración al hacer clic en el menú;
- npm run dev funciona y muestra el módulo de Configuración completo.

## 7. Errores comunes
Los errores más frecuentes en este tutorial son:
- no validar el código de cuenta;
- permitir duplicar códigos;
- no manejar errores de red al guardar;
- olvidar actualizar la lista después de crear/editar.

## 8. Guardar los cambios en Git
Antes de crear el commit, revisa git status para confirmar qué archivos se van a guardar.
git status
git add .
git commit -m "Sprint 9: módulo de configuración y catálogo de cuentas"
git push

## 9. Resultado esperado
Al terminar este Sprint 9 tendrás:
- el módulo de Configuración completamente funcional;
- formulario de nueva cuenta contable con validaciones;
- tabla de catálogo con datos reales del backend;
- toggle de modo oscuro/claro funcional.

