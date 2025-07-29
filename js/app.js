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

function openTasksForCategory(categoryId) {
  currentCategoryId = categoryId;
  loadTasks();
  renderTasks();
  openTasks();
}
