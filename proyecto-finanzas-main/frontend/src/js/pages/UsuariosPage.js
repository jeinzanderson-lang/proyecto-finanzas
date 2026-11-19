// src/js/pages/UsuariosPage.js
import { usuariosService } from '../services/usuarios.service.js';
import * as bootstrap from 'bootstrap';

let modalUsuarioInstance = null;

export function renderUsuariosPage() {
  const usuarios = usuariosService.getAll();
  const estadisticas = usuariosService.getEstadisticas();
  const roles = usuariosService.getRolesDisponibles();

  const usuariosRows = renderTablaUsuarios(usuarios);
  const rolesOptions = roles.map(r => `<option value="${r}">${r}</option>`).join('');

  return `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">Gestión de Usuarios</h2>
          <p class="text-muted mb-0 small">Administra los usuarios y roles del sistema</p>
        </div>
        <button class="btn btn-primary" id="btnNuevoUsuario">
          <i class="bi bi-person-plus me-2"></i>Nuevo Usuario
        </button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Total Usuarios</h6>
              <h3 class="fw-bold mb-0">${estadisticas.total}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Usuarios Activos</h6>
              <h3 class="fw-bold mb-0 text-success">${estadisticas.activos}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Administradores</h6>
              <h3 class="fw-bold mb-0 text-danger">${estadisticas.admins}</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="text-muted small mb-1">Roles Configurados</h6>
              <h3 class="fw-bold mb-0 text-primary">${estadisticas.roles}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <input type="text" class="form-control" id="buscarUsuario" placeholder="🔍 Buscar por nombre, usuario o email...">
            </div>
            <div class="col-12 col-md-3">
              <select class="form-select" id="filtroRole">
                <option value="">Todos los roles</option>
                ${rolesOptions}
              </select>
            </div>
            <div class="col-12 col-md-3">
              <select class="form-select" id="filtroEstado">
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div class="col-12 col-md-2">
              <button class="btn btn-outline-secondary w-100" id="btnLimpiar">
                <i class="bi bi-x-circle"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="table-light">
                <tr>
                  <th>Usuario</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="tablaUsuariosBody">
                ${usuariosRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="modalUsuario" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title fw-bold" id="modalTitulo">Nuevo Usuario</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="formUsuario">
                <input type="hidden" id="usuarioId">
                <div class="row g-3">
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Nombre de Usuario</label>
                    <input type="text" class="form-control" id="usuarioUsername" required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Nombre Completo</label>
                    <input type="text" class="form-control" id="usuarioFullName" required>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-bold">Correo Electrónico</label>
                    <input type="email" class="form-control" id="usuarioEmail" required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Rol</label>
                    <select class="form-select" id="usuarioRole" required>
                      ${rolesOptions}
                    </select>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label fw-bold">Estado</label>
                    <select class="form-select" id="usuarioEstado" required>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnGuardarUsuario">
                <i class="bi bi-check-circle me-2"></i>Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTablaUsuarios(usuarios) {
  return usuarios.map(u => {
    const estadoColor = u.estado === 'Activo' ? 'success' : 'secondary';
    const roleColor = u.role === 'ADMIN' ? 'danger' : u.role === 'CONTADOR' ? 'primary' : u.role === 'VENDEDOR' ? 'success' : 'warning';
    return `
      <tr>
        <td><span class="fw-bold text-primary">@${u.username}</span></td>
        <td>${u.full_name}</td>
        <td>${u.email}</td>
        <td><span class="badge bg-${roleColor}-subtle text-${roleColor}">${u.role}</span></td>
        <td><span class="badge bg-${estadoColor}-subtle text-${estadoColor}">${u.estado}</span></td>
        <td class="text-muted small">${u.ultimoAcceso}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1 btn-editar-user" data-id="${u.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar-user" data-id="${u.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function aplicarFiltros() {
  const busqueda = document.getElementById('buscarUsuario')?.value || '';
  const role = document.getElementById('filtroRole')?.value || '';
  const estado = document.getElementById('filtroEstado')?.value || '';

  const filtros = {};
  if (busqueda) filtros.busqueda = busqueda;
  if (role) filtros.role = role;
  if (estado) filtros.estado = estado;

  const usuariosFiltrados = usuariosService.getAll(filtros);
  const tbody = document.getElementById('tablaUsuariosBody');
  if (tbody) {
    tbody.innerHTML = renderTablaUsuarios(usuariosFiltrados);
    adjuntarEventosTabla();
  }
}

function adjuntarEventosTabla() {
  document.querySelectorAll('.btn-editar-user').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const usuario = usuariosService.getById(id);
      if (usuario) {
        document.getElementById('modalTitulo').textContent = 'Editar Usuario';
        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById('usuarioUsername').value = usuario.username;
        document.getElementById('usuarioFullName').value = usuario.full_name;
        document.getElementById('usuarioEmail').value = usuario.email;
        document.getElementById('usuarioRole').value = usuario.role;
        document.getElementById('usuarioEstado').value = usuario.estado;
        if (!modalUsuarioInstance) {
          modalUsuarioInstance = new bootstrap.Modal(document.getElementById('modalUsuario'));
        }
        modalUsuarioInstance.show();
      }
    });
  });

  document.querySelectorAll('.btn-eliminar-user').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (confirm('¿Estás seguro de eliminar este usuario?')) {
        usuariosService.delete(id);
        aplicarFiltros();
        actualizarEstadisticas();
      }
    });
  });
}

function actualizarEstadisticas() {
  const estadisticas = usuariosService.getEstadisticas();
  const cards = document.querySelectorAll('.row.g-3.mb-4 .card-body h3');
  if (cards.length === 4) {
    cards[0].textContent = estadisticas.total;
    cards[1].textContent = estadisticas.activos;
    cards[2].textContent = estadisticas.admins;
    cards[3].textContent = estadisticas.roles;
  }
}

export function initUsuariosEvents() {
  const btnNuevo = document.getElementById('btnNuevoUsuario');
  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
      document.getElementById('modalTitulo').textContent = 'Nuevo Usuario';
      document.getElementById('formUsuario').reset();
      document.getElementById('usuarioId').value = '';
      if (!modalUsuarioInstance) {
        modalUsuarioInstance = new bootstrap.Modal(document.getElementById('modalUsuario'));
      }
      modalUsuarioInstance.show();
    });
  }

  const btnGuardar = document.getElementById('btnGuardarUsuario');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
      const id = document.getElementById('usuarioId').value;
      const datos = {
        username: document.getElementById('usuarioUsername').value,
        full_name: document.getElementById('usuarioFullName').value,
        email: document.getElementById('usuarioEmail').value,
        role: document.getElementById('usuarioRole').value,
        estado: document.getElementById('usuarioEstado').value,
      };

      if (id) {
        usuariosService.update(parseInt(id), datos);
      } else {
        usuariosService.create(datos);
      }

      if (modalUsuarioInstance) {
        modalUsuarioInstance.hide();
      }

      aplicarFiltros();
      actualizarEstadisticas();
    });
  }

  adjuntarEventosTabla();

  const buscarInput = document.getElementById('buscarUsuario');
  if (buscarInput) { buscarInput.addEventListener('input', aplicarFiltros); }

  const filtroRole = document.getElementById('filtroRole');
  if (filtroRole) { filtroRole.addEventListener('change', aplicarFiltros); }

  const filtroEstado = document.getElementById('filtroEstado');
  if (filtroEstado) { filtroEstado.addEventListener('change', aplicarFiltros); }

  const btnLimpiar = document.getElementById('btnLimpiar');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      document.getElementById('buscarUsuario').value = '';
      document.getElementById('filtroRole').value = '';
      document.getElementById('filtroEstado').value = '';
      aplicarFiltros();
    });
  }
}