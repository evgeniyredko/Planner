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
