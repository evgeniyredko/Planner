const TASK_STORAGE_KEY = "tasks";

let tasks = [];
let currentCategoryId = null;

// DOM-элементы
const taskInput = document.querySelector(".tasks .add__input");
const taskList = document.querySelector(".tasks .list__items");

// Загрузка задач
function loadTasks() {
  const data = localStorage.getItem(TASK_STORAGE_KEY);
  tasks = data ? JSON.parse(data) : [];
}

// Сохранение задач
function saveTasks() {
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}

// Добавление задачи
function addTask(text) {
  if (!text.trim() || !currentCategoryId) return;

  const newTask = {
    id: Date.now().toString(),
    text,
    done: false,
    categoryId: currentCategoryId,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

// Удаление задачи
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Переключение состояния выполнения
function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    renderTasks();
  }
}

// Отрисовка задач для текущей категории
function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks.filter(
    (task) => task.categoryId === currentCategoryId
  );

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "list__item";

    li.innerHTML = `
  <div class="list__item-inner">
    <label class="list__checkbox">
      <input type="checkbox" ${task.done ? "checked" : ""} data-id="${
      task.id
    }" />
      <span class="list__checkmark"></span>
    </label>
    <div class="list__text" data-id="${task.id}">${task.text}</div>
    <button class="list__button" data-id="${task.id}">
      <span class="list__delete"></span>
    </button>
  </div>
  <div class="list__actions">
    <button class="list__action list__action--edit" data-id="${
      task.id
    }">✏️</button>
    <button class="list__action list__action--up" data-id="${
      task.id
    }">🔼</button>
    <button class="list__action list__action--down" data-id="${
      task.id
    }">🔽</button>
  </div>
`;

    taskList.appendChild(li);
  });

  assignTaskEvents();
  addSwipeListeners();
}

// Обработчики для чекбоксов и удаления
function assignTaskEvents() {
  taskList.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      toggleTask(checkbox.dataset.id);
    });
  });

  taskList.querySelectorAll(".list__button").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteTask(btn.dataset.id);
    });
  });
}

// Ввод задачи
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
  }
});
