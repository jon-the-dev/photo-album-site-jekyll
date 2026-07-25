(function initStillWild(globalScope) {
  "use strict";

  function wrapIndex(index, length) {
    if (!length) return 0;
    return ((index % length) + length) % length;
  }

  function formatSlideNumber(index) {
    return String(index + 1).padStart(2, "0");
  }

  const helpers = { wrapIndex, formatSlideNumber };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = helpers;
  }

  if (typeof document === "undefined") return;

  const reducedMotion = globalScope.matchMedia("(prefers-reduced-motion: reduce)");

  function initNavigation() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    const header = document.querySelector("[data-header]");
    if (!toggle || !nav || !header) return;

    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      header.classList.remove("nav-is-open");
    };

    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      header.classList.toggle("nav-is-open", willOpen);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    globalScope.addEventListener("resize", () => {
      if (globalScope.innerWidth > 760) close();
    });
  }

  function initHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) return;

    const update = () => header.classList.toggle("is-scrolled", globalScope.scrollY > 24);
    update();
    globalScope.addEventListener("scroll", update, { passive: true });
  }

  function initCarousel(carousel) {
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    const previous = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const dotsRoot = carousel.querySelector("[data-carousel-dots]");
    const currentLabel = carousel.querySelector("[data-carousel-current]");
    const status = carousel.querySelector("[data-carousel-status]");
    const shouldAutoplay = carousel.dataset.carouselAutoplay === "true" && !reducedMotion.matches;
    let current = 0;
    let timer = null;
    let pointerStart = null;

    if (!slides.length) return;

    const dots = slides.map((_, index) => {
      if (!dotsRoot) return null;
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to photograph ${index + 1}`);
      dot.addEventListener("click", () => show(index, true));
      dotsRoot.appendChild(dot);
      return dot;
    });

    function show(index, announce) {
      current = wrapIndex(index, slides.length);
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, dotIndex) => {
        if (!dot) return;
        dot.classList.toggle("is-active", dotIndex === current);
        dot.setAttribute("aria-current", dotIndex === current ? "true" : "false");
      });
      if (currentLabel) currentLabel.textContent = formatSlideNumber(current);
      if (status && announce) status.textContent = `Photograph ${current + 1} of ${slides.length}`;
    }

    function stop() {
      if (timer) globalScope.clearInterval(timer);
      timer = null;
    }

    function play() {
      stop();
      if (shouldAutoplay) {
        timer = globalScope.setInterval(() => show(current + 1, false), 5600);
      }
    }

    function move(direction) {
      show(current + direction, true);
      play();
    }

    previous?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    });
    carousel.addEventListener("pointerdown", (event) => {
      pointerStart = event.clientX;
    });
    carousel.addEventListener("pointerup", (event) => {
      if (pointerStart === null) return;
      const distance = event.clientX - pointerStart;
      if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
      pointerStart = null;
    });
    carousel.addEventListener("pointercancel", () => {
      pointerStart = null;
    });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", play);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", play);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else play();
    });

    show(0, false);
    play();
  }

  function initLightbox() {
    const dialog = document.querySelector("#lightbox");
    const items = Array.from(document.querySelectorAll("[data-lightbox-item]"));
    if (!dialog || !items.length) return;

    const image = dialog.querySelector("[data-lightbox-image]");
    const caption = dialog.querySelector("[data-lightbox-caption]");
    const close = dialog.querySelector("[data-lightbox-close]");
    const previous = dialog.querySelector("[data-lightbox-prev]");
    const next = dialog.querySelector("[data-lightbox-next]");
    let current = 0;

    const show = (index) => {
      current = wrapIndex(index, items.length);
      const item = items[current];
      image.src = item.dataset.fullSrc;
      image.alt = item.dataset.alt;
      caption.textContent = `${formatSlideNumber(current)} — ${item.dataset.caption}`;
    };

    const open = (index) => {
      show(index);
      dialog.showModal();
      document.body.classList.add("lightbox-is-open");
    };

    const dismiss = () => {
      dialog.close();
      document.body.classList.remove("lightbox-is-open");
      items[current]?.focus();
    };

    items.forEach((item, index) => item.addEventListener("click", () => open(index)));
    close?.addEventListener("click", dismiss);
    previous?.addEventListener("click", () => show(current - 1));
    next?.addEventListener("click", () => show(current + 1));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dismiss();
    });
    dialog.addEventListener("close", () => document.body.classList.remove("lightbox-is-open"));
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
    });
  }

  function initReveals() {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    if (reducedMotion.matches || !("IntersectionObserver" in globalScope)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
  }

  initNavigation();
  initHeader();
  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
  initLightbox();
  initReveals();
})(typeof window !== "undefined" ? window : globalThis);
