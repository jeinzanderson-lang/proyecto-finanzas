## 1. Objetivo
Unificar todos los módulos, optimizar el rendimiento, mejorar la experiencia de usuario y preparar el proyecto para producción, basándose en el diseño original del HTML de AG Services.

## 2. Alcance de este sprint
En este sprint se realiza la integración final. Se implementa:
- manejo global de errores (toast/notificaciones);
- estados de carga (spinners) en los botones;
- validación final de sesión expirada (401);
- lazy loading de módulos;
- optimización del build de producción;
- revisión de responsividad en todos los módulos.

No se implementa:
- nuevas funcionalidades;
- cambios en la base de datos;
- migración a producción.

## 3. Qué se instala
No se instalan nuevas dependencias. Se usan:
Fetch API nativa del navegador;
Bootstrap 5.3 y Bootstrap Icons (ya instalados).

## 4. Archivos que se crean o ajustan
Al terminar este sprint, estos archivos deben existir:
src/js/utils/errorHandler.js;
src/js/utils/loadingManager.js;
src/js/main.js (se ajusta para integrar todo);
src/css/main.css (se añaden estilos para toasts y spinners).
Estructura esperada:

frontend/
└── src/
    ├── css/
    │   └── main.css
    └── js/
        ├── auth/
        ├── components/
        ├── modules/
        └── utils/
            ├── apiClient.js
            ├── errorHandler.js
            ├── loadingManager.js
            ├── roleManager.js
            └── tokenManager.js

5. Paso a paso
Paso 1: crear el manejador de errores (errorHandler.js)
Crea src/js/utils/errorHandler.js para centralizar el manejo de errores.

export function showError(message, duration = 5000) {
  const toast = document.createElement('div');
  toast.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  toast.innerHTML = `
    <div class="toast show" role="alert">
      <div class="toast-header bg-danger text-white">
        <strong class="me-auto">Error</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${message}</div>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

export function showSuccess(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  toast.innerHTML = `
    <div class="toast show" role="alert">
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">Éxito</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${message}</div>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

Paso 2: crear el manejador de carga (loadingManager.js)
Crea src/js/utils/loadingManager.js para gestionar los estados de carga.

export function showLoading(element) {
  element.disabled = true;
  element.dataset.originalText = element.innerHTML;
  element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cargando...';
}

export function hideLoading(element) {
  element.disabled = false;
  element.innerHTML = element.dataset.originalText || 'Guardar';
}

Paso 3: ajustar apiClient.js para manejar errores 401
Modifica src/js/utils/apiClient.js para redirigir al login si el token expira.

const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('ag_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('ag_token');
    localStorage.removeItem('ag_user');
    window.location.reload();
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en el servidor' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

Paso 4: añadir estilos de toasts en main.css
Añade esto al final de src/css/main.css:

.toast-container {
  z-index: 9999;
}

.toast {
  min-width: 300px;
}


Paso 5: integrar todo en main.js
Ajusta src/js/main.js para usar los nuevos manejadores de errores y carga.

import { showError, showSuccess } from './utils/errorHandler.js';
import { showLoading, hideLoading } from './utils/loadingManager.js';

// En cada módulo, reemplaza los alert() por showError() y showSuccess()
// Ejemplo en sales.js:
try {
  showLoading(btn);
  await salesService.create(data);
  showSuccess('Venta registrada correctamente');
  window.location.reload();
} catch (error) {
  showError(error.message);
} finally {
  hideLoading(btn);
}

## 6. Cómo validar que quedó bien
En este sprint no hay pruebas automatizadas. La validación consiste en:
- probar todos los módulos con diferentes roles;
- verificar que los errores se muestren como toasts en lugar de alerts;
- verificar que los botones muestren spinners durante las peticiones;
- simular una sesión expirada y verificar que redirija al login;
- ejecutar npm run build y verificar que genere dist/ sin errores;
- ejecutar npm run preview y verificar que la app funcione correctamente.

Antes de cerrar el tutorial, confirma esta lista:
- existe src/js/utils/errorHandler.js;
- existe src/js/utils/loadingManager.js;
- apiClient.js maneja errores 401;
- todos los módulos usan showError() y showSuccess() en lugar de alert();
- npm run build funciona sin errores;
- npm run preview funciona correctamente.

## 7. Errores comunes
Los errores más frecuentes en este tutorial son:
- olvidar probar con diferentes roles;
- no manejar errores de red en alguna petición;
- dejar console.log en código de producción;
- no optimizar imágenes o recursos.

## 8. Guardar los cambios en Git
Antes de crear el commit, revisa git status para confirmar qué archivos se van a guardar.
git status
git add .
git commit -m "Sprint 10: integración final y optimización"
git push

## 9. Resultado esperado
Al terminar este Sprint 10 tendrás:
- todos los módulos integrados y funcionales;
- manejo global de errores con toasts;
- estados de carga en todos los botones;
- validación de sesión expirada;
- build de producción optimizado;
- la aplicación lista para desplegar en producción.