// src/js/pages/LoginPage.js
import { sessionService } from '../auth/session.service.js';
import { navigateTo } from '../router/routes.js';
import { showToast } from '../utils/toast.js';

export function renderLoginPage() {
  return `
    <div class="login-container">
      <div class="login-card">
        <div class="login-logo">
          <div class="logo-text">AG <span>Services</span></div>
          <div class="logo-subtitle">Sistema Contable y Financiero</div>
        </div>

        <div class="mb-4">
          <label class="form-label">Tipo de Usuario</label>
          <div class="role-selector">
            <div class="role-option selected" data-role="ADMIN" id="roleAdmin">
              <i class="bi bi-shield-lock"></i>
              <div class="role-name">Administrador</div>
            </div>
            <div class="role-option" data-role="VENDEDOR" id="roleVendedor">
              <i class="bi bi-person-badge"></i>
              <div class="role-name">Vendedor</div>
            </div>
          </div>
        </div>

        <form id="loginForm" autocomplete="off" novalidate>
          <div class="mb-3">
            <label class="form-label">Usuario</label>
            <input type="text" class="form-control" id="loginUsername" 
                   placeholder="Ingresa tu usuario" required autocomplete="off">
          </div>

          <div class="mb-4">
            <label class="form-label">Contraseña</label>
            <div class="input-group">
              <input type="password" class="form-control" id="loginPassword" 
                     placeholder="Ingresa tu contraseña" required autocomplete="new-password">
              <button type="button" class="btn btn-outline-secondary" id="btnVerPassword" tabindex="-1">
                <i class="bi bi-eye" id="iconoPassword"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2">
            <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
          </button>
        </form>

        <div class="text-center mt-4">
          <small class="text-muted">
            <i class="bi bi-info-circle me-1"></i>
            Demo: admin / AgS2026! o vendedor / Ven2026!
          </small>
        </div>
      </div>
    </div>
  `;
}

export function initLoginEvents() {
  let selectedRole = 'ADMIN';

  const roleAdmin = document.getElementById('roleAdmin');
  const roleVendedor = document.getElementById('roleVendedor');

  if (roleAdmin) {
    roleAdmin.addEventListener('click', () => {
      selectedRole = 'ADMIN';
      roleAdmin.classList.add('selected');
      roleVendedor.classList.remove('selected');
    });
  }

  if (roleVendedor) {
    roleVendedor.addEventListener('click', () => {
      selectedRole = 'VENDEDOR';
      roleVendedor.classList.add('selected');
      roleAdmin.classList.remove('selected');
    });
  }

  // Botón ver/ocultar contraseña
  const btnVerPassword = document.getElementById('btnVerPassword');
  const loginPassword = document.getElementById('loginPassword');
  const iconoPassword = document.getElementById('iconoPassword');

  if (btnVerPassword && loginPassword && iconoPassword) {
    btnVerPassword.addEventListener('click', () => {
      const esPassword = loginPassword.type === 'password';
      loginPassword.type = esPassword ? 'text' : 'password';
      iconoPassword.className = esPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
    });
  }

  // Formulario de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      // Validaciones
      if (!username && !password) {
        showToast('⚠️ Debes ingresar usuario y contraseña', 'warning');
        return;
      }
      if (!username) {
        showToast('⚠️ Debes ingresar un usuario', 'warning');
        return;
      }
      if (!password) {
        showToast('⚠️ Debes ingresar una contraseña', 'warning');
        return;
      }

      // Validación de credenciales
      const credencialesValidas = 
        (username === 'admin' && password === 'AgS2026!') ||
        (username === 'vendedor' && password === 'Ven2026!');

      if (!credencialesValidas) {
        showToast('❌ Usuario o contraseña incorrectos', 'error');
        return;
      }

      // Crear usuario
      const user = {
        username: username,
        full_name: selectedRole === 'ADMIN' ? 'Administrador Principal' : 'Vendedor',
        role: selectedRole,
      };

      // Guardar sesión
      sessionService.login(user);
      showToast('✅ Bienvenido, ' + user.full_name, 'success');

      // Navegar al dashboard
      navigateTo('dashboard');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  }
}