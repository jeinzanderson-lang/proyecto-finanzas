export function detailCardTemplate({
  id,
  eyebrow,
  titleId,
  descriptionId,
  fields,
  actions = ''
}) {
  return `
    <aside
      id="${id}"
      class="hidden detail-card mt-6 mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden"
    >
      <div class="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-agg">
            ${eyebrow}
          </p>

          <h3 id="${titleId}" class="text-2xl font-bold text-slate-900 mt-1"></h3>

          <p id="${descriptionId}" class="text-sm text-slate-500 mt-2 max-w-3xl"></p>
        </div>

        <button
          type="button"
          data-detail-close="${id}"
          class="h-10 w-10 shrink-0 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
          aria-label="Cerrar detalle"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${fields
            .map(
              field => `
                <div class="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p class="text-xs font-semibold text-slate-500">${field.label}</p>
                  <p id="${field.id}" class="text-base font-bold text-slate-900 mt-1"></p>
                </div>
              `
            )
            .join('')}
        </div>

        ${actions}
      </div>
    </aside>
  `;
}

export function showDetailCard(id) {
  const card = document.getElementById(id);
  if (!card) return;

  card.classList.remove('hidden');

  setTimeout(() => {
    card.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }, 50);
}

export function hideDetailCard(id) {
  document.getElementById(id)?.classList.add('hidden');
}

export function initDetailCloseEvents(root = document) {
  root.querySelectorAll('[data-detail-close]').forEach(button => {
    button.addEventListener('click', () => {
      hideDetailCard(button.dataset.detailClose);
    });
  });
}
