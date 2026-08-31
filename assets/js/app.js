/* ============================================================
   KAI-SOL — app.js
   Moduli:
     1. initNav          sticky zaglavlje, mobilni izbornik, aktivna sekcija
     2. initReveals      otkrivanje sadržaja pri listanju
     3. initRotator      kinetička izmjena riječi u naslovu
     4. initHeroCanvas   interaktivna mreža točaka u pozadini hero sekcije
     5. initCalculator   izračun učinka optimizacije
     6. initForm         validacija i slanje kontaktne forme
     7. initMisc         godina u podnožju, oznake odabira u select poljima
   Sve funkcije su neovisne i tiho preskaču izvođenje ako element ne postoji.
   ============================================================ */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Navigacija ---------- */
  function initNav() {
    var header = document.querySelector(".header");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("glavnaNavigacija");

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 10);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        nav.classList.toggle("is-open", open);
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          toggle.setAttribute("aria-expanded", "false");
          nav.classList.remove("is-open");
        });
      });
    }

    // Označavanje aktivne sekcije u navigaciji
    var anchors = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
    var sections = anchors
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            anchors.forEach(function (a) {
              a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach(function (section) { spy.observe(section); });
    }
  }

  /* ---------- 2. Otkrivanje pri listanju ---------- */
  function initReveals() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || reducedMotion) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. Kinetički rotator riječi ---------- */
  function initRotator() {
    var rotator = document.getElementById("rotator");
    if (!rotator) return;

    var items = Array.prototype.slice.call(rotator.querySelectorAll(".rotator__item"));
    if (items.length < 2 || reducedMotion) return;

    var index = 0;
    setInterval(function () {
      var current = items[index];
      index = (index + 1) % items.length;
      var next = items[index];

      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      next.classList.add("is-active");

      setTimeout(function () { current.classList.remove("is-leaving"); }, 600);
    }, 2800);
  }

  /* ---------- 4. Interaktivna mreža u hero sekciji ---------- */
  function initHeroCanvas() {
    var canvas = document.getElementById("heroCanvas");
    if (!canvas || reducedMotion) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dots = [];
    var pointer = { x: -9999, y: -9999 };
    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var frame = null;
    var visible = true;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    }

    function buildDots() {
      // Gustoća se prilagođava površini, na mobitelu je znatno manje točaka.
      var target = Math.min(96, Math.round((width * height) / 16000));
      dots = [];
      for (var i = 0; i < target; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.5 + 0.6
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];

        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;

        // Blago odmicanje od pokazivača
        var dx = d.x - pointer.x;
        var dy = d.y - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist > 0.1) {
          var push = (130 - dist) / 130;
          d.x += (dx / dist) * push * 1.6;
          d.y += (dy / dist) * push * 1.6;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(20, 201, 154, " + (dist < 180 ? 0.55 : 0.28) + ")";
        ctx.fill();

        // Linije prema bliskim susjedima
        for (var j = i + 1; j < dots.length; j++) {
          var o = dots[j];
          var lx = d.x - o.x;
          var ly = d.y - o.y;
          var ld = Math.sqrt(lx * lx + ly * ly);
          if (ld > 118) continue;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(o.x, o.y);
          ctx.strokeStyle = "rgba(20, 201, 154, " + (0.14 * (1 - ld / 118)) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      frame = requestAnimationFrame(draw);
    }

    function start() { if (!frame) frame = requestAnimationFrame(draw); }
    function stop() { if (frame) { cancelAnimationFrame(frame); frame = null; } }

    window.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }, { passive: true });

    window.addEventListener("mouseout", function () {
      pointer.x = -9999;
      pointer.y = -9999;
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    }, { passive: true });

    // Animacija miruje kada hero nije u vidnom polju (ušteda baterije)
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0 });
      io.observe(canvas);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (visible) start();
    });

    resize();
    start();
  }

  /* ---------- 5. Izračun učinka ---------- */
  function initCalculator() {
    var visitors = document.getElementById("posjetitelji");
    var rate = document.getElementById("konverzija");
    var value = document.getElementById("vrijednost");
    if (!visitors || !rate || !value) return;

    var UPLIFT = 1.4; // ilustrativno poboljšanje od 40 %

    var out = {
      visitors: document.getElementById("posjetiteljiVrijednost"),
      rate: document.getElementById("konverzijaVrijednost"),
      value: document.getElementById("vrijednostVrijednost"),
      now: document.getElementById("upitiSada"),
      after: document.getElementById("upitiPoslije"),
      revenue: document.getElementById("dodatniPrihod")
    };

    var nf = new Intl.NumberFormat("hr-HR");
    var cf = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

    function update() {
      var v = Number(visitors.value);
      var r = Number(rate.value);
      var avg = Number(value.value);

      var leadsNow = (v * r) / 100;
      var leadsAfter = leadsNow * UPLIFT;
      var extraRevenue = (leadsAfter - leadsNow) * avg;

      if (out.visitors) out.visitors.textContent = nf.format(v);
      if (out.rate) out.rate.textContent = r.toFixed(1).replace(".", ",") + " %";
      if (out.value) out.value.textContent = cf.format(avg);
      if (out.now) out.now.textContent = nf.format(Math.round(leadsNow));
      if (out.after) out.after.textContent = nf.format(Math.round(leadsAfter));
      if (out.revenue) out.revenue.textContent = cf.format(Math.round(extraRevenue));
    }

    [visitors, rate, value].forEach(function (input) {
      input.addEventListener("input", update);
    });
    update();
  }

  /* ---------- 6. Kontaktna forma ---------- */
  function initForm() {
    var form = document.getElementById("kontaktForma");
    if (!form) return;

    var success = document.getElementById("formaUspjeh");

    function fieldOf(input) { return input.closest(".field"); }

    function validate(input) {
      var wrap = fieldOf(input);
      if (!wrap) return true;
      var ok = input.checkValidity();
      wrap.classList.toggle("is-invalid", !ok);
      return ok;
    }

    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("blur", function () {
        if (input.value.trim() !== "" || input.required) validate(input);
      });
      input.addEventListener("input", function () {
        var wrap = fieldOf(input);
        if (wrap && wrap.classList.contains("is-invalid")) validate(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var required = Array.prototype.slice.call(form.querySelectorAll("[required]"));
      var valid = required.every(function (input) { return validate(input); });

      if (!valid) {
        var firstInvalid = form.querySelector(".field.is-invalid input");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var val = function (id) {
        var el = document.getElementById(id);
        return el && el.value.trim() ? el.value.trim() : "-";
      };

      var subject = "Upit s web stranice - " + (val("tvrtka") !== "-" ? val("tvrtka") : val("ime"));
      var body = [
        "Ime i prezime: " + val("ime"),
        "E-pošta: " + val("email"),
        "Telefon: " + val("telefon"),
        "Tvrtka: " + val("tvrtka"),
        "Zanima ga/ju: " + val("usluga"),
        "",
        "Poruka:",
        val("poruka")
      ].join("\n");

      window.location.href =
        "mailto:info@kai-sol.com?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
      }
    });
  }

  /* ---------- 7. Sitnice ---------- */
  function initMisc() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // Select polja: plutajuća oznaka ostaje podignuta kada je nešto odabrano
    document.querySelectorAll(".field select").forEach(function (select) {
      var sync = function () { select.classList.toggle("has-value", select.value !== ""); };
      select.addEventListener("change", sync);
      sync();
    });
  }

  /* ---------- Pokretanje ---------- */
  initNav();
  initReveals();
  initRotator();
  initHeroCanvas();
  initCalculator();
  initForm();
  initMisc();
})();
