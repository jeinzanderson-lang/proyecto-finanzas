// src/js/router/guards.js
import { storage } from '../utils/storage.js';
import { canAccessModule, getUserRole } from '../auth/permissions.js';

/**
 * Guard: Verifica que el usuario esté autenticado
 * Si no hay token, redirige al login
 */
export function authGuard(module) {
  if (!storage.isAuthenticated()) {
    return {
      allowed: false,
      redirectTo: 'login',
      message: 'Debes iniciar sesión para acceder a esta sección.',
    };
  }
  return { allowed: true };
}

/**
 * Guard: Verifica que el usuario tenga permisos para el módulo
 */
export function moduleGuard(module) {
  const authResult = authGuard(module);
  if (!authResult.allowed) return authResult;

  if (!canAccessModule(module)) {
    const role = getUserRole();
    return {
      allowed: false,
      redirectTo: 'forbidden',
      message: `Tu rol (${role}) no tiene permisos para acceder a "${module}".`,
    };
  }

  return { allowed: true };
}

/**
 * Guard: Verifica que el usuario sea ADMIN
 */
export function adminGuard() {
  const authResult = authGuard('admin');
  if (!authResult.allowed) return authResult;

  if (getUserRole() !== 'ADMIN') {
    return {
      allowed: false,
      redirectTo: 'forbidden',
      message: 'Esta sección solo está disponible para administradores.',
    };
  }

  return { allowed: true };
}
