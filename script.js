/* ============================================
   Paulo Magalhães — Site institucional
   JavaScript puro (sem frameworks)
   ============================================ */

(function () {
  "use strict";

  /* ---------- Header com scroll ---------- */
  const header = document.getElementById("header");

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      nav.classList.remove("open");
    });
  });

  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove("active");
      nav.classList.remove("open");
    }
  });

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var revealElements = document.querySelectorAll(
    ".about-photo, .about-text, .number-card, .pauta-card, .quote, .contact-info, .contact-form"
  );

  revealElements.forEach(function (el) {
    el.classList.add("reveal");
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Contadores animados ---------- */
  var counters = document.querySelectorAll(".counter");
  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-target"), 10);
        var duration = 1600;
        var start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          var progress = Math.min((timestamp - start) / duration, 1);
          // ease-out quadrático
          var eased = 1 - (1 - progress) * (1 - progress);
          el.textContent = Math.round(target * eased);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (c) {
    counterObserver.observe(c);
  });

  /* ---------- Efeito parallax suave no hero ---------- */
  var particles = document.querySelectorAll(".hero-particle");
  if (particles.length) {
    window.addEventListener(
      "mousemove",
      function (e) {
        var cx = window.innerWidth / 2;
        var cy = window.innerHeight / 2;
        particles.forEach(function (p) {
          var depth = parseFloat(p.getAttribute("data-depth")) || 0.04;
          var dx = (e.clientX - cx) * depth;
          var dy = (e.clientY - cy) * depth;
          p.style.transform = "translate(" + dx + "px, " + dy + "px)";
        });
      },
      { passive: true }
    );
  }

  /* ---------- Efeito tilt 3D nos cards de pautas ---------- */
  var tiltCards = document.querySelectorAll(".tilt");

  tiltCards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -6;
      var rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform =
        "translateY(-8px) perspective(800px) rotateX(" +
        rotateX +
        "deg) rotateY(" +
        rotateY +
        "deg)";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "translateY(0) perspective(800px) rotateX(0) rotateY(0)";
    });
  });

  /* ---------- Formulário de contato (validação + feedback) ---------- */
  var form = document.getElementById("contactForm");
  var feedback = document.getElementById("formFeedback");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.querySelector("#name").value.trim();
    var email = form.querySelector("#email").value.trim();
    var message = form.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      feedback.style.color = "#b3261e";
      feedback.textContent = "Por favor, preencha nome, e-mail e mensagem.";
      return;
    }

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      feedback.style.color = "#b3261e";
      feedback.textContent = "Por favor, informe um e-mail válido.";
      return;
    }

    // Simulação de envio (site estático, sem backend)
    var btn = form.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.textContent = "Enviando...";

    setTimeout(function () {
      feedback.style.color = "#1e7d46";
      feedback.textContent =
        "Mensagem enviada com sucesso, " + name + "! Obrigado pelo contato.";
      form.reset();
      btn.disabled = false;
      btn.textContent = "Enviar mensagem";
    }, 900);
  });
})();
