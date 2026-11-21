function getToastContainer() {
  return document.getElementById('toastContainer');
}


function toastConfig(type) {
  const configs = {
    success: {
      title: 'Listo',
      icon: 'fa-circle-check',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200'
    },

    error: {
      title: 'Ocurrió un error',
      icon: 'fa-circle-exclamation',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      border: 'border-red-200'
    },

    warning: {
      title: 'Atención',
      icon: 'fa-triangle-exclamation',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      border: 'border-amber-200'
    },

    info: {
      title: 'Información',
      icon: 'fa-circle-info',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-agnavy',
      border: 'border-indigo-200'
    }
  };

  return (
    configs[type] ||
    configs.info
  );
}


export function showToast(
  message,
  type = 'info'
) {
  const container =
    getToastContainer();

  if (!container) {
    return;
  }


  const config =
    toastConfig(type);


  const toast =
    document.createElement('article');


  toast.className = `
    translate-x-3 opacity-0
    rounded-2xl border ${config.border}
    bg-white shadow-2xl
    px-4 py-4
    transition-all duration-200
  `;


  toast.innerHTML = `
    <div
      class="flex items-start gap-3"
    >
      <div
        class="h-10 w-10 shrink-0 rounded-xl ${config.iconBg} ${config.iconColor}
               grid place-items-center text-lg"
      >
        <i
          class="fa-solid ${config.icon}"
        ></i>
      </div>


      <div
        class="min-w-0 flex-1 pt-0.5"
      >
        <p
          class="text-sm font-bold text-slate-900"
        >
          ${config.title}
        </p>

        <p
          class="text-sm leading-5 text-slate-600 mt-0.5"
        ></p>
      </div>


      <button
        type="button"
        class="h-8 w-8 shrink-0 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        aria-label="Cerrar alerta"
      >
        <i
          class="fa-solid fa-xmark"
        ></i>
      </button>
    </div>
  `;


  toast
    .querySelector(
      'p.text-slate-600'
    )
    .textContent =
      message;


  const removeToast =
    () => {

      toast.classList.add(
        'translate-x-3',
        'opacity-0'
      );


      setTimeout(
        () => toast.remove(),
        180
      );
    };


  toast
    .querySelector('button')
    .addEventListener(
      'click',
      removeToast
    );


  container.appendChild(
    toast
  );


  requestAnimationFrame(
    () => {

      toast.classList.remove(
        'translate-x-3',
        'opacity-0'
      );

    }
  );


  setTimeout(
    removeToast,
    3500
  );
}


export function showConfirm({
  title = 'Confirmar acción',
  message = '¿Deseas continuar?',
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  type = 'danger'
} = {}) {
  return new Promise(
    resolve => {

      const existing =
        document.getElementById(
          'appConfirmAlert'
        );


      if (existing) {
        existing.remove();
      }


      const danger =
        type === 'danger';


      const overlay =
        document.createElement(
          'div'
        );


      overlay.id =
        'appConfirmAlert';


      overlay.className = `
        fixed inset-0 z-[90]
        bg-slate-950/45
        backdrop-blur-[2px]
        p-4
        flex items-center justify-center
      `;


      overlay.innerHTML = `
        <section
          class="
            w-full max-w-md
            rounded-3xl
            border border-slate-200
            bg-white
            shadow-2xl
            overflow-hidden
          "
          role="dialog"
          aria-modal="true"
        >

          <div
            class="p-6"
          >
            <div
              class="flex items-start gap-4"
            >

              <div
                class="
                  h-12 w-12
                  shrink-0
                  rounded-2xl
                  ${
                    danger
                      ? 'bg-red-50 text-red-600'
                      : 'bg-indigo-50 text-agnavy'
                  }
                  grid place-items-center
                  text-xl
                "
              >
                <i
                  class="fa-solid ${
                    danger
                      ? 'fa-triangle-exclamation'
                      : 'fa-circle-question'
                  }"
                ></i>
              </div>


              <div
                class="min-w-0 flex-1"
              >
                <h3
                  class="text-lg font-bold text-slate-900"
                ></h3>

                <p
                  class="mt-2 text-sm leading-6 text-slate-600"
                ></p>
              </div>

            </div>
          </div>


          <div
            class="
              border-t border-slate-100
              bg-slate-50/70
              p-4
              flex flex-col-reverse sm:flex-row
              sm:justify-end
              gap-2
            "
          >

            <button
              type="button"
              data-confirm-cancel
              class="
                rounded-xl
                border border-slate-200
                bg-white
                px-5 py-2.5
                text-sm font-bold
                text-slate-600
                hover:bg-slate-50
              "
            >
              ${cancelText}
            </button>


            <button
              type="button"
              data-confirm-accept
              class="
                rounded-xl
                px-5 py-2.5
                text-sm font-bold
                text-white
                ${
                  danger
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'btn-ag'
                }
              "
            >
              ${
                danger
                  ? '<i class="fa-solid fa-trash-can mr-2"></i>'
                  : ''
              }
              ${confirmText}
            </button>

          </div>

        </section>
      `;


      overlay
        .querySelector('h3')
        .textContent =
          title;


      overlay
        .querySelector('p')
        .textContent =
          message;


      const finish =
        value => {

          overlay.remove();

          resolve(value);
        };


      overlay
        .querySelector(
          '[data-confirm-cancel]'
        )
        .addEventListener(
          'click',
          () => finish(false)
        );


      overlay
        .querySelector(
          '[data-confirm-accept]'
        )
        .addEventListener(
          'click',
          () => finish(true)
        );


      overlay.addEventListener(
        'click',
        event => {

          if (
            event.target === overlay
          ) {
            finish(false);
          }

        }
      );


      document.body.appendChild(
        overlay
      );


      overlay
        .querySelector(
          '[data-confirm-accept]'
        )
        .focus();

    }
  );
}
