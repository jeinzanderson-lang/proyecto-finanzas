// src/js/auth/permissions.js
import { storage } from '../utils/storage.js';

// Definición de roles y sus permisos
export const ROLES = {
  ADMIN: 'ADMIN',
  CONTADOR: 'CONTADOR',
  VENDEDOR: 'VENDEDOR',
  BODEGUERO: 'BODEGUERO',
};

// Módulos permitidos por rol
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['dashboard', 'ventas', 'gastos', 'inventario', 'reportes', 'configuracion', 'usuarios'],
  [ROLES.CONTADOR]: ['dashboard', 'ventas', 'gastos', 'inventario', 'reportes', 'configuracion'],
  [ROLES.VENDEDOR]: ['dashboard', 'ventas', 'inventario'],
  [ROLES.BODEGUERO]: ['dashboard', 'inventario'],
};

/**
 * Obtiene el rol del usuario actual
 */
export function getUserRole() {
  const user = storage.getUser();
  return user?.role || null;
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export function hasRole(role) {
  return getUserRole() === role;
}

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 */
export function hasAnyRole(roles) {
  const userRole = getUserRole();
  return roles.includes(userRole);
}

/**
 * Verifica si el usuario puede acceder a un módulo
 */
export function canAccessModule(module) {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  const allowedModules = ROLE_PERMISSIONS[userRole] || [];
  return allowedModules.includes(module);
}

/**
 * Filtra los módulos del menú según el rol del usuario
 */
export function getAccessibleModules() {
  const userRole = getUserRole();
  if (!userRole) return [];
  
  return ROLE_PERMISSIONS[userRole] || [];
}
