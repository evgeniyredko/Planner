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
