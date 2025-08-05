const CATEGORY_STORAGE_KEY = "categories";

let categories = [];

// DOM-элементы
const categoryInput = document.querySelector(".categories .add__input");
const categoryList = document.querySelector(".categories .list__items");

// Количество категорий
function countCategories() {
  const title = document.querySelector(".categories .list__title");
  if (title) {
    title.textContent = `Категории (${categories.length})`;
  }
}

// Загрузка категорий из localStorage
function loadCategories() {
  const data = localStorage.getItem(CATEGORY_STORAGE_KEY);
  categories = data ? JSON.parse(data) : [];

  renderCategories();
}

// Сохранение в localStorage
function saveCategories() {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
}

// Генерация уникального ID
function generateId() {
  return Date.now().toString();
}

// Добавление категории
function addCategory(name) {
  if (!name.trim()) return;

  const newCategory = {
    id: generateId(),
    name,
    icon: "list.png", // Пока одна иконка, позже можно выбрать
  };

  saveActiveItem("category");
  categories.push(newCategory);
  saveCategories();
  renderCategories();
}

// Удаление категории
function deleteCategory(id) {
  saveActiveItem("category");
  categories = categories.filter((category) => category.id !== id);
  saveCategories();
  renderCategories();
}

function moveCategory(id, direction) {
  saveActiveItem("category"); // ⬅️ Сохраняем активный элемент ДО render

  const index = categories.findIndex((c) => c.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= categories.length) return;

  const allItems = Array.from(
    document.querySelectorAll(".categories .list__item")
  );
  const positionsBefore = new Map();
  allItems.forEach((el) => {
    positionsBefore.set(el.dataset.id, el.getBoundingClientRect());
  });

  [categories[index], categories[swapWith]] = [
    categories[swapWith],
    categories[index],
  ];

  saveCategories();
  renderCategories(); // ⬅️ Перерисовываем DOM
  restoreActiveItem("category"); // ⬅️ Восстанавливаем активный элемент

  const newItems = Array.from(
    document.querySelectorAll(".categories .list__item")
  );
  newItems.forEach((el) => {
    const id = el.dataset.id;
    const before = positionsBefore.get(id);
    if (!before) return;

    const after = el.getBoundingClientRect();
    const deltaY = before.top - after.top;

    el.style.transform = `translateY(${deltaY}px)`;
    el.style.transition = "none";

    requestAnimationFrame(() => {
      el.style.transform = `translateY(0)`;
      el.style.transition = "transform 300ms ease";
    });

    setTimeout(() => {
      el.style.transform = "";
    }, 300);
  });
}

function addCategoryActionListeners() {
  const editButtons = document.querySelectorAll(".list__action--edit");

  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // чтобы не было перехода к задачам

      const id = btn.dataset.id;
      const category = categories.find((c) => c.id === id);

      if (category) {
        openRenameModal(id, category.name, "category");
      }
    });
  });
}

// Отрисовка всех категорий
function renderCategories() {
  categoryList.innerHTML = "";

  categories.forEach((category) => {
    const li = document.createElement("li");
    li.className = "list__item";

    if (category.id === window._activeCategoryId) {
      li.classList.add("list__item--active");
    }
    li.dataset.id = category.id;

    li.innerHTML = `
  <div class="list__item-inner">
    <button class="list__button" data-action="change" data-id="${category.id}">
      <img class="list__img" src="./assets/icons/categories/${category.icon}" alt="" />
    </button>
    <div class="list__text" tabindex="0" data-id="${category.id}">${category.name}</div>
    <button class="list__button" data-action="delete" data-id="${category.id}">
      <span class="list__delete"></span>
    </button>
  </div>
  <div class="list__actions">
    <button class="list__action list__action--edit" data-id="${category.id}"><img src="./assets/icons/rename.svg" alt="Переименовать"></button>
    <button class="list__action list__action--up" data-id="${category.id}"><img src="./assets/icons/arrow.svg" alt="Вверх"></button>
    <button class="list__action list__action--down" data-id="${category.id}"><img src="./assets/icons/arrow.svg" alt="Вниз"></button>
  </div>
`;

    categoryList.appendChild(li);
  });

  // Повторно назначаем события (после перерисовки DOM)
  assignCategoryEvents();
  addSwipeListeners();
  addCategoryActionListeners();
  countCategories();
}

// Слушатель на ввод
categoryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addCategory(categoryInput.value);
    categoryInput.value = "";
  }
});

// Назначение событий на кнопки
function assignCategoryEvents() {
  document.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      deleteCategory(id);
    });
  });

  document.querySelectorAll(".list__text").forEach((text) => {
    text.addEventListener("click", () => {
      const id = text.dataset.id;
      const category = categories.find((c) => c.id === id);
      if (category) {
        openTasksForCategory(id, category.name); // ⬅️ передаём category.name
      }
    });
  });

  // 🔼 Вверх
  document.querySelectorAll(".list__action--up").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      moveCategory(id, "up");
    });
  });

  // 🔽 Вниз
  document.querySelectorAll(".list__action--down").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      moveCategory(id, "down");
    });
  });
}

// Инициализация
loadCategories();
