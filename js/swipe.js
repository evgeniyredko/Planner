function addSwipeListeners() {
  const items = document.querySelectorAll(".list__item");

  function activateSwipeItem(item) {
    document.querySelectorAll(".list__item--active").forEach((el) => {
      if (el !== item) {
        el.classList.remove("list__item--active");
        const inner = el.querySelector(".list__item-inner");
        if (inner) inner.style.transform = "";
      }
    });

    item.classList.add("list__item--active");
    const inner = item.querySelector(".list__item-inner");
    if (inner) inner.style.transform = "translateX(-80px)";
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
      if (Math.abs(currentX - startX) > 10) {
        isSwiping = true;
      }
    };

    const end = () => {
      if (!isDragging) return;
      const deltaX = currentX - startX;
      const inner = item.querySelector(".list__item-inner");

      if (deltaX < -threshold) {
        activateSwipeItem(item);
        window._activeCategoryId = item.dataset.id;
      } else if (
        deltaX > threshold &&
        item.classList.contains("list__item--active")
      ) {
        item.classList.remove("list__item--active");
        if (inner) inner.style.transform = "";
      }

      isDragging = false;
    };

    // Touch events
    item.addEventListener("touchstart", (e) => start(e.touches[0].clientX));
    item.addEventListener("touchmove", (e) => move(e.touches[0].clientX));
    item.addEventListener("touchend", end);

    // Mouse events
    item.addEventListener("mousedown", (e) => start(e.clientX));
    item.addEventListener("mousemove", (e) => move(e.clientX));
    item.addEventListener("mouseup", end);

    // Блокируем клик после свайпа
    item.addEventListener("click", (e) => {
      if (isSwiping) e.stopImmediatePropagation();
    });

    // Клик по кнопке редактирования
    item
      .querySelector(".list__action--edit")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = item.dataset.id;
        const name = item.querySelector(".list__text")?.textContent.trim();
        if (item.closest("#category-list")) {
          openRenameModal(id, name, "category");
        } else if (item.closest("#task-list")) {
          openRenameModal(id, name, "task");
        }
      });
  });

  // Скрыть активный при клике вне элемента и не по кнопке
  document.addEventListener("click", (e) => {
    const activeItem = document.querySelector(".list__item--active");
    if (
      activeItem &&
      !activeItem.contains(e.target) &&
      !e.target.closest(".list__action")
    ) {
      activeItem.classList.remove("list__item--active");
      const inner = activeItem.querySelector(".list__item-inner");
      if (inner) inner.style.transform = "";
    }
  });
}
