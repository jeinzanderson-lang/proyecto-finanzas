import loginMedellin from '../../assets/login-medellin.jpg';
import loginBusiness from '../../assets/login-business.jpg';
import agLogo from '../../assets/ag-logo.jpg';

import { authService } from '../services/auth.service.js';
import { sessionService } from '../auth/session.service.js';
import { showToast } from '../components/ui/toast.js';

export function renderLoginPage() {
  return `
    <section
      id="loginScreen"
      class="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden"
    >
      <!-- Fondo ORIGINAL del index version 2 -->
      <div
        class="absolute inset-0 grid grid-cols-2"
        aria-hidden="true"
      >
        <div class="relative overflow-hidden">
          <img
            src="${loginMedellin}"
            alt=""
            class="absolute inset-0 w-full h-full object-cover"
            draggable="false"
          />
        </div>

        <div class="relative overflow-hidden">
          <img
            src="${loginBusiness}"
            alt=""
            class="absolute inset-0 w-full h-full object-cover"
            draggable="false"
          />
        </div>
      </div>

      <div class="absolute inset-0 bg-slate-950/45"></div>
      <div
        class="absolute inset-0 bg-gradient-to-b from-agnavy/20 via-transparent to-agnavy/20"
      ></div>

      <div class="relative z-10 w-full max-w-md">

        <div
          class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
        >
          <div class="h-2 bg-agnavy"></div>

          <div class="p-6 sm:p-8">

            <div class="flex justify-center mb-5">
              <img
                src="${agLogo}"
                alt="Logo AG Services"
                class="w-44 sm:w-52 max-h-28 object-contain"
                draggable="false"
              />
            </div>

            <div class="text-center mb-6">

              <span
                class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                <i class="fa-solid fa-layer-group text-agnavy"></i>
                Números claros, negocio exitoso.
              </span>

              <h1
                class="mt-4 text-2xl sm:text-3xl font-bold text-slate-900"
              >
                Sistema Contable
              </h1>

              <p class="mt-2 text-sm text-slate-500">
                Inicia sesión para acceder al panel financiero.
              </p>

            </div>

            <form
              id="loginForm"
              class="space-y-4"
            >

              <div>
                <label
                  for="loginUser"
                  class="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Usuario
                </label>

                <div class="relative">
                  <i
                    class="fa-regular fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  ></i>

                  <input
                    id="loginUser"
                    type="text"
                    autocomplete="username"
                    required
                    placeholder="Ingresa tu usuario"
                    class="input-ag w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label
                  for="loginPassword"
                  class="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Contraseña
                </label>

                <div class="relative">
                  <i
                    class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  ></i>

                  <input
                    id="loginPassword"
                    type="password"
                    autocomplete="current-password"
                    required
                    placeholder="Ingresa tu contraseña"
                    class="input-ag w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm transition"
                  />

                  <button
                    id="togglePasswordBtn"
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-slate-400 hover:text-agnavy"
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    <i
                      id="passwordIcon"
                      class="fa-regular fa-eye"
                    ></i>
                  </button>
                </div>
              </div>

              <p
                id="loginError"
                class="hidden rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              ></p>

              <button
                id="loginSubmit"
                type="submit"
                class="btn-ag w-full rounded-xl py-3.5 font-bold"
              >
                <i class="fa-solid fa-right-to-bracket mr-2"></i>
                Iniciar sesión
              </button>

            </form>
          </div>
        </div>

        <p class="text-center text-xs text-slate-400 mt-4">
          Diseño responsivo para escritorio, tablet y celular.
        </p>

      </div>
    </section>
  `;
}

export function initLoginEvents() {
  const passwordInput =
    document.getElementById('loginPassword');

  const passwordIcon =
    document.getElementById('passwordIcon');

  document
    .getElementById('togglePasswordBtn')
    ?.addEventListener('click', () => {
      const hidden =
        passwordInput.type === 'password';

      passwordInput.type =
        hidden ? 'text' : 'password';

      passwordIcon.className =
        hidden
          ? 'fa-regular fa-eye-slash'
          : 'fa-regular fa-eye';
    });

  document
    .getElementById('loginForm')
    ?.addEventListener('submit', async event => {
      event.preventDefault();

      const username =
        document
          .getElementById('loginUser')
          .value
          .trim();

      const password =
        passwordInput.value;

      const errorBox =
        document.getElementById('loginError');

      const button =
        document.getElementById('loginSubmit');

      if (!username || !password) {
        errorBox.textContent =
          'Debes ingresar usuario y contraseña.';

        errorBox.classList.remove('hidden');
        return;
      }

      try {
        errorBox.classList.add('hidden');
        button.disabled = true;

        const result =
          await authService.login(
            username,
            password
          );

        sessionService.setSession(
          result.token,
          result.user
        );

        window.location.hash =
          'dashboard';

      } catch (error) {
        errorBox.textContent =
          error.message;

        errorBox.classList.remove('hidden');

        showToast(
          error.message,
          'error'
        );

      } finally {
        button.disabled = false;
      }
    });
}
