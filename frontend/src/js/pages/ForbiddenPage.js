// src/js/pages/ForbiddenPage.js

export function renderForbiddenPage(message = 'No tienes permisos para acceder a esta sección.') {
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <div class="d-flex min-vh-100">
      <div id="sidebar-container"></div>
      <main class="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
        <div class="text-center p-5">
          <i class="bi bi-shield-lock-fill text-danger" style="font-size: 5rem;"></i>
          <h1 class="h2 mt-3 fw-bold text-danger">Acceso Denegado (403)</h1>
          <p class="text-muted mt-3 fs-5">${message}</p>
          <a href="#dashboard" class="btn btn-primary mt-3">
            <i class="bi bi-arrow-left me-2"></i>Volver al Dashboard
          </a>
        </div>
      </main>
    </div>
  `;
}
