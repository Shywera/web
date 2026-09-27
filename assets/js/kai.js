/* kai.js — KAI-SOL, sustav v5
 * Jedan script za cijelu stranicu. Bez ovisnosti.
 * Sve što se pomiče gasi se na prefers-reduced-motion.
 * Sadržaj je čitljiv i bez JS-a: ovdje su samo poboljšanja.
 */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 1 · Fullscreen meni ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.getElementById("siteMenu");
  if (menuBtn && menu) {
    var setOpen = function (open) {
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menu.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
    };
    menuBtn.addEventListener("click", function () {
      setOpen(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---------- 2 · Godina u podnožju ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 3 · Spotlight: samo miš, samo ako gibanje nije isključeno ---------- */
  if (finePointer && !reduce) {
    var spot = document.createElement("div");
    spot.className = "spotlight";
    document.body.appendChild(spot);
    var spotRaf = null;
    window.addEventListener("mousemove", function (e) {
      spot.classList.add("active");
      if (spotRaf) return;
      spotRaf = requestAnimationFrame(function () {
        spot.style.setProperty("--mx", (e.clientX / window.innerWidth) * 100 + "%");
        spot.style.setProperty("--my", (e.clientY / window.innerHeight) * 100 + "%");
        spotRaf = null;
      });
    }, { passive: true });
    document.addEventListener("mouseleave", function () { spot.classList.remove("active"); });
  }

  /* ---------- 4 · Konfigurator paketa (usluge.html) ---------- */
  var conf = document.getElementById("konfigurator");
  if (conf) {
    var boxes = conf.querySelectorAll('input[type="checkbox"]');
    var elOne = document.getElementById("confOnetime");
    var elMon = document.getElementById("confMonthly");
    var cta = document.getElementById("confCta");
    var recalc = function () {
      var one = 0, mon = 0, picked = [];
      boxes.forEach(function (b) {
        if (!b.checked) return;
        one += parseInt(b.dataset.onetime || 0, 10);
        mon += parseInt(b.dataset.monthly || 0, 10);
        if (b.dataset.label) picked.push(b.dataset.label);
      });
      if (elOne) elOne.textContent = one > 0 ? "od " + one + " €" : "0 €";
      if (elMon) elMon.textContent = mon > 0 ? "od " + mon + " €" : "0 €";
      if (cta) {
        cta.href = picked.length
          ? "kontakt.html?paket=" + encodeURIComponent(picked.join(", "))
          : "kontakt.html";
      }
    };
    boxes.forEach(function (b) { b.addEventListener("change", recalc); });
    recalc();
  }

  /* ---------- 5 · Kontakt forma: priprema maila, bez backenda ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    /* Ako je korisnik došao iz konfiguratora, upiši odabrani paket u poruku */
    var paket = new URLSearchParams(window.location.search).get("paket");
    if (paket) {
      var poljePoruka = document.getElementById("f-poruka");
      if (poljePoruka && !poljePoruka.value) {
        poljePoruka.value = "Zanima nas paket: " + paket + ".\n\n";
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var val = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };
      var ime = val("f-ime"), email = val("f-email"), telefon = val("f-tel"),
          firma = val("f-firma"), usluga = val("f-usluga"),
          imamo = val("f-imamo"), poruka = val("f-poruka");

      if (!ime || !email) { form.reportValidity(); return; }

      var subject = "Upit za ponudu - " + (firma || ime);
      var lines = [
        "Ime i prezime: " + ime,
        "Email: " + email,
        "Telefon: " + (telefon || "-"),
        "Firma: " + (firma || "-"),
        "Zanima ga/ju: " + (usluga || "-"),
        "Trenutno stanje: " + (imamo || "-"),
        "",
        "Poruka:",
        (poruka || "-")
      ];
      window.location.href = "mailto:info@kai-sol.com"
        + "?subject=" + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(lines.join("\n"));

      var ok = document.getElementById("formSuccess");
      if (ok) {
        ok.hidden = false;
        ok.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
      }
    });
  }

  /* ---------- 6 · Izmjerene brojke ove stranice ----------
     Performance API u pregledniku posjetitelja. Ako preglednik
     ne da podatak, red se sakrije: nikad izmišljena brojka. */
  if (document.querySelector("[data-metric]")) {
    var setMetric = function (key, value, unit) {
      var el = document.querySelector('[data-metric="' + key + '"]');
      if (!el) return;
      if (value === null) {
        var row = el.closest(".spec-row");
        if (row) row.style.display = "none"; else el.innerHTML = "&mdash;";
        return;
      }
      var suffix = unit ? " " + unit : "";
      if (reduce) { el.textContent = value + suffix; return; }
      var start = performance.now(), dur = 700;
      var step = function (now) {
        var t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(value * (1 - Math.pow(1 - t, 3))) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    var measure = function () {
      var navEntry = (performance.getEntriesByType("navigation") || [])[0];
      var res = performance.getEntriesByType("resource") || [];

      var ms = null;
      if (navEntry && navEntry.domContentLoadedEventEnd) ms = Math.round(navEntry.domContentLoadedEventEnd);
      else if (performance.timing && performance.timing.domContentLoadedEventEnd)
        ms = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      setMetric("load", ms, "ms");

      var bytes = res.reduce(function (s, r) { return s + (r.transferSize || 0); }, 0);
      if (navEntry && navEntry.transferSize) bytes += navEntry.transferSize;
      setMetric("weight", bytes > 1024 ? Math.round(bytes / 1024) : null, "kB");

      setMetric("requests", res.length ? res.length + 1 : null, "");

      setMetric("scripts", res.filter(function (r) {
        return r.initiatorType === "script" && r.name.indexOf(location.origin) !== 0;
      }).length, "");
    };

    if (document.readyState === "complete") setTimeout(measure, 120);
    else window.addEventListener("load", function () { setTimeout(measure, 120); });
  }
})();
