export function sideDetailTemplate({
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
      class="side-detail-menu hidden"
    >
      <div class="side-detail-menu-header">

        <div class="side-detail-menu-heading">

          <div>
            <p class="side-detail-menu-eyebrow">
              ${eyebrow}
            </p>

            <h3
              id="${titleId}"
              class="side-detail-menu-title"
            ></h3>
          </div>

          <button
            type="button"
            data-side-close="${id}"
            class="side-detail-menu-close"
            aria-label="Cerrar detalle"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>

        </div>

        ${
          descriptionId
            ? `
              <p
                id="${descriptionId}"
                class="side-detail-menu-description"
              ></p>
            `
            : ''
        }

      </div>

      <div class="side-detail-menu-content">

        <div class="side-detail-menu-fields">

          ${fields
            .map(
              field => `
                <div
                  class="side-detail-menu-row ${
                    field.divider
                      ? 'side-detail-menu-divider'
                      : ''
                  }"
                >
                  <span class="side-detail-menu-label">
                    ${field.label}
                  </span>

                  <span
                    id="${field.id}"
                    class="side-detail-menu-value ${
                      field.accent
                        ? 'side-detail-menu-accent'
                        : ''
                    }"
                  ></span>
                </div>
              `
            )
            .join('')}

        </div>

      </div>

      <div class="side-detail-menu-actions">
        ${actions}
      </div>

    </aside>
  `;
}


export function openSideDetail(
  workspaceId,
  detailId
) {
  const workspace =
    document.getElementById(
      workspaceId
    );

  const detail =
    document.getElementById(
      detailId
    );

  if (
    !workspace ||
    !detail
  ) {
    return;
  }

  workspace.classList.add(
    'has-detail'
  );

  detail.classList.remove(
    'hidden'
  );

  document.body.classList.add(
    'detail-menu-open'
  );
}


export function closeSideDetail(
  workspaceId,
  detailId
) {
  document
    .getElementById(
      workspaceId
    )
    ?.classList.remove(
      'has-detail'
    );

  document
    .getElementById(
      detailId
    )
    ?.classList.add(
      'hidden'
    );

  document.body.classList.remove(
    'detail-menu-open'
  );
}


export function initSideDetailEvents(
  closeMap = {}
) {
  document
    .querySelectorAll(
      '[data-side-close]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const detailId =
            button.dataset.sideClose;

          const workspaceId =
            closeMap[
              detailId
            ];

          if (
            workspaceId
          ) {
            closeSideDetail(
              workspaceId,
              detailId
            );
          }

        }
      );

    });
}
