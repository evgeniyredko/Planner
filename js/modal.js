const modal = document.getElementById("rename-modal");
const input = document.getElementById("rename-input");
const cancelBtn = document.getElementById("rename-cancel");
const saveBtn = document.getElementById("rename-save");

let currentRenameId = null;
let renameType = null; // "category" или "task"

// Открыть модальное окно
function openRenameModal(id, value, type) {
  currentRenameId = id;
  renameType = type;
  input.value = value;
  modal.classList.add("modal--visible");
  input.focus();
}

// Закрыть модальное окно
function closeRenameModal() {
  modal.classList.remove("modal--visible");
  currentRenameId = null;
  renameType = null;
}

// Обработка кнопки "Сохранить"
saveBtn.addEventListener("click", () => {
  const newValue = input.value.trim();
  if (!newValue) return;

  if (renameType === "category") {
    const category = categories.find((c) => c.id === currentRenameId);
    if (category) {
      category.name = newValue;
      saveCategories();
      renderCategories();
    }
  } else if (renameType === "task") {
    const task = tasks.find((t) => t.id === currentRenameId);
    if (task) {
      task.text = newValue;
      saveTasks();
      renderTasks();
    }
  }

  closeRenameModal();
});

// Обработка кнопки "Отмена"
cancelBtn.addEventListener("click", closeRenameModal);

// Закрытие по клику вне окна
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeRenameModal();
});
