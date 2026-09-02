// Paulo Magalhães — AOS + menu mobile + contadores da seção de números.
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 70,
      anchorPlacement: "top-bottom",
      disable: false,
    });
  }

  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  function closeMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  if (header) {
    window.addEventListener(
      "scroll",
      () => header.classList.toggle("is-scrolled", window.scrollY > 30),
      { passive: true }
    );
  }

  const counters = document.querySelectorAll(".contador[data-count]");

  function animateCounter(element) {
    if (element.dataset.counted === "true") return;
    element.dataset.counted = "true";

    const target = Number(element.dataset.count);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const duration = 1600;
    const startTime = performance.now();

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Curva rápida no começo e suave no final, parecida com contador/cronômetro.
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(target * eased);

      element.textContent = `${prefix}${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const visibleCounters = entry.target.querySelectorAll(".contador[data-count]");

          visibleCounters.forEach((counter, index) => {
            setTimeout(() => animateCounter(counter), index * 140);
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    const numbersSection = document.querySelector(".numeros-campanha");
    if (numbersSection) counterObserver.observe(numbersSection);
  } else {
    counters.forEach(animateCounter);
  }
});
