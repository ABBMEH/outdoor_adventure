document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach((carouselContainer, carouselIdx) => {
    const carousel = carouselContainer.querySelector(".carousel");
    const dots = carouselContainer.querySelectorAll(".carousel-button");
    const items = Array.from(carousel.querySelectorAll(".carousel-item"));
    let currentIndex = 0;
    let dotIndex = 0;
    let autoScrollInterval = null;
    const AUTO_SCROLL_DELAY = 5000;
    const totalItems = items.length;

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    carouselContainer.dataset.dotIndex = dotIndex;

    const itemsPerView = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    };

    const cloneItems = () => {
      carousel.innerHTML = "";
      const clonesNeeded = totalItems * 5;
      for (let i = 0; i < clonesNeeded; i++) {
        const clone = items[i % totalItems].cloneNode(true);
        carousel.appendChild(clone);
      }
      currentIndex = totalItems * 2;
      updateCarousel(currentIndex, false);
    };

    const updateCarousel = (index, smooth = true) => {
      const itemWidth = 100 / itemsPerView();
      carousel.style.transition = smooth ? "transform 0.5s ease-in-out" : "none";
      carousel.style.transform = `translateX(-${index * itemWidth}%)`;
      prevTranslate = -index * itemWidth;
      dotIndex = ((index % totalItems) + totalItems) % totalItems;
      carouselContainer.dataset.dotIndex = dotIndex;

      dots.forEach((dot, i) => {
        dot.classList.toggle("selected", i === dotIndex);
      });
    };

    const repositionItems = () => {
      const itemsDisplayed = itemsPerView();
      if (currentIndex >= totalItems * 3) {
        currentIndex = (currentIndex % totalItems) + totalItems;
        dotIndex = currentIndex % totalItems;
        carouselContainer.dataset.dotIndex = dotIndex;
        updateCarousel(currentIndex, false);
      } else if (currentIndex < totalItems) {
        currentIndex = (currentIndex % totalItems) + totalItems * 2;
        dotIndex = currentIndex % totalItems;
        carouselContainer.dataset.dotIndex = dotIndex;
        updateCarousel(currentIndex, false);
      }
    };

    const startAutoScroll = () => {
      stopAutoScroll();
      autoScrollInterval = setInterval(() => {
        currentIndex += 1;
        dotIndex = (dotIndex + 1) % totalItems;
        carouselContainer.dataset.dotIndex = dotIndex;
        updateCarousel(currentIndex, true);
        setTimeout(() => {
          if (currentIndex >= totalItems * 3) {
            repositionItems();
          }
        }, 500);
      }, AUTO_SCROLL_DELAY);
    };

    const stopAutoScroll = () => {
      clearInterval(autoScrollInterval);
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        stopAutoScroll();
        dotIndex = index;
        currentIndex = index + totalItems * 2;
        carouselContainer.dataset.dotIndex = dotIndex;
        updateCarousel(currentIndex, true);
        setTimeout(startAutoScroll, AUTO_SCROLL_DELAY);
      });
    });

    window.addEventListener("resize", () => {
      stopAutoScroll();
      cloneItems();
      currentIndex = dotIndex + totalItems * 2;
      updateCarousel(currentIndex, false);
      startAutoScroll();
    });

    const startDragging = (e) => {
      isDragging = true;
      startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      prevTranslate = -(currentIndex * (100 / itemsPerView()));
      stopAutoScroll();
      carousel.style.transition = "none";
    };

    const dragging = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      const deltaX = currentX - startX;
      currentTranslate = prevTranslate + (deltaX / carousel.offsetWidth) * 100;
      carousel.style.transform = `translateX(${currentTranslate}%)`;
    };

    const stopDragging = (e) => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.transition = "transform 0.5s ease-in-out";

      const itemWidth = 100 / itemsPerView();
      const draggedDistance = currentTranslate - prevTranslate;
      const itemsMoved = Math.round(draggedDistance / itemWidth);
      currentIndex -= itemsMoved;
      dotIndex = ((currentIndex % totalItems) + totalItems) % totalItems;
      carouselContainer.dataset.dotIndex = dotIndex;

      updateCarousel(currentIndex, true);

      setTimeout(() => {
        if (currentIndex >= totalItems * 3 || currentIndex < totalItems) {
          repositionItems();
        }
        setTimeout(startAutoScroll, AUTO_SCROLL_DELAY);
      }, 500);
    };

    carousel.querySelectorAll("img").forEach((img) => {
      img.addEventListener("dragstart", (e) => e.preventDefault());
    });

    carousel.addEventListener("mousedown", startDragging);
    carousel.addEventListener("mousemove", dragging);
    carousel.addEventListener("mouseup", stopDragging);
    carousel.addEventListener("mouseleave", stopDragging);

    carousel.addEventListener("touchstart", startDragging);
    carousel.addEventListener("touchmove", dragging);
    carousel.addEventListener("touchend", stopDragging);

    cloneItems();
    updateCarousel(currentIndex, false);
    startAutoScroll();
  });

  window.addEventListener("colorChange", (event) => {
    carousels.forEach((carouselContainer) => {
      const dots = carouselContainer.querySelectorAll(".carousel-button");
      const dotIndex = parseInt(carouselContainer.dataset.dotIndex || "0");
      dots.forEach((dot, i) => {
        dot.classList.toggle("selected", i === dotIndex);
      });
    });
  });

  window.dispatchEvent(new CustomEvent("colorChange", { detail: { color: getComputedStyle(document.documentElement).getPropertyValue("--button-background-color").trim() } }));
});
