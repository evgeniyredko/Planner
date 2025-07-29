const CATEGORY_STORAGE_KEY = "categories";

let categories = [];

// DOM-элементы
const categoryInput = document.querySelector(".categories .add__input");
const categoryList = document.querySelector(".categories .list__items");

// Загрузка из localStorage
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

  categories.push(newCategory);
  saveCategories();
  renderCategories();
}

// Удаление категории
function deleteCategory(id) {
  categories = categories.filter((category) => category.id !== id);
  saveCategories();
  renderCategories();
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
    <button class="list__action list__action--edit" data-id="${category.id}">✏️</button>
    <button class="list__action list__action--up" data-id="${category.id}">🔼</button>
    <button class="list__action list__action--down" data-id="${category.id}">🔽</button>
  </div>
`;

    categoryList.appendChild(li);
  });

  // Повторно назначаем события (после перерисовки DOM)
  assignCategoryEvents();
  addSwipeListeners();
  addCategoryActionListeners();
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
      openTasksForCategory(id); // Функция из app.js — пока будет заглушка
    });
  });
}

// Инициализация
loadCategories();
