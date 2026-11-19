// src/js/pages/ConfiguracionPage.js

export function renderConfiguracionPage() {
  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Configuración del Sistema</h2>
          <p class="text-muted mb-0 small">Ajustes generales y preferencias de AG Services</p>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" id="configTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="empresa-tab" data-bs-toggle="tab" data-bs-target="#empresa" type="button">🏢 Perfil de Empresa</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="sistema-tab" data-bs-toggle="tab" data-bs-target="#sistema" type="button">⚙️ Preferencias</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="seguridad-tab" data-bs-toggle="tab" data-bs-target="#seguridad" type="button">🔒 Seguridad</button>
        </li>
      </ul>

      <div class="tab-content" id="configTabsContent">
        
        <div class="tab-pane fade show active" id="empresa" role="tabpanel">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <form id="formEmpresa">
                <div class="row g-3">
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Nombre de la Empresa</label>
                    <input type="text" class="form-control" value="AG Services S.A.S." required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">NIT / RUT</label>
                    <input type="text" class="form-control" value="900.123.456-7" required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Correo de Contacto</label>
                    <input type="email" class="form-control" value="contacto@agservices.com" required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Teléfono</label>
                    <input type="text" class="form-control" value="+57 300 123 4567">
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-bold">Dirección</label>
                    <input type="text" class="form-control" value="Calle 123 # 45-67, Bogotá, Colombia">
                  </div>
                </div>
                <div class="mt-4 text-end">
                  <button type="button" class="btn btn-primary btn-guardar-empresa">
                    <i class="bi bi-save me-2"></i>Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="sistema" role="tabpanel">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row g-4">
                <div class="col-12 col-md-6">
                  <label class="form-label fw-bold">Moneda del Sistema</label>
                  <select class="form-select">
                    <option value="COP" selected>Peso Colombiano (COP)</option>
                    <option value="USD">Dólar Americano (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-bold">Formato de Fecha</label>
                  <select class="form-select">
                    <option value="DD/MM/YYYY" selected>DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="switchNotif" checked>
                    <label class="form-check-label fw-bold" for="switchNotif">Recibir notificaciones de stock bajo</label>
                  </div>
                  <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" id="switchEmail" checked>
                    <label class="form-check-label fw-bold" for="switchEmail">Enviar reportes diarios por correo</label>
                  </div>
                </div>
              </div>
              <div class="mt-4 text-end">
                <button type="button" class="btn btn-primary btn-guardar-sistema">
                  <i class="bi bi-save me-2"></i>Guardar Preferencias
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="seguridad" role="tabpanel">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="fw-bold mb-3">Cambiar Contraseña de Administrador</h5>
              <form id="formPassword">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label fw-bold">Contraseña Actual</label>
                    <input type="password" class="form-control" required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Nueva Contraseña</label>
                    <input type="password" class="form-control" required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Confirmar Nueva Contraseña</label>
                    <input type="password" class="form-control" required>
                  </div>
                </div>
                <div class="mt-4 text-end">
                  <button type="button" class="btn btn-danger btn-cambiar-pass">
                    <i class="bi bi-shield-lock me-2"></i>Actualizar Contraseña
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function initConfiguracionEvents() {
  const btnEmpresa = document.querySelector('.btn-guardar-empresa');
  if (btnEmpresa) {
    btnEmpresa.addEventListener('click', () => {
      alert('✅ Datos de la empresa actualizados correctamente.');
    });
  }

  const btnSistema = document.querySelector('.btn-guardar-sistema');
  if (btnSistema) {
    btnSistema.addEventListener('click', () => {
      alert('✅ Preferencias del sistema guardadas.');
    });
  }

  const btnPass = document.querySelector('.btn-cambiar-pass');
  if (btnPass) {
    btnPass.addEventListener('click', () => {
      alert('🔒 Contraseña de administrador actualizada con éxito.');
      document.getElementById('formPassword').reset();
    });
  }
}