// Сохраняет активный элемент в глобальную переменную (по типу списка)
window.saveActiveItem = function (type) {
  const containerSelector = type === "task" ? ".tasks" : ".category";
  const active = document.querySelector(
    `${containerSelector} .list__item--active`
  );
  if (active) {
    if (type === "task") {
      window._activeTaskId = active.dataset.id;
    } else if (type === "category") {
      window._activeCategoryId = active.dataset.id;
    }
  }
};

// Восстанавливает активный элемент после рендера
window.restoreActiveItem = function (type) {
  const containerSelector = type === "task" ? ".tasks" : ".category";
  const id = type === "task" ? window._activeTaskId : window._activeCategoryId;
  if (!id) return;

  const item = document.querySelector(
    `${containerSelector} .list__item[data-id="${id}"]`
  );
  if (item) {
    item.classList.add("list__item--active");
  }
};

// Отрисовка заглушки для пустого списка
function renderEmptyMessage(container, title, text, imgSrc, imgAlt = "") {
  const li = document.createElement("li");
  li.className = "list__empty";
  li.innerHTML = `
    <div class="list__empty-inner">
      <img class="list__empty-img" src="${imgSrc}" alt="${imgAlt}">
      <h3 class="list__empty-title">${title}</h3>
      <p class="list__empty-text">${text}</p>
    </div>
  `;
  container.appendChild(li);
}
