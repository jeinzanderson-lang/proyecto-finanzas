// src/js/auth/permissions.js
import { storage } from '../utils/storage.js';

// Solo 2 roles disponibles
export const ROLES = {
  ADMIN: 'ADMIN',
  VENDEDOR: 'VENDEDOR',
};

// Módulos permitidos por rol
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['dashboard', 'ventas', 'gastos', 'inventario', 'reportes', 'configuracion', 'usuarios'],
  [ROLES.VENDEDOR]: ['dashboard', 'ventas', 'inventario'],
};

export function getUserRole() {
  const user = storage.getUser();
  return user?.role || null;
}

export function hasRole(role) {
  return getUserRole() === role;
}

export function hasAnyRole(roles) {
  const userRole = getUserRole();
  return roles.includes(userRole);
}

export function canAccessModule(module) {
  const userRole = getUserRole();
  if (!userRole) return false;
  const allowedModules = ROLE_PERMISSIONS[userRole] || [];
  return allowedModules.includes(module);
}

export function getAccessibleModules() {
  const userRole = getUserRole();
  if (!userRole) return [];
  return ROLE_PERMISSIONS[userRole] || [];
}