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

function addTaskActionListeners() {
  const editButtons = document.querySelectorAll(
    ".list__action--edit[data-type='task']"
  );

  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // чтобы не было перехода или другого действия

      const id = btn.dataset.id;
      const task = tasks.find((t) => t.id === id);

      if (task) {
        openRenameModal(id, task.text, "task");
      }
    });
  });
}

function addTaskMoveListeners() {
  const upButtons = document.querySelectorAll(".list__action--up");
  const downButtons = document.querySelectorAll(".list__action--down");

  upButtons.forEach((btn) => {
    btn.addEventListener("click", () => moveTask(btn.dataset.id, "up"));
  });

  downButtons.forEach((btn) => {
    btn.addEventListener("click", () => moveTask(btn.dataset.id, "down"));
  });
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
    li.dataset.id = task.id;

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
    }" data-type="task">✏️</button>
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

  restoreActiveItem("task");

  assignTaskEvents();
  addSwipeListeners();
  addTaskActionListeners();
  addTaskMoveListeners();
}

function moveTask(id, direction) {
  const filtered = tasks.filter(
    (task) => task.categoryId === currentCategoryId
  );
  const index = filtered.findIndex((task) => task.id === id);
  if (index === -1) return;

  const globalIndex = tasks.findIndex((t) => t.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= filtered.length) return;

  const swapId = filtered[swapWith].id;
  const swapGlobalIndex = tasks.findIndex((t) => t.id === swapId);

  const allItems = Array.from(document.querySelectorAll(".tasks .list__item"));
  const positionsBefore = new Map();
  allItems.forEach((el) => {
    positionsBefore.set(el.dataset.id, el.getBoundingClientRect());
  });

  [tasks[globalIndex], tasks[swapGlobalIndex]] = [
    tasks[swapGlobalIndex],
    tasks[globalIndex],
  ];
  saveTasks();

  // ⬇️ Сохраняем активный элемент
  saveActiveItem("task");

  renderTasks();

  // ⬇️ Восстанавливаем активный элемент
  restoreActiveItem();

  const newItems = Array.from(document.querySelectorAll(".tasks .list__item"));
  newItems.forEach((el) => {
    const id = el.dataset.id;
    const before = positionsBefore.get(id);
    if (!before) return;

    const after = el.getBoundingClientRect();
    const deltaY = before.top - after.top;

    el.style.transform = `translateY(${deltaY}px)`;
    el.style.transition = "none";

    requestAnimationFrame(() => {
      el.style.transform = "translateY(0)";
      el.style.transition = "transform 300ms ease";
    });

    setTimeout(() => {
      el.style.transform = "";
    }, 300);
  });
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
