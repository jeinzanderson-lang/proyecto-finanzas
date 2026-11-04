# Tutorial 2 — Sprint 2: Usuarios, autenticación y sesión
## 1. Objetivo
Construir la pantalla de inicio de sesión y el flujo de autenticación del sistema contable AG Services, conectando el formulario con el backend para obtener el token JWT y almacenar la sesión del usuario.

## 2. Alcance de este sprint
En este sprint se implementa:
- la pantalla de Login con los campos Usuario y Contraseña;
- la conexión con el endpoint /api/v1/auth/login del backend;
- el almacenamiento del token JWT y los datos del usuario en localStorage;
- la redirección al Dashboard tras un login exitoso;
- la función de cerrar sesión (logout).

No se implementa todavía:
- roles y permisos en el menú;
- dashboard con datos reales;
- módulos contables (ventas, gastos, etc.);
- recuperación de contraseña;
- registro de nuevos usuarios desde el frontend.

## 3. Qué se instala
No se instalan nuevas dependencias. Se usan:
Fetch API nativa del navegador;
localStorage para persistencia de sesión;
Bootstrap 5.3 y Bootstrap Icons (ya instalados en el Sprint 1).

## 4. Archivos que se crean o ajustan
Al terminar este sprint, estos archivos deben existir:
src/js/auth/login.js;
src/js/auth/authService.js;
src/js/utils/apiClient.js;
src/js/utils/tokenManager.js;
src/js/main.js (se ajusta para renderizar el login);
src/css/main.css (se añaden estilos para el login).
Estructura esperada:

frontend/
└── src/
    ├── css/
    │   └── main.css
    ── js/
        ├── auth/
        │   ├── authService.js
        │   └── login.js
        ├── utils/
        │   ├── apiClient.js
        │   └── tokenManager.js
        └── main.js

## 5. Paso a paso
Paso 1: crear las carpetas de autenticación y utilidades
Dentro de src/js, crea las carpetas necesarias:
mkdir src/js/auth
mkdir src/js/utils

Paso 2: crear el cliente HTTP (apiClient.js)
Crea src/js/utils/apiClient.js. Este archivo centralizará las peticiones al backend y añadirá automáticamente el token JWT en el header Authorization cuando exista.

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

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en el servidor' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

Paso 3: crear el gestor de tokens (tokenManager.js)
Crea src/js/utils/tokenManager.js para manejar el almacenamiento y la lectura de la sesión.

export const tokenManager = {
  setSession(token, user) {
    localStorage.setItem('ag_token', token);
    localStorage.setItem('ag_user', JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem('ag_token');
  },

  getUser() {
    const user = localStorage.getItem('ag_user');
    return user ? JSON.parse(user) : null;
  },

  clearSession() {
    localStorage.removeItem('ag_token');
    localStorage.removeItem('ag_user');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

Paso 4: crear el servicio de autenticación (authService.js)
Crea src/js/auth/authService.js para encapsular la lógica de llamada al backend.

import { apiRequest } from '../utils/apiClient.js';
import { tokenManager } from '../utils/tokenManager.js';

export const authService = {
  async login(username, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (data.token && data.user) {
      tokenManager.setSession(data.token, data.user);
    }

    return data;
  },

  logout() {
    tokenManager.clearSession();
  }
};

Paso 5: crear la vista de Login (login.js)
Crea src/js/auth/login.js. Este archivo renderizará el formulario basándose en el HTML de AG Services.

import { authService } from './authService.js';

export function renderLogin() {
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <main class="login-shell">
      <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
          <div class="col-12 col-md-8 col-lg-5">
            <div class="card border-0 shadow-lg login-card">
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
                  <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión
                  </button>
                </form>
                
                <div class="text-center mt-4">
                  <small class="text-muted">
                    Diseño responsivo para escritorio, tablet y celular.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

  document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  const btn = e.target.querySelector('button');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Validando...';
  errorDiv.classList.add('d-none');

  try {
    await authService.login(username, password);
    window.location.reload(); 
  } catch (error) {
    errorDiv.textContent = error.message || 'Credenciales incorrectas';
    errorDiv.classList.remove('d-none');
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión';
  }
}

Paso 6: ajustar main.js para mostrar el Login
Modifica src/js/main.js para que detecte si hay sesión. Si no hay, muestra el Login.

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';
import { renderLogin } from './auth/login.js';
import { tokenManager } from './utils/tokenManager.js';

function initApp() {
  if (!tokenManager.isAuthenticated()) {
    renderLogin();
  } else {
    document.querySelector('#app').innerHTML = '<h1>Dashboard (Próximamente)</h1>';
  }
}

document.addEventListener('DOMContentLoaded', initApp);

Paso 7: añadir estilos de Login en main.css
Añade esto al final de src/css/main.css:

.login-shell {
  background: linear-gradient(135deg, #f5f7fb 0%, #e4e8f0 100%);
}

.login-card {
  border-radius: 1rem;
}

## 6. Cómo validar que quedó bien
En este sprint no hay pruebas automatizadas. La validación consiste en:
- ejecutar npm run dev;
- ver la pantalla de Login con el logo de calculadora, el título "Sistema Contable" y el texto "Números claros, negocio exitoso";
- intentar iniciar sesión con datos incorrectos y verificar que aparezca la alerta roja de error;
- iniciar sesión con datos correctos (cuando el backend esté listo) y verificar que el token se guarde en el localStorage del navegador.

Antes de cerrar el tutorial, confirma esta lista:
- existe src/js/auth/login.js;
- existe src/js/auth/authService.js;
- existe src/js/utils/apiClient.js;
- existe src/js/utils/tokenManager.js;
- main.js detecta si hay sesión y muestra el Login si no la hay;
- npm run dev funciona y muestra la pantalla de Login.

## 7. Errores comunes
Los errores más frecuentes en este tutorial son:
- olvidar importar bootstrap.bundle.min.js (necesario para los componentes interactivos);
- no usar import.meta.env.VITE_API_URL y hardcodear la URL;
- subir el archivo .env a Git en lugar de .env.example;
- no manejar el estado de carga del botón durante la petición;
- olvidar limpiar el mensaje de error antes de cada intento de login.

## 8. Guardar los cambios en Git
Antes de crear el commit, revisa git status para confirmar qué archivos se van a guardar.
"git status
git add .
git commit -m "Sprint 2: autenticación y login"
git push".

## 9. Resultado esperado
Al terminar este Sprint 2 tendrás:
una pantalla de Login idéntica al diseño original de AG Services;
un cliente HTTP centralizado (apiClient);
un gestor de sesión (tokenManager);
la lógica de autenticación separada de la vista (authService);
la base lista para proteger las rutas en el Sprint 3.