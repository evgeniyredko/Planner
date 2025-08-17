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

// Изменение иконки
let currentCategoryIdForIcon = null;
let selectedIcon = null;
let selectedColor = null;

const iconModal = document.getElementById("iconModal");
const cancelIconSelect = document.getElementById("cancelIconSelect");
const confirmIconSelect = document.getElementById("confirmIconSelect");

// Открыть модалку при клике на кнопку изменения иконки
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".list__button");
  if (btn?.dataset.action === "change") {
    currentCategoryIdForIcon = btn.dataset.id;

    // Подтягиваем ТЕКУЩИЕ значения категории
    const cat = categories.find((c) => c.id == currentCategoryIdForIcon);
    selectedIcon = cat?.icon ?? null;
    selectedColor = typeof cat?.color === "string" ? cat.color : null;

    // Сброс/установка выделения в UI
    document
      .querySelectorAll("#iconModal .modal__item img")
      .forEach((img) =>
        img.classList.toggle("selected", img.dataset.icon === selectedIcon)
      );

    document
      .querySelectorAll("#iconModal .color-option")
      .forEach((opt) =>
        opt.classList.toggle("selected", opt.dataset.color === selectedColor)
      );

    iconModal.style.display = "flex";
  }
});

// Выбор иконки
document.querySelectorAll(".modal__item img").forEach((img) => {
  img.addEventListener("click", () => {
    selectedIcon = img.dataset.icon;
    document
      .querySelectorAll(".modal__item img")
      .forEach((i) => i.classList.remove("selected"));
    img.classList.add("selected");
  });
});

// Выбор цвета
document.querySelectorAll(".color-option").forEach((option) => {
  option.addEventListener("click", () => {
    selectedColor = option.dataset.color;
    document
      .querySelectorAll(".color-option")
      .forEach((o) => o.classList.remove("selected"));
    option.classList.add("selected");
  });
});

// Сохранить выбор (без раннего return)
confirmIconSelect.addEventListener("click", () => {
  const idx = categories.findIndex((c) => c.id == currentCategoryIdForIcon);
  if (idx === -1) return;

  const cat = categories[idx];

  const newIcon = selectedIcon ?? cat.icon; // если иконку не трогали — остаётся старая
  const newColor = selectedColor ?? cat.color; // если цвет не трогали — остаётся старый

  categories[idx] = { ...cat, icon: newIcon, color: newColor };

  saveCategories();
  renderCategories();
  iconModal.style.display = "none";
});

// Отмена
cancelIconSelect.addEventListener("click", () => {
  iconModal.style.display = "none";
});
