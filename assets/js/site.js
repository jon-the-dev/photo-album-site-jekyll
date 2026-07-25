(function initSpooledPixels(globalScope) {
  "use strict";

  const ANALYTICS_STORAGE_KEY = "spooled_pixels_analytics_consent";

  function wrapIndex(index, length) {
    if (!length) return 0;
    return ((index % length) + length) % length;
  }

  function formatSlideNumber(index) {
    return String(index + 1).padStart(2, "0");
  }

  function isValidMeasurementId(value) {
    return /^G-[A-Z0-9]{4,}$/i.test(String(value || "").trim());
  }

  function analyticsParamsFromDataset(dataset) {
    return Object.keys(dataset || {}).reduce((params, key) => {
      if (!key.startsWith("analytics") || key === "analyticsEvent") return params;

      const parameterName = key
        .replace(/^analytics/, "")
        .replace(/^[A-Z]/, (character) => character.toLowerCase())
        .replace(/[A-Z]/g, (character) => `_${character.toLowerCase()}`);

      if (parameterName && dataset[key]) params[parameterName] = dataset[key];
      return params;
    }, {});
  }

  const helpers = {
    analyticsParamsFromDataset,
    formatSlideNumber,
    isValidMeasurementId,
    wrapIndex,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = helpers;
  }

  if (typeof document === "undefined") return;

  const reducedMotion = globalScope.matchMedia("(prefers-reduced-motion: reduce)");
  let analyticsReady = false;

  function trackAnalyticsEvent(eventName, parameters = {}) {
    if (!analyticsReady || typeof globalScope.gtag !== "function") return false;
    globalScope.gtag("event", eventName, parameters);
    return true;
  }

  function disableGoogleAnalytics(measurementId) {
    globalScope[`ga-disable-${measurementId}`] = true;
    analyticsReady = false;
  }

  function clearGoogleAnalyticsCookies() {
    const domains = globalScope.location.hostname
      .split(".")
      .map((_, index, parts) => parts.slice(index).join("."))
      .filter((domain) => domain.includes("."));

    document.cookie
      .split(";")
      .map((cookie) => cookie.split("=")[0].trim())
      .filter((name) => name === "_ga" || name.startsWith("_ga_"))
      .forEach((name) => {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
        domains.forEach((domain) => {
          document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
        });
      });
  }

  function loadGoogleAnalytics(measurementId) {
    if (!isValidMeasurementId(measurementId)) return false;

    globalScope[`ga-disable-${measurementId}`] = false;
    globalScope.dataLayer = globalScope.dataLayer || [];
    globalScope.gtag =
      globalScope.gtag ||
      function gtag() {
        globalScope.dataLayer.push(arguments);
      };

    if (!document.querySelector("[data-google-analytics-script]")) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.googleAnalyticsScript = measurementId;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);

      globalScope.gtag("js", new Date());
      globalScope.gtag("config", measurementId, {
        allow_ad_personalization_signals: false,
        allow_google_signals: false,
        anonymize_ip: true,
      });
    }

    analyticsReady = true;
    return true;
  }

  function initAnalytics() {
    const config = globalScope.spooledAnalyticsConfig;
    if (!config || !isValidMeasurementId(config.measurementId)) return;

    const measurementId = config.measurementId.trim();
    const consent = document.querySelector("[data-analytics-consent]");
    const accept = consent?.querySelector("[data-analytics-accept]");
    const decline = consent?.querySelector("[data-analytics-decline]");
    const manage = document.querySelector("[data-analytics-manage]");
    let consentReturnFocus = null;

    const readChoice = () => {
      try {
        return globalScope.localStorage.getItem(ANALYTICS_STORAGE_KEY);
      } catch {
        return null;
      }
    };

    const saveChoice = (choice) => {
      try {
        globalScope.localStorage.setItem(ANALYTICS_STORAGE_KEY, choice);
      } catch {
        // Analytics preference still applies for this page when storage is unavailable.
      }
    };

    const showConsent = (returnFocusTo = null) => {
      if (!consent) return;
      consentReturnFocus = returnFocusTo;
      consent.hidden = false;
      globalScope.requestAnimationFrame(() => consent.classList.add("is-visible"));
      accept?.focus({ preventScroll: true });
    };

    const hideConsent = () => {
      if (!consent) return;
      consent.classList.remove("is-visible");
      globalScope.setTimeout(() => {
        consent.hidden = true;
        consentReturnFocus?.focus({ preventScroll: true });
        consentReturnFocus = null;
      }, reducedMotion.matches ? 0 : 320);
    };

    const allow = () => {
      saveChoice("granted");
      hideConsent();
      loadGoogleAnalytics(measurementId);
    };

    const deny = () => {
      saveChoice("denied");
      hideConsent();
      disableGoogleAnalytics(measurementId);
      clearGoogleAnalyticsCookies();
    };

    accept?.addEventListener("click", allow);
    decline?.addEventListener("click", deny);
    manage?.addEventListener("click", () => showConsent(manage));

    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-analytics-event]");
      if (!target) return;
      trackAnalyticsEvent(
        target.dataset.analyticsEvent,
        analyticsParamsFromDataset(target.dataset)
      );
    });

    if (config.requireConsent === false) {
      loadGoogleAnalytics(measurementId);
      return;
    }

    const choice = readChoice();
    if (choice === "granted") loadGoogleAnalytics(measurementId);
    else if (choice === "denied") disableGoogleAnalytics(measurementId);
    else showConsent();
  }

  function initNavigation() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    const header = document.querySelector("[data-header]");
    if (!toggle || !nav || !header) return;

    const toggleLabel = toggle.querySelector(".sr-only");
    const pageRegions = [
      document.querySelector("main"),
      document.querySelector(".site-footer"),
    ].filter(Boolean);

    const setOpen = (isOpen, returnFocus = false) => {
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (toggleLabel) toggleLabel.textContent = isOpen ? "Close navigation" : "Open navigation";
      header.classList.toggle("nav-is-open", isOpen);
      document.body.classList.toggle("navigation-is-open", isOpen);
      pageRegions.forEach((region) => {
        region.inert = isOpen;
      });

      if (isOpen) {
        globalScope.requestAnimationFrame(() => nav.querySelector("a")?.focus());
      } else if (returnFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(willOpen, !willOpen);
    });

    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setOpen(false))
    );
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || toggle.getAttribute("aria-expanded") !== "true") return;
      event.preventDefault();
      setOpen(false, true);
    });
    globalScope.addEventListener("resize", () => {
      if (globalScope.innerWidth > 760) setOpen(false);
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
      dot.addEventListener("click", () => {
        show(index, true);
        trackAnalyticsEvent("carousel_navigated", {
          carousel: carousel.dataset.analyticsName || "featured_photos",
          interaction: "pagination",
          photo_index: current + 1,
        });
      });
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

    function move(direction, interaction) {
      show(current + direction, true);
      trackAnalyticsEvent("carousel_navigated", {
        carousel: carousel.dataset.analyticsName || "featured_photos",
        direction: direction < 0 ? "previous" : "next",
        interaction,
        photo_index: current + 1,
      });
      play();
    }

    previous?.addEventListener("click", () => move(-1, "button"));
    next?.addEventListener("click", () => move(1, "button"));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1, "keyboard");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1, "keyboard");
      }
    });
    carousel.addEventListener("pointerdown", (event) => {
      pointerStart = event.clientX;
    });
    carousel.addEventListener("pointerup", (event) => {
      if (pointerStart === null) return;
      const distance = event.clientX - pointerStart;
      if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1, "swipe");
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
      image.srcset = item.dataset.fullSrcset || "";
      image.sizes = "100vw";
      image.src = item.dataset.fullSrc;
      image.alt = item.dataset.alt;
      caption.textContent = `${formatSlideNumber(current)} — ${item.dataset.caption}`;
    };

    const open = (index) => {
      show(index);
      dialog.showModal();
      document.body.classList.add("lightbox-is-open");
      trackAnalyticsEvent("photo_opened", {
        photo_index: current + 1,
        photo_name: `photo_${formatSlideNumber(current)}`,
      });
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

  initAnalytics();
  initNavigation();
  initHeader();
  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
  initLightbox();
  initReveals();
})(typeof window !== "undefined" ? window : globalThis);
