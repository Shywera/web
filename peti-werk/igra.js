/* Peti werk: igra. Pet odjela, jedno pitanje po odjelu, svaki dan isto za sve. */
(function () {
  "use strict";

  var ODJELI = ["Papir", "Priprema", "Tisak", "Dorada", "Skladište"];
  var TOCNO = 60, BLIZU = 30, BRZINA = 40, POCEK = 5;
  var ROK = { izbor: 30, broj: 35, redoslijed: 45 };
  var DAN_NULA = Date.UTC(2026, 10, 1);
  var SLOVA = ["A", "B", "C", "D"];
  var RIJEC = { tocno: "Točno", blizu: "Blizu", krivo: "Krivo", vrijeme: "Prekasno" };
  // Što se s arkom dogodilo u odjelu: [dobro, loše]
  var POGON = [
    ["Papir je ravan i ide na stroj.", "Papir se zavalovio."],
    ["Montaža sjedi, ploče su dobre.", "Montaža je otišla ukrivo."],
    ["Otisak je u paseru.", "Otisak nije u paseru."],
    ["Rez je čist.", "Rez je pobjegao."],
    ["Paleta je složena i označena.", "Gornja kutija se nagnula."]
  ];

  var ploca = document.getElementById("ploca");
  var stripEl = document.getElementById("strip");
  var rokCrta = document.getElementById("rok-crta");
  var gumbLjestvica = document.getElementById("gumb-ljestvica");
  var postavke = window.PW_POSTAVKE || {};
  var banka = ucitajBanku();
  var partija = null;      // { vrsta, datum, pitanja: [id], odgovori: [{id, ishod, bodovi, sek, dao}], postavljeno }
  var obrada = Promise.resolve();
  var sat = null;
  var povratak = null;     // na koji se ekran vraća iz ljestvice

  // ---------------------------------------------------------------- pomoćno
  function el(tag, svojstva) {
    var e = document.createElement(tag), i, d;
    for (var k in (svojstva || {})) {
      var v = svojstva[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (i = 2; i < arguments.length; i++) {
      d = arguments[i];
      if (d === null || d === undefined || d === false) continue;
      if (Array.isArray(d)) d.forEach(function (x) { if (x) e.appendChild(typeof x === "string" ? document.createTextNode(x) : x); });
      else e.appendChild(typeof d === "string" ? document.createTextNode(d) : d);
    }
    return e;
  }

  function prikazi() {
    ploca.replaceChildren.apply(ploca, Array.prototype.slice.call(arguments).filter(Boolean));
  }

  function spremi(kljuc, v) { try { localStorage.setItem("pw:" + kljuc, JSON.stringify(v)); } catch (e) { /* privatni način */ } }
  function citaj(kljuc, zadano) {
    try { var s = localStorage.getItem("pw:" + kljuc); return s === null ? zadano : JSON.parse(s); } catch (e) { return zadano; }
  }

  function hash(s) {
    var h = 1779033703 ^ s.length;
    for (var i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
  }
  function slucaj(sjeme) {
    var a = hash(sjeme);
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function promijesaj(niz, sjeme) {
    var r = slucaj(sjeme), a = niz.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function danas() {
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zagreb", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    } catch (e) {
      var d = new Date();
      return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    }
  }
  function utc(datum) { var p = datum.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function lijepDatum(datum) { var p = datum.split("-"); return p[2] + "." + p[1] + "." + p[0] + "."; }
  function plusDana(datum, n) { return new Date(utc(datum) + n * 86400000).toISOString().slice(0, 10); }
  function danUTjednu(datum) { return new Date(utc(datum)).getUTCDay(); }   // 0 = nedjelja

  function brojHr(x) { return String(x).replace(".", ","); }
  function bodova(n) {
    var j = n % 10, d = n % 100;
    if (j === 1 && d !== 11) return n + " bod";
    if (j >= 2 && j <= 4 && (d < 12 || d > 14)) return n + " boda";
    return n + " bodova";
  }
  function zastoja(n) { return n === 1 ? "1 zastoj" : n + " zastoja"; }
  function los(ishod) { return ishod === "krivo" || ishod === "vrijeme"; }

  // ---------------------------------------------------------------- pitanja
  function ucitajBanku() {
    var po = [[], [], [], [], []], sva = {};
    try {
      var bajtovi = Uint8Array.from(atob(window.PW_PITANJA || ""), function (c) { return c.charCodeAt(0); });
      JSON.parse(new TextDecoder().decode(bajtovi)).forEach(function (p) {
        if (po[p.o]) { po[p.o].push(p); sva[p.id] = p; }
      });
    } catch (e) { /* bez pitanja igra javi grešku na početnoj */ }
    po.forEach(function (niz) { niz.sort(function (a, b) { return a.id < b.id ? -1 : 1; }); });
    return { po: po, sva: sva, ima: po.every(function (niz) { return niz.length > 0; }) };
  }

  // Jedno pitanje po odjelu, isto za sve: redoslijed se promiješa po krugu, pa se pitanje ne ponovi dok krug ne prođe.
  function dnevnoPitanje(odjel, dan) {
    var niz = banka.po[odjel], n = niz.length;
    var krug = Math.floor(dan / n), mjesto = ((dan % n) + n) % n;
    var red = promijesaj(niz, "pw|" + odjel + "|" + krug);
    if (mjesto === 0 && n > 1) {
      var prije = promijesaj(niz, "pw|" + odjel + "|" + (krug - 1));
      if (prije[n - 1].id === red[0].id) return red[1].id;
    }
    return red[mjesto].id;
  }
  function dnevnaPitanja(datum) {
    var dan = Math.round((utc(datum) - DAN_NULA) / 86400000);
    return ODJELI.map(function (_, o) { return dnevnoPitanje(o, dan); });
  }
  function pitanjaZaVjezbu(izbjegni) {
    return ODJELI.map(function (_, o) {
      var niz = banka.po[o].filter(function (p) { return izbjegni.indexOf(p.id) < 0; });
      if (!niz.length) niz = banka.po[o];
      return niz[Math.floor(Math.random() * niz.length)].id;
    });
  }

  // ---------------------------------------------------------------- stanje
  function ime() { return citaj("ime", ""); }
  function urediIme(s) { return String(s || "").replace(/\s+/g, " ").trim().slice(0, 24); }
  function povijest() { return citaj("povijest", []); }

  function ucitajDan() {
    var d = citaj("dan", null);
    return d && d.datum === danas() && Array.isArray(d.pitanja) && d.pitanja.every(function (id) { return banka.sva[id]; }) ? d : null;
  }
  function spremiPartiju() { if (partija && partija.vrsta === "dan") spremi("dan", partija); }
  function ishodi() { return partija ? partija.odgovori.map(function (o) { return o.ishod; }) : []; }
  function ukupno(p) { return p.odgovori.reduce(function (z, o) { return z + o.bodovi; }, 0); }
  function sekundi(p) { return Math.round(p.odgovori.reduce(function (z, o) { return z + o.sek; }, 0)); }
  function werkovi(p) { return p.odgovori.map(function (o) { return o.ishod === "tocno" ? "2" : o.ishod === "blizu" ? "1" : "0"; }).join(""); }

  // Niz dana zaredom; vikend bez igre ne prekida niz.
  function niz() {
    var dani = {}, n = 0, d = danas();
    povijest().forEach(function (p) { dani[p.d] = true; });
    if (!dani[d]) d = plusDana(d, -1);
    for (var i = 0; i < 400; i++, d = plusDana(d, -1)) {
      if (dani[d]) n++;
      else if (danUTjednu(d) !== 0 && danUTjednu(d) !== 6) break;
    }
    return n;
  }

  // ---------------------------------------------------------------- strip i rok
  function crtajStrip() {
    var is = ishodi(), sada = partija && is.length < 5 ? is.length : -1;
    stripEl.replaceChildren.apply(stripEl, ODJELI.map(function (naziv, i) {
      var stanje = i < is.length ? (los(is[i]) ? "krivo" : is[i]) : (i === sada ? "sada" : "");
      var opis = i < is.length ? RIJEC[is[i]].toLowerCase() : (i === sada ? "na redu" : "čeka");
      return el("li", { class: stanje }, el("span", { class: "polje" }),
        el("span", { class: "strip-ime", text: naziv, "aria-label": naziv + ": " + opis }));
    }));
  }

  function zaustaviSat() {
    if (sat) { cancelAnimationFrame(sat.okvir); clearTimeout(sat.kraj); sat = null; }
    rokCrta.classList.remove("kraj");
    rokCrta.style.transform = "scaleX(0)";
  }

  // Crta roka se crta iz sata, okvir po okvir: tako stane točno kad stane i sat.
  function pokreniSat(rok, proteklo, prikaz, naIstek) {
    zaustaviSat();
    var pocetak = partija.postavljeno, zadnje = -1;
    var moj = sat = { okvir: 0, kraj: setTimeout(naIstek, Math.max(0, rok - proteklo) * 1000 + 60) };
    (function okvir() {
      if (sat !== moj) return;
      var ostalo = Math.max(0, rok - (Date.now() - pocetak) / 1000), s = Math.ceil(ostalo);
      rokCrta.style.transform = "scaleX(" + (ostalo / rok).toFixed(4) + ")";
      if (s !== zadnje) {
        zadnje = s;
        prikaz.textContent = "0:" + ("0" + s).slice(-2);
        prikaz.classList.toggle("malo", s <= 5);
        rokCrta.classList.toggle("kraj", s <= 5);
      }
      moj.okvir = requestAnimationFrame(okvir);
    })();
  }

  // ---------------------------------------------------------------- ekrani: ulaz i početna
  function obrazacImena(naslov, gumb, nakon) {
    var unos = el("input", { class: "unos", id: "ime", type: "text", maxlength: "24", autocomplete: "nickname",
      autocapitalize: "words", enterkeyhint: "go", value: ime() });
    var greska = el("p", { class: "greska", role: "alert" });
    return el("form", { class: "polje-okvir", novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      var v = urediIme(unos.value);
      if (v.length < 2) {
        unos.setAttribute("aria-invalid", "true");
        greska.textContent = "Upiši ime, barem dva slova.";
        unos.focus();
        return;
      }
      spremi("ime", v);
      nakon();
    } }, el("label", { for: "ime", text: naslov }), unos,
      el("p", { class: "sitno", text: spojena() ? "Pod tim imenom si na ljestvici." : "Ime ide uz tvoj rezultat." }), greska,
      el("button", { class: "gumb glavni siri", type: "submit", text: gumb }));
  }

  function ekranUlaz() {
    gumbLjestvica.disabled = false;
    Scena.postavi([]);
    crtajStrip();
    prikazi(
      el("h1", { class: "naslov", text: "Provedi arak kroz tiskaru" }),
      el("p", { class: "uvod", text: "Pet odjela, pet pitanja, svaki dan novi radni nalog. Točan i brz odgovor nosi najviše bodova." }),
      obrazacImena("Tvoje ime", "Kreni", pocetna));
  }

  function ekranPromjenaImena() {
    prikazi(el("h1", { class: "naslov", text: "Promjena imena" }),
      obrazacImena("Novo ime", "Spremi", pocetna),
      el("button", { class: "veza", type: "button", text: "Odustani", onclick: pocetna }));
    document.getElementById("ime").focus();
  }

  function pocetna() {
    zaustaviSat();
    povratak = null;
    gumbLjestvica.disabled = false;
    gumbLjestvica.setAttribute("aria-pressed", "false");
    if (!banka.ima) {
      partija = null; crtajStrip();
      return prikazi(el("h1", { class: "naslov", text: "Pitanja se nisu učitala" }),
        el("p", { class: "uvod", text: "Osvježi stranicu. Ako se ponovi, javi onome tko održava igru." }));
    }
    if (!ime()) { partija = null; return ekranUlaz(); }
    partija = ucitajDan();
    if (partija && partija.odgovori.length >= 5) return ekranKraj();
    Scena.postavi(ishodi());
    crtajStrip();
    var uTijeku = partija && (partija.odgovori.length > 0 || partija.postavljeno);
    var n = niz();
    prikazi(
      el("h1", { class: "naslov", text: "Bok, " + ime() }),
      el("p", { class: "uvod", text: uTijeku
        ? "Radni nalog za " + lijepDatum(danas()) + " je otvoren i stoji na pola puta. Sat za pitanje koje si vidio i dalje teče."
        : "Radni nalog za " + lijepDatum(danas()) + " čeka: pet pitanja, oko tri minute. Na svako pitanje imaš jedan pokušaj." }),
      el("button", { class: "gumb glavni siri", type: "button", text: uTijeku ? "Nastavi radni nalog" : "Otvori današnji radni nalog",
        onclick: function () { zapocni("dan"); } }),
      n > 0 ? el("p", { class: "sitno", text: "Niz: " + n + (n === 1 ? " dan" : " dana") + " zaredom." }) : null,
      el("button", { class: "veza", type: "button", text: "Promijeni ime", onclick: ekranPromjenaImena }));
    if (partija) partija = null;   // partija se učita ponovo kad igrač stisne gumb
  }

  // ---------------------------------------------------------------- partija
  function zapocni(vrsta) {
    if (vrsta === "dan") {
      partija = ucitajDan() || { vrsta: "dan", datum: danas(), pitanja: dnevnaPitanja(danas()), odgovori: [], postavljeno: null };
    } else {
      var danasnja = dnevnaPitanja(danas());
      partija = { vrsta: "vjezba", datum: danas(), pitanja: pitanjaZaVjezbu(danasnja), odgovori: [], postavljeno: null,
        sjeme: String(Math.random()) };
    }
    obrada = Promise.resolve();
    Scena.postavi(ishodi());
    ekranPitanje();
  }

  function redoslijedOdgovora(p) {
    var n = p.v === "izbor" ? p.a.length : p.k.length, idx = [];
    for (var i = 0; i < n; i++) idx.push(i);
    var red = promijesaj(idx, "r|" + (partija.sjeme || partija.datum) + "|" + p.id);
    if (p.v === "redoslijed" && red.every(function (x, j) { return x === j; })) red.push(red.shift());
    if (p.v === "izbor" && p.a.length === 2) return [0, 1];   // Točno / Netočno ostaje tim redom
    return red;
  }

  function ekranPitanje() {
    var i = partija.odgovori.length, p = banka.sva[partija.pitanja[i]], rok = ROK[p.v];
    gumbLjestvica.disabled = true;
    if (!partija.postavljeno) { partija.postavljeno = Date.now(); spremiPartiju(); }
    var proteklo = (Date.now() - partija.postavljeno) / 1000;
    crtajStrip();
    if (proteklo >= rok) return predaj(null, true);

    var prikazSata = el("span", { class: "sat" });
    var tijelo = p.v === "izbor" ? tijeloIzbor(p) : p.v === "broj" ? tijeloBroj(p) : tijeloRedoslijed(p);
    prikazi(
      el("p", { class: "korak" }, el("span", { text: (i + 1) + " / 5 · " + ODJELI[i] + (partija.vrsta === "vjezba" ? " · vježba" : "") }), prikazSata),
      el("h1", { class: "pitanje", text: p.p }),
      tijelo);
    pokreniSat(rok, proteklo, prikazSata, function () { predaj(null, true); });
    ploca.focus({ preventScroll: true });
  }

  function tijeloIzbor(p) {
    return el("div", { class: "odgovori" }, redoslijedOdgovora(p).map(function (izvorni, mjesto) {
      return el("button", { class: "odgovor", type: "button", onclick: function () { predaj(izvorni, false); } },
        el("span", { class: "slovo", text: SLOVA[mjesto] }), el("span", { text: p.a[izvorni] }));
    }));
  }

  function tijeloBroj(p) {
    var unos = el("input", { class: "unos", id: "broj", type: "text", inputmode: "decimal", autocomplete: "off",
      enterkeyhint: "done", "aria-label": "Tvoj odgovor" + (p.j ? " u jedinici " + p.j : "") });
    var greska = el("p", { class: "greska", role: "alert" });
    var obrazac = el("form", { class: "polje-okvir", novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      var s = unos.value.replace(/\s/g, "").replace(",", ".");
      if (!/^-?\d+(\.\d+)?$/.test(s)) {
        unos.setAttribute("aria-invalid", "true");
        greska.textContent = "Upiši broj, na primjer 12 ili 0,3.";
        unos.focus();
        return;
      }
      predaj(parseFloat(s), false);
    } }, el("div", { class: "broj-red" },
      el("div", { class: "broj-polje" }, unos, p.j ? el("span", { class: "jedinica", text: p.j }) : null),
      el("button", { class: "gumb glavni", type: "submit", text: "Potvrdi" })), greska);
    setTimeout(function () { unos.focus({ preventScroll: true }); }, 50);
    return obrazac;
  }

  function tijeloRedoslijed(p) {
    var odabrano = [], gumbi = {};
    var potvrdi = el("button", { class: "gumb glavni siri", type: "button", text: "Potvrdi redoslijed", disabled: true,
      onclick: function () { predaj(odabrano.slice(), false); } });
    function osvjezi() {
      Object.keys(gumbi).forEach(function (k) {
        var mjesto = odabrano.indexOf(+k), g = gumbi[k];
        g.setAttribute("aria-pressed", mjesto >= 0 ? "true" : "false");
        g.firstChild.textContent = mjesto >= 0 ? String(mjesto + 1) : "";
      });
      potvrdi.disabled = odabrano.length !== p.k.length;
    }
    var lista = el("div", { class: "odgovori" }, redoslijedOdgovora(p).map(function (izvorni) {
      var g = el("button", { class: "odgovor", type: "button", "aria-pressed": "false", onclick: function () {
        var m = odabrano.indexOf(izvorni);
        if (m >= 0) odabrano.splice(m, 1); else odabrano.push(izvorni);
        osvjezi();
      } }, el("span", { class: "slovo" }), el("span", { text: p.k[izvorni] }));
      gumbi[izvorni] = g;
      return g;
    }));
    return el("div", { class: "polje-okvir" },
      el("p", { class: "sitno", text: "Dodiruj redom, od prvog do zadnjeg. Ponovni dodir poništava izbor." }), lista, potvrdi);
  }

  function ocijeni(p, dao, isteklo) {
    if (isteklo || dao === null) return "vrijeme";
    if (p.v === "izbor") return dao === 0 ? "tocno" : "krivo";
    if (p.v === "broj") {
      if (dao >= p.od && dao <= p["do"]) return "tocno";
      return dao >= p.od - p.bl && dao <= p["do"] + p.bl ? "blizu" : "krivo";
    }
    var krivih = dao.filter(function (x, j) { return x !== j; }).length;
    return krivih === 0 ? "tocno" : krivih === 2 ? "blizu" : "krivo";
  }

  function predaj(dao, isteklo) {
    if (!partija || !partija.postavljeno) return;
    var i = partija.odgovori.length, p = banka.sva[partija.pitanja[i]], rok = ROK[p.v];
    var sek = Math.min(rok, Math.max(0, (Date.now() - partija.postavljeno) / 1000));
    zaustaviSat();
    var ishod = ocijeni(p, dao, isteklo);
    var dodatak = ishod === "tocno" ? Math.round(BRZINA * Math.min(1, Math.max(0, (rok - sek) / (rok - POCEK)))) : 0;
    var bod = ishod === "tocno" ? TOCNO + dodatak : ishod === "blizu" ? BLIZU : 0;
    partija.odgovori.push({ id: p.id, ishod: ishod, bodovi: bod, sek: Math.round(sek * 10) / 10, dao: dao });
    partija.postavljeno = null;
    spremiPartiju();
    crtajStrip();
    obrada = Scena.obradi(i, ishodi());
    ekranIshod(p, i, ishod, bod, dao);
  }

  function tocanTekst(p) {
    if (p.v === "broj") {
      var j = p.j ? " " + p.j : "";
      return p.od === p["do"] ? brojHr(p.od) + j : "od " + brojHr(p.od) + " do " + brojHr(p["do"]) + j;
    }
    return p.v === "izbor" ? p.a[0] : "";
  }

  function tvojTekst(p, dao) {
    if (dao === null || dao === undefined) return "";
    if (p.v === "izbor") return p.a[dao];
    if (p.v === "broj") return brojHr(dao) + (p.j ? " " + p.j : "");
    return dao.map(function (x) { return p.k[x]; }).join(", ");
  }

  function ekranIshod(p, i, ishod, bod, dao) {
    var klasa = los(ishod) ? "krivo" : ishod, zadnje = i === 4;
    var gore = el("p", { class: "korak" }, el("span", { text: (i + 1) + " / 5 · " + ODJELI[i] + (partija.vrsta === "vjezba" ? " · vježba" : "") }));
    var odgovorRed = null;
    if (p.v === "izbor") {
      var redci = [];
      if (ishod === "krivo") redci.push(el("button", { class: "odgovor je-kriv", type: "button", disabled: true },
        el("span", { class: "slovo", text: "×" }), el("span", { text: p.a[dao] }), el("span", { class: "oznaka", text: "Tvoj odgovor" })));
      redci.push(el("button", { class: "odgovor je-tocan", type: "button", disabled: true },
        el("span", { class: "slovo", text: "✓" }), el("span", { text: p.a[0] }), el("span", { class: "oznaka", text: "Točan odgovor" })));
      odgovorRed = el("div", { class: "odgovori" }, redci);
    }
    var dalje = el("button", { class: "gumb glavni siri", type: "button", text: zadnje ? "Pogledaj rezultat" : "Dalje: " + ODJELI[i + 1],
      onclick: function () {
        dalje.disabled = true;
        if (zadnje) return obrada.then(zavrsi);
        var sljedeci = i + 1;
        obrada.then(function () { Scena.naprijed(sljedeci); });
        ekranPitanje();
      } });
    prikazi(gore, el("h1", { class: "pitanje", text: p.p }), odgovorRed,
      el("section", { class: "ishod " + klasa, "aria-live": "polite" },
        el("div", { class: "ishod-glava" }, el("span", { class: "ishod-rijec", text: RIJEC[ishod] }),
          el("span", { class: "ishod-bodovi", text: (bod > 0 ? "+" : "") + bodova(bod) })),
        p.v === "broj" ? el("p", { class: "ishod-tocan", text: "Točan odgovor: " + tocanTekst(p) +
          (dao !== null && ishod !== "tocno" ? " (tvoj: " + tvojTekst(p, dao) + ")" : "") }) : null,
        p.v === "redoslijed" ? el("ol", { class: "ishod-red" }, p.k.map(function (k) { return el("li", { text: k }); })) : null,
        el("p", { text: p.ob }),
        el("p", { class: "pogon", text: POGON[i][los(ishod) ? 1 : 0] })),
      el("div", { class: "dalje-traka" }, dalje));
    dalje.focus({ preventScroll: true });
    // gore je scena: arak upravo prolazi kroz stroj
    var mirno = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: mirno ? "auto" : "smooth" });
  }

  function zavrsi() {
    if (partija.vrsta === "dan") {
      var pov = povijest().filter(function (x) { return x.d !== partija.datum; });
      pov.push({ d: partija.datum, b: ukupno(partija), w: werkovi(partija) });
      spremi("povijest", pov.slice(-400));
    }
    ekranKraj();
  }

  // ---------------------------------------------------------------- kraj
  function tekstZaDijeljenje(p) {
    var znak = { "2": "■", "1": "◧", "0": "□" };
    var red = werkovi(p).split("").map(function (w) { return znak[w]; }).join(" ");
    var lose = p.odgovori.filter(function (o) { return los(o.ishod); }).length;
    return "Peti werk " + lijepDatum(p.datum) + "\n" + red + "  " + bodova(ukupno(p)) + "\n" +
      (lose ? "Nalog odrađen uz " + zastoja(lose) + "." : "Nalog odrađen bez zastoja.") + "\n" + (postavke.adresa || location.href);
  }

  function podijeli(gumb, tekst) {
    function gotovo(ok) {
      gumb.dataset.stanje = ok ? "gotovo" : "greska";
      gumb.textContent = ok ? "Kopirano" : "Nije uspjelo";
      setTimeout(function () { delete gumb.dataset.stanje; gumb.textContent = "Podijeli"; }, 2200);
    }
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      navigator.share({ text: tekst }).catch(function () { /* odustao */ });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tekst).then(function () { gotovo(true); }, function () { gotovo(false); });
    } else gotovo(false);
  }

  function ekranKraj() {
    zaustaviSat();
    gumbLjestvica.disabled = false;
    var p = partija, is = ishodi(), lose = is.filter(los).length, vjezba = p.vrsta === "vjezba";
    Scena.postavi(is);
    crtajStrip();
    var kartica = lose === 0 ? ["zelena", "Zelena kartica: naklada je dobra i ide dalje."]
      : lose < 3 ? ["zuta", "Žuta kartica: nakladu treba detaljno pregledati."]
        : ["crvena", "Crvena kartica: nesukladni arci."];
    var naslov = lose === 0 ? "Nalog odrađen" : lose === 5 ? "Nalog stoji" : "Odrađeno uz " + zastoja(lose);
    var mjesto = el("p", { class: "sitno", "aria-live": "polite" });
    var n = niz();
    var gumbDijeli = el("button", { class: "gumb glavni", type: "button", text: "Podijeli",
      onclick: function () { podijeli(gumbDijeli, tekstZaDijeljenje(p)); } });

    prikazi(
      el("h1", { class: "naslov", text: naslov }),
      el("div", { class: "rezultat-broj" }, el("b", { text: String(ukupno(p)) }),
        el("span", { text: "od 500 bodova" + (vjezba ? " · vježba" : "") })),
      el("p", { class: "kartica " + kartica[0] }, el("i"), el("span", { text: kartica[1] })),
      vjezba ? el("p", { class: "sitno", text: "Vježba se ne boduje i ne ulazi u tvoje rezultate." }) : (spojena() ? mjesto : null),
      !vjezba && n > 1 ? el("p", { class: "sitno", text: "Niz: " + n + " dana zaredom." }) : null,
      el("div", { class: "pregled" }, p.odgovori.map(function (o, i) {
        var q = banka.sva[o.id], klasa = los(o.ishod) ? "krivo" : o.ishod, tvoj = tvojTekst(q, o.dao);
        return el("details", { class: klasa },
          el("summary", null, el("span", { text: ODJELI[i] }), el("span", { class: "stanje", text: RIJEC[o.ishod] }),
            el("span", { class: "broj", text: String(o.bodovi) })),
          el("div", { class: "tijelo" }, el("p", null, el("strong", { text: q.p })),
            tvoj && o.ishod !== "tocno" ? el("p", { text: "Tvoj odgovor: " + tvoj }) : null,
            q.v === "redoslijed" ? el("ol", { class: "ishod-red" }, q.k.map(function (k) { return el("li", { text: k }); }))
              : el("p", { text: "Točan odgovor: " + tocanTekst(q) }),
            el("p", { text: q.ob })));
      })),
      el("div", { class: "gumbi dva" }, vjezba ? null : gumbDijeli,
        el("button", { class: "gumb" + (vjezba ? " glavni" : ""), type: "button", text: vjezba ? "Još vježbe" : "Vježba",
          onclick: function () { zapocni("vjezba"); } }),
        vjezba ? el("button", { class: "gumb", type: "button", text: "Na početnu", onclick: pocetna }) : null),
      vjezba ? null : el("p", { class: "sitno", text: "Novi radni nalog stiže u ponoć. Do tada možeš vježbati, vježba se ne boduje." }));
    window.scrollTo(0, 0);
    if (!vjezba) upisiNaLjestvicu(p, mjesto);
  }

  // ---------------------------------------------------------------- ljestvica (Supabase REST)
  var L = postavke.ljestvica || {};
  function spojena() { return !!(L.url && L.kljuc); }
  function zahtjev(put, opcije) {
    opcije = opcije || {};
    opcije.headers = Object.assign({ apikey: L.kljuc, Authorization: "Bearer " + L.kljuc, "Content-Type": "application/json" }, opcije.headers || {});
    return fetch(L.url.replace(/\/+$/, "") + "/rest/v1/" + put, opcije);
  }

  function upisiNaLjestvicu(p, mjesto) {
    if (!spojena()) return;
    var poslano = citaj("poslano", {});
    var korak = poslano[p.datum] ? Promise.resolve(true) : zahtjev("rezultati", { method: "POST", headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ datum: p.datum, ime: ime(), bodovi: ukupno(p), sekundi: sekundi(p), werkovi: werkovi(p) }) })
      .then(function (r) {
        if (r.status === 409) { mjesto.textContent = "Pod imenom " + ime() + " danas je već upisan rezultat, pa se ovaj ne broji."; return false; }
        if (!r.ok) throw new Error(String(r.status));
        var novo = {}; novo[p.datum] = true; spremi("poslano", novo);
        return true;
      });
    korak.then(function (upisano) {
      if (!upisano) return;
      return ljestvicaDana(p.datum).then(function (redci) {
        var m = redci.findIndex(function (r) { return r.ime.toLowerCase() === ime().toLowerCase(); });
        if (m >= 0) mjesto.textContent = "Danas si " + (m + 1) + ". od " + redci.length + (redci.length === 1 ? " igrača." : " igrača.");
      });
    }).catch(function () { mjesto.textContent = "Rezultat nije poslan na ljestvicu. Pokušat ću ponovo kad otvoriš igru."; });
  }

  function ljestvicaDana(datum) {
    return zahtjev("rezultati?datum=eq." + datum + "&select=ime,bodovi,sekundi,werkovi&order=bodovi.desc,sekundi.asc&limit=300")
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); });
  }
  function ljestvicaTjedna(datum) {
    var dan = (danUTjednu(datum) + 6) % 7, od = plusDana(datum, -dan);
    return zahtjev("rpc/pw_tjedan", { method: "POST", body: JSON.stringify({ od: od, do_: plusDana(od, 6) }) })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); });
  }

  function mini(w) {
    return el("span", { class: "mini", "aria-hidden": "true" }, String(w || "").split("").map(function (c) {
      return el("i", { class: c === "2" ? "t" : c === "1" ? "b" : "k" });
    }));
  }

  function ekranLjestvica(raspon) {
    zaustaviSat();
    gumbLjestvica.setAttribute("aria-pressed", "true");
    var datum = danas(), tijelo = el("div", { "aria-live": "polite" });
    function kartica(kljuc, naziv) {
      return el("button", { type: "button", "aria-pressed": raspon === kljuc ? "true" : "false", text: naziv,
        onclick: function () { if (raspon !== kljuc) ekranLjestvica(kljuc); } });
    }
    var natrag = el("button", { class: "gumb siri", type: "button", text: "Natrag", onclick: function () {
      gumbLjestvica.setAttribute("aria-pressed", "false");
      (povratak || pocetna)();
    } });
    if (!spojena()) {
      // Bez zajedničke ljestvice: zadnji nalozi s ovog uređaja.
      var pov = povijest().slice(-14).reverse();
      prikazi(el("h1", { class: "naslov", text: "Moji rezultati" }),
        el("p", { class: "uvod", text: "Zajedničke ljestvice još nema. Podijeli rezultat u grupu pa usporedite." }),
        pov.length ? el("ol", { class: "lista datumi" }, pov.map(function (x) {
          return el("li", null, el("span", { class: "mjesto", text: x.d.slice(8) + "." + x.d.slice(5, 7) + "." }),
            el("span", { class: "ime", text: "Nalog" }), mini(x.w), el("span", { class: "bodovi", text: String(x.b) }));
        })) : el("p", { class: "prazno", text: "Još nemaš odrađen radni nalog." }),
        natrag);
      return;
    }
    prikazi(el("h1", { class: "naslov", text: "Ljestvica" }),
      el("div", { class: "kartice" }, kartica("dan", "Danas"), kartica("tjedan", "Ovaj tjedan")),
      tijelo, natrag);
    tijelo.replaceChildren(el("ol", { class: "lista kostur", "aria-label": "Učitavam" }, [0, 1, 2, 3, 4].map(function () { return el("li"); })));
    (raspon === "dan" ? ljestvicaDana(datum) : ljestvicaTjedna(datum)).then(function (redci) {
      if (!redci.length) {
        tijelo.replaceChildren(el("p", { class: "prazno", text: raspon === "dan" ? "Danas još nitko nije odradio nalog. Budi prvi." : "Ovaj tjedan još nema rezultata." }));
        return;
      }
      var ja = (ime() || "").toLowerCase();
      tijelo.replaceChildren(el("ol", { class: "lista" }, redci.map(function (r, i) {
        return el("li", { class: r.ime.toLowerCase() === ja ? "ja" : null },
          el("span", { class: "mjesto", text: (i + 1) + "." }), el("span", { class: "ime", text: r.ime }),
          raspon === "dan" ? mini(r.werkovi) : el("span", { class: "sitno broj", text: r.dana + (r.dana === 1 ? " dan" : " dana") }),
          el("span", { class: "bodovi", text: String(r.bodovi) }));
      })));
    }).catch(function () {
      tijelo.replaceChildren(el("p", { class: "prazno", text: "Ljestvica se nije učitala. Provjeri vezu pa pokušaj ponovo." }),
        el("button", { class: "gumb", type: "button", text: "Pokušaj ponovo", onclick: function () { ekranLjestvica(raspon); } }));
    });
  }

  gumbLjestvica.addEventListener("click", function () {
    if (gumbLjestvica.getAttribute("aria-pressed") === "true") {
      gumbLjestvica.setAttribute("aria-pressed", "false");
      return (povratak || pocetna)();
    }
    povratak = partija && partija.odgovori.length >= 5 ? ekranKraj : pocetna;
    ekranLjestvica("dan");
  });

  // Ako je nalog ostao otvoren na pitanju, a stranica se vrati u prvi plan nakon isteka roka, zatvori pitanje.
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "visible" || !partija || !partija.postavljeno || !sat) return;
    var p = banka.sva[partija.pitanja[partija.odgovori.length]];
    if (p && (Date.now() - partija.postavljeno) / 1000 >= ROK[p.v]) predaj(null, true);
  });

  // ---------------------------------------------------------------- pokretanje
  document.getElementById("datum").textContent = lijepDatum(danas());
  if (!spojena()) gumbLjestvica.textContent = "Rezultati";
  Scena.stvori(document.getElementById("scena"));
  pocetna();
})();
