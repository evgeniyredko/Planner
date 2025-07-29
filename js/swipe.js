function addSwipeListeners() {
  const items = document.querySelectorAll(".list__item");

  // Функция: активирует текущий item, убирает активность у других
  function activateSwipeItem(item) {
    document.querySelectorAll(".list__item--active").forEach((el) => {
      if (el !== item) el.classList.remove("list__item--active");
    });

    item.classList.add("list__item--active");
  }

  items.forEach((item) => {
    let startX = 0;
    let currentX = 0;
    const threshold = 50;
    let isDragging = false;
    let isSwiping = false;

    const start = (x) => {
      startX = x;
      currentX = x;
      isDragging = true;
      isSwiping = false;
    };

    const move = (x) => {
      if (!isDragging) return;
      currentX = x;
      const deltaX = currentX - startX;

      if (Math.abs(deltaX) > 10) {
        isSwiping = true;
      }
    };

    const end = () => {
      if (!isDragging) return;
      const deltaX = currentX - startX;

      if (deltaX < -threshold) {
        activateSwipeItem(item); // здесь — вызов функции вместо .classList.add
      } else if (deltaX > threshold) {
        item.classList.remove("list__item--active");
      }

      isDragging = false;
    };

    // touch
    item.addEventListener("touchstart", (e) => start(e.touches[0].clientX));
    item.addEventListener("touchmove", (e) => move(e.touches[0].clientX));
    item.addEventListener("touchend", end);

    // mouse
    item.addEventListener("mousedown", (e) => start(e.clientX));
    item.addEventListener("mousemove", (e) => move(e.clientX));
    item.addEventListener("mouseup", end);
    // слушатель на кнопку редактирования
    item
      .querySelector(".list__action--edit")
      ?.addEventListener("click", (e) => {
        e.stopPropagation(); // чтобы не было лишнего клика по item
        const id = item.dataset.id;
        const name = item.querySelector(".list__text")?.textContent.trim();

        if (item.closest("#category-list")) {
          openRenameModal(id, name, "category");
        } else if (item.closest("#task-list")) {
          openRenameModal(id, name, "task");
        }
      });

    // блокировка клика после свайпа
    item.addEventListener("click", (e) => {
      if (isSwiping) e.stopImmediatePropagation();
    });
  });

  // Скрыть активный элемент при клике вне его
  document.addEventListener("click", (e) => {
    const activeItem = document.querySelector(".list__item--active");
    if (activeItem && !activeItem.contains(e.target)) {
      activeItem.classList.remove("list__item--active");
    }
  });
}
