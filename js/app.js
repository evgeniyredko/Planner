const categoriesSection = document.querySelector(".categories");
const tasksSection = document.querySelector(".tasks");

// Переключение экранов
function openTasks() {
  categoriesSection.classList.add("categories--hidden");
  tasksSection.classList.add("tasks--active");
}

function closeTasks() {
  categoriesSection.classList.remove("categories--hidden");
  tasksSection.classList.remove("tasks--active");
}

// Назначаем обработчики
document.querySelectorAll(".list__text").forEach((button) => {
  button.addEventListener("click", openTasks);
});

document
  .querySelector(".tasks .header__left")
  .addEventListener("click", closeTasks);

function openTasksForCategory(categoryId, categoryName) {
  currentCategoryId = categoryId;

  // Меняем заголовок
  const headerTitle = document.querySelector(".tasks .header__title");
  if (headerTitle) {
    headerTitle.textContent = categoryName;
  }

  loadTasks();
  renderTasks();
  openTasks();
}

const menuButton = document.querySelector(".tasks .header__button-menu");
const contextMenu = document.getElementById("contextMenu");
const overlay = document.getElementById("overlay");
const deleteAllTasksBtn = document.getElementById("deleteAllTasks");

const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

let confirmAction = null; // функция, выполняемая при подтверждении

// Универсальная функция показа модалки
function showConfirm(text, action) {
  confirmText.textContent = text;
  confirmAction = action;
  confirmModal.style.display = "flex";
}

// Закрыть модалку
function closeConfirm() {
  confirmModal.style.display = "none";
  confirmAction = null;
}

// Открытие/закрытие меню
menuButton.addEventListener("click", (e) => {
  e.stopPropagation();
  contextMenu.style.display =
    contextMenu.style.display === "block" ? "none" : "block";
});

// Закрыть меню при клике вне
document.addEventListener("click", () => {
  contextMenu.style.display = "none";
});

// Клик "Удалить все задачи"
deleteAllTasksBtn.addEventListener("click", () => {
  showConfirm("Удалить все задачи?", () => {
    tasks = tasks.filter((t) => t.categoryId !== currentCategoryId);
    saveTasks();
    renderTasks();
  });
  contextMenu.style.display = "none";
});

// Кнопка отмены в модалке
cancelDelete.addEventListener("click", closeConfirm);

// Подтверждение
confirmDelete.addEventListener("click", () => {
  if (typeof confirmAction === "function") {
    confirmAction();
  }
  closeConfirm();
});

document.querySelectorAll(".header__button-menu").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.currentTarget.focus(); // насильно возвращаем фокус
  });
});
