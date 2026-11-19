// src/js/pages/LoginPage.js
import { sessionService } from '../auth/session.service.js';

export function renderLoginPage() {
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <main class="login-shell d-flex align-items-center justify-content-center" style="min-height: 100vh; background: #f5f7fb;">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-5">
            <div class="card border-0 shadow-lg">
              <div class="card-body p-4 p-md-5">
                <div class="text-center mb-4">
                  <i class="bi bi-calculator-fill fs-1 text-primary"></i>
                  <h2 class="h4 mt-3 fw-bold">Sistema Contable</h2>
                  <p class="text-muted small">Números claros, negocio exitoso.</p>
                </div>
                
                <p class="text-center mb-4">Inicia sesión para acceder al panel financiero.</p>
                
                <form id="loginForm">
                  <div class="mb-3">
                    <label for="username" class="form-label">Usuario</label>
                    <input type="text" class="form-control" id="username" required>
                  </div>
                  <div class="mb-4">
                    <label for="password" class="form-label">Contraseña</label>
                    <input type="password" class="form-control" id="password" required>
                  </div>
                  <div id="loginError" class="alert alert-danger d-none" role="alert"></div>
                  <button type="submit" id="btnLogin" class="btn btn-primary w-100 py-2 fw-bold">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

  bindLoginEvents();
}

function bindLoginEvents() {
  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('loginError');
  const btn = document.getElementById('btnLogin');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Estado de carga
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Validando...';
    errorDiv.classList.add('d-none');

    try {
      await sessionService.login(username, password);
      window.location.reload(); // Recarga para ir al Dashboard/Sidebar
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.classList.remove('d-none');
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión';
    }
  });
}