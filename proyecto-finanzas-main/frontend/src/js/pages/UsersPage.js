// src/js/pages/UsersPage.js

// Datos de ejemplo (se reemplazarán con datos reales del backend en el Sprint 10)
const mockUsers = [
  { id: 1, username: 'admin', full_name: 'Administrador Principal', role: 'ADMIN', email: 'admin@agservices.com', active: true },
  { id: 2, username: 'contador1', full_name: 'María García', role: 'CONTADOR', email: 'maria@agservices.com', active: true },
  { id: 3, username: 'vendedor1', full_name: 'Juan Pérez', role: 'VENDEDOR', email: 'juan@agservices.com', active: true },
  { id: 4, username: 'bodeguero1', full_name: 'Carlos López', role: 'BODEGUERO', email: 'carlos@agservices.com', active: false },
];

export function renderUsersPage() {
  const usersRows = mockUsers.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.full_name}</td>
      <td>${user.email}</td>
      <td><span class="badge bg-${user.role === 'ADMIN' ? 'danger' : user.role === 'CONTADOR' ? 'primary' : user.role === 'VENDEDOR' ? 'success' : 'warning'}">${user.role}</span></td>
      <td><span class="badge bg-${user.active ? 'success' : 'secondary'}">${user.active ? 'Activo' : 'Inactivo'}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 fw-bold mb-0">Gestión de Usuarios</h2>
        <button class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>Nuevo Usuario
        </button>
      </div>
      
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${usersRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="alert alert-info mt-3">
        <i class="bi bi-info-circle me-2"></i>
        <strong>Nota:</strong> Esta es una vista de prueba con datos simulados. 
        La funcionalidad completa (crear, editar, eliminar usuarios) se implementará cuando el backend esté disponible.
      </div>
    </div>
  `;
}
