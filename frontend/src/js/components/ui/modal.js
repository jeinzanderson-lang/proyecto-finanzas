export function modalTemplate({
  id,
  titleId,
  subtitleId,
  body,
  maxWidth = 'max-w-lg'
}) {
  return `
    <div
      id="${id}"
      class="hidden fixed inset-0 z-50 bg-slate-950/45 modal-backdrop-custom p-4 items-center justify-center"
    >
      <div
        class="w-full ${maxWidth} max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200"
      >
        <div
          class="p-5 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white z-10"
        >
          <div>
            <h3
              id="${titleId}"
              class="font-bold text-slate-900"
            ></h3>

            <p
              id="${subtitleId}"
              class="text-xs text-slate-500 mt-0.5"
            ></p>
          </div>

          <button
            type="button"
            data-close-modal="${id}"
            class="h-9 w-9 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            aria-label="Cerrar"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        ${body}
      </div>
    </div>
  `;
}

export function openModal(id) {
  const modal =
    document.getElementById(id);

  if (!modal) {
    return;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

export function closeModal(id) {
  const modal =
    document.getElementById(id);

  if (!modal) {
    return;
  }

  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

export function initModalCloseEvents(root = document) {
  root
    .querySelectorAll('[data-close-modal]')
    .forEach(button => {
      button.addEventListener('click', () => {
        closeModal(
          button.dataset.closeModal
        );
      });
    });

  root
    .querySelectorAll('.modal-backdrop-custom')
    .forEach(backdrop => {
      backdrop.addEventListener(
        'click',
        event => {
          if (event.target === backdrop) {
            closeModal(backdrop.id);
          }
        }
      );
    });
}
