/* KAI-SOL · interakcije: sticky header, mobilni meni, reveal on scroll, brojači */
(function () {
  "use strict";

  // Sticky header sjena/blur nakon scrolla
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobilni meni
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Reveal on scroll
  const revealables = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealables.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("in"));
  }

  // Brojači (data-count)
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          const dur = 1400;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target % 1 ? (target * eased).toFixed(1) : Math.round(target * eased);
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          co.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => co.observe(el));
  }

  // Godina u footeru
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // Typewriter: ciklički ispisuje riječi iz data-words ("Web izrada|Dizajn|...")
  var typers = document.querySelectorAll("[data-typewriter]");
  if (typers.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typers.forEach(function (el) {
      var words = (el.dataset.words || el.textContent).split("|").filter(Boolean);
      if (words.length < 2) return;
      var caret = document.createElement("span");
      caret.className = "type-caret";
      el.after(caret);
      var wi = 0, ci = 0, deleting = false;
      var tick = function () {
        var word = words[wi];
        ci += deleting ? -1 : 1;
        el.textContent = word.slice(0, ci);
        var delay = deleting ? 40 : 80;
        if (!deleting && ci === word.length) { delay = 1400; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 1200);
    });
  }

  // Magnetični gumbi: lagano prate kursor unutar svog okvira
  var magnets = document.querySelectorAll(".btn-magnetic");
  if (magnets.length && window.matchMedia("(hover: hover)").matches) {
    magnets.forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.18 + "px, " + y * 0.35 + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  // Konfigurator paketa (usluge.html): zbraja odabrane usluge i sprema odabir u CTA link
  var configurator = document.querySelector(".configurator");
  if (configurator) {
    var boxes = configurator.querySelectorAll('input[type="checkbox"]');
    var onetimeEl = document.getElementById("confOnetime");
    var monthlyEl = document.getElementById("confMonthly");
    var cta = document.getElementById("confCta");
    var recalc = function () {
      var onetime = 0, monthly = 0, labels = [];
      boxes.forEach(function (b) {
        if (!b.checked) return;
        onetime += Number(b.dataset.onetime || 0);
        monthly += Number(b.dataset.monthly || 0);
        if (b.dataset.label) labels.push(b.dataset.label);
      });
      if (onetimeEl) onetimeEl.textContent = onetime + " €";
      if (monthlyEl) monthlyEl.textContent = monthly + " €/mj";
      if (cta) {
        var params = new URLSearchParams();
        params.set("paket", labels.join(", ") || "Upit bez odabira");
        params.set("jednokratno", onetime);
        params.set("mjesecno", monthly);
        cta.href = "kontakt.html?" + params.toString();
      }
    };
    boxes.forEach(function (b) { b.addEventListener("change", recalc); });
    recalc();
  }
})();
