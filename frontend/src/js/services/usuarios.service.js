// src/js/services/usuarios.service.js

let usuariosMock = [
  { id: 1, username: 'admin', full_name: 'Administrador Principal', email: 'admin@agservices.com', role: 'ADMIN', estado: 'Activo', ultimoAcceso: '2026-11-05 08:30' },
  { id: 2, username: 'juan.ventas', full_name: 'Juan Pérez', email: 'juan@agservices.com', role: 'VENDEDOR', estado: 'Activo', ultimoAcceso: '2026-11-03 09:15' },
  { id: 3, username: 'ana.ventas', full_name: 'Ana Rodríguez', email: 'ana@agservices.com', role: 'VENDEDOR', estado: 'Activo', ultimoAcceso: '2026-11-05 10:45' },
  { id: 4, username: 'pedro.ventas', full_name: 'Pedro Gómez', email: 'pedro@agservices.com', role: 'VENDEDOR', estado: 'Inactivo', ultimoAcceso: '2026-10-20 14:00' },
];

let nextId = 5;

export const usuariosService = {
  getAll(filtros = {}) {
    let resultado = [...usuariosMock];

    if (filtros.role) {
      resultado = resultado.filter(u => u.role === filtros.role);
    }

    if (filtros.estado) {
      resultado = resultado.filter(u => u.estado === filtros.estado);
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(u =>
        u.full_name.toLowerCase().includes(busqueda) ||
        u.username.toLowerCase().includes(busqueda) ||
        u.email.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  },

  getById(id) {
    return usuariosMock.find(u => u.id === id) || null;
  },

  create(usuario) {
    const nuevoUsuario = {
      id: nextId++,
      estado: 'Activo',
      ultimoAcceso: 'Nunca',
      ...usuario,
    };
    usuariosMock.push(nuevoUsuario);
    return nuevoUsuario;
  },

  update(id, datosActualizados) {
    const index = usuariosMock.findIndex(u => u.id === id);
    if (index === -1) return null;
    usuariosMock[index] = { ...usuariosMock[index], ...datosActualizados };
    return usuariosMock[index];
  },

  delete(id) {
    const index = usuariosMock.findIndex(u => u.id === id);
    if (index === -1) return false;
    usuariosMock.splice(index, 1);
    return true;
  },

  getEstadisticas() {
    const total = usuariosMock.length;
    const activos = usuariosMock.filter(u => u.estado === 'Activo').length;
    const admins = usuariosMock.filter(u => u.role === 'ADMIN').length;
    const roles = [...new Set(usuariosMock.map(u => u.role))].length;
    return { total, activos, admins, roles };
  },

  getRolesDisponibles() {
  return ['ADMIN', 'VENDEDOR'];
 }
};