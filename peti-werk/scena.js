/* Peti werk: scena. Arak putuje trakom kroz pet odjela; boje i crte su u stil.css (klase s-* i a-*). */
(function () {
  "use strict";

  var RAZMAK = 280;      // od sredine jednog odjela do sredine sljedećeg
  var SREDINA = 160;     // sredina prvog odjela; vidi se 320 jedinica odjednom
  var POD = 168;         // gornji rub trake
  var ARAK_Y = POD - 54; // arak je 76 x 54
  var NAZIVI = ["Papir", "Priprema", "Tisak", "Dorada", "Skladište"];
  var KUTOVI = [-8, 5, 10, -5, 7, -10];   // koliko se koja etiketa zakrene kod lošeg reza

  var svijet, arak, korijen;

  function cx(i) { return SREDINA + RAZMAK * i; }
  function xCeka(i) { return cx(i) - 148; }
  function xUnutra(i) { return cx(i) - 38; }
  function xIzlaz(i) { return cx(i) + 72; }

  function natpis(i) {
    return '<g class="s-natpis-okvir"><line class="s-tanko" x1="-30" y1="24" x2="-30" y2="30"/>' +
      '<line class="s-tanko" x1="30" y1="24" x2="30" y2="30"/>' +
      '<rect class="s-ploha" x="-48" y="30" width="96" height="16" rx="1"/>' +
      '<text class="s-natpis" x="0" y="41.4">' + (i + 1) + " " + NAZIVI[i].toUpperCase() + "</text></g>";
  }

  function lampa(x, y) {
    return '<circle class="s-lampa" cx="' + x + '" cy="' + y + '" r="4"/>';
  }

  // Stražnji dio odjela: ono iza trake i arka.
  var IZA = [
    // Papir: na zidu vlagomjer i termometar, jer papir živi od klime
    function () {
      var crtice = "";
      for (var k = -3; k <= 3; k++)
        crtice += '<line class="s-tanko" x1="0" y1="-9.5" x2="0" y2="-7.5" transform="rotate(' + (k * 32) + ')"/>';
      return '<g transform="translate(-30 72)"><circle class="s-ploha" r="12"/>' + crtice +
        '<g class="s-kazaljka"><rect class="s-tamno" x="-0.7" y="-8.5" width="1.4" height="8.5"/></g>' +
        '<circle class="s-tamno" r="1.8"/></g>' +
        '<g transform="translate(8 60)"><rect class="s-ploha" x="0" y="0" width="6" height="22" rx="3"/>' +
        '<rect class="s-ziva" x="2" y="9" width="2" height="13"/><circle class="s-ploha" cx="3" cy="25" r="4.6"/>' +
        '<circle class="s-ziva" cx="3" cy="25" r="2.6"/></g>';
    },
    // Priprema: monitor s montažom 3 x 2
    function () {
      var s = '<rect class="s-ploha" x="-26" y="54" width="52" height="32" rx="2"/>';
      for (var r = 0; r < 2; r++) for (var c = 0; c < 3; c++)
        s += '<rect class="s-montaza" x="' + (-20 + c * 14) + '" y="' + (59 + r * 12) + '" width="12" height="10"/>';
      return s + '<line class="s-crta" x1="0" y1="86" x2="0" y2="94"/>';
    },
    // Tisak: sve je sprijeda
    function () { return ""; },
    // Dorada: portal rezačice s nožem
    function () {
      return '<rect class="s-tijelo" x="-52" y="60" width="10" height="42"/>' +
        '<rect class="s-tijelo" x="42" y="60" width="10" height="42"/>' +
        '<rect class="s-tamno" x="-58" y="54" width="116" height="10" rx="1"/>' +
        '<g class="s-noz"><rect class="s-tamno2" x="-41" y="66" width="82" height="7"/>' +
        '<polygon class="s-ploha" points="-41,73 41,73 41,78 -41,86"/></g>';
    },
    // Skladište: regal s kutijama
    function () {
      var kutije = [[-44, 58, 22, 14], [-18, 56, 26, 16], [14, 60, 18, 12], [-40, 78, 30, 14], [-4, 76, 20, 16], [22, 80, 24, 12]];
      var s = '<line class="s-crta" x1="-52" y1="52" x2="-52" y2="102"/><line class="s-crta" x1="52" y1="52" x2="52" y2="102"/>' +
        '<line class="s-crta" x1="-52" y1="72" x2="52" y2="72"/><line class="s-crta" x1="-52" y1="92" x2="52" y2="92"/>';
      kutije.forEach(function (k) {
        s += '<rect class="s-kutija" x="' + k[0] + '" y="' + k[1] + '" width="' + k[2] + '" height="' + k[3] + '"/>';
      });
      return s;
    }
  ];

  // Prednji dio odjela: kućište iza kojeg arak nestane dok se obrađuje.
  var ISPRED = [
    // Papir: paleta araka u omotu, s naljepnicom na kojoj je smjer vlakanaca
    function () {
      var arci = "";
      for (var y = 104; y <= 152; y += 6) arci += '<line class="s-tanko" x1="-56" y1="' + y + '" x2="56" y2="' + y + '"/>';
      return '<rect class="s-ploha" x="-52" y="94" width="100" height="5"/>' +
        '<rect class="s-ploha" x="-56" y="98" width="112" height="60"/>' + arci +
        '<rect class="s-omot" x="-56" y="98" width="34" height="60"/>' +
        '<rect class="s-ploha" x="-10" y="112" width="38" height="28" rx="1"/>' +
        '<path class="s-crta" d="M-3 122 h24 M-3 122 l4 -3 M-3 122 l4 3 M21 122 l-4 -3 M21 122 l-4 3"/>' +
        '<line class="s-tanko" x1="-3" y1="131" x2="21" y2="131"/><line class="s-tanko" x1="-3" y1="135" x2="12" y2="135"/>' +
        '<rect class="a-drvo" x="-62" y="158" width="124" height="10"/>' +
        '<rect class="s-tamno2" x="-42" y="162" width="28" height="4"/><rect class="s-tamno2" x="14" y="162" width="28" height="4"/>' +
        lampa(42, 106);
    },
    function () {
      return '<polygon class="s-tijelo3" points="-58,96 -42,85 58,85 58,96"/>' +
        '<rect class="s-tijelo" x="-58" y="96" width="116" height="72"/>' +
        '<rect class="s-tamno" x="-32" y="110" width="64" height="4" rx="1"/>' +
        '<g class="s-ploca-okvir"><rect class="s-ploca" x="-27" y="113" width="54" height="22"/>' +
        '<line class="s-tanko" x1="-21" y1="120" x2="21" y2="120"/><line class="s-tanko" x1="-21" y1="126" x2="21" y2="126"/></g>' +
        '<line class="s-tanko" x1="-58" y1="146" x2="58" y2="146"/>' + lampa(46, 104);
    },
    function () {
      var boje = ["k", "c", "m", "y", "s"], s = '<rect class="s-tamno" x="-70" y="160" width="140" height="8"/>';
      for (var i = 0; i < 5; i++) {
        var x0 = -66 + i * 27;
        s += '<text class="s-broj' + (i === 4 ? " s-broj-peti" : "") + '" x="' + (x0 + 12) + '" y="70">' + (i + 1) + "</text>" +
          '<rect class="s-tijelo" x="' + x0 + '" y="74" width="24" height="88" rx="3"/>' +
          '<rect class="sep-' + boje[i] + '" x="' + (x0 + 4) + '" y="79" width="16" height="5" rx="1"/>' +
          '<g class="s-valjak">' +
          '<circle class="s-ploha" cx="' + (x0 + 12) + '" cy="110" r="8"/>' +
          '<line class="s-tanko" x1="' + (x0 + 12) + '" y1="110" x2="' + (x0 + 12) + '" y2="103"/></g>' +
          '<g class="s-valjak s-valjak-2">' +
          '<circle class="s-ploha" cx="' + (x0 + 12) + '" cy="134" r="8"/>' +
          '<line class="s-tanko" x1="' + (x0 + 12) + '" y1="134" x2="' + (x0 + 19) + '" y2="134"/></g>';
      }
      return s + lampa(54, 152);
    },
    function () {
      return '<rect class="s-tijelo" x="-58" y="100" width="116" height="68"/>' +
        '<rect class="s-tamno" x="-64" y="97" width="128" height="5" rx="1"/>' +
        '<circle class="s-ploha" cx="-22" cy="132" r="6"/><circle class="s-tamno2" cx="-22" cy="132" r="2.4"/>' +
        '<circle class="s-ploha" cx="22" cy="132" r="6"/><circle class="s-tamno2" cx="22" cy="132" r="2.4"/>' +
        '<line class="s-tanko" x1="-58" y1="150" x2="58" y2="150"/>' + lampa(46, 112);
    },
    function () {
      return '<circle class="s-ploha" cx="-36" cy="95" r="7"/><circle class="s-tamno2" cx="-36" cy="95" r="2.4"/>' +
        '<rect class="s-tijelo" x="-58" y="104" width="116" height="64"/>' +
        '<rect class="s-tamno" x="-63" y="101" width="126" height="5" rx="1"/>' +
        '<rect class="s-kutija" x="-30" y="120" width="34" height="26"/>' +
        '<line class="s-tanko" x1="-13" y1="120" x2="-13" y2="146"/>' +
        '<rect class="s-kutija" x="8" y="128" width="24" height="18"/>' + lampa(46, 114);
    }
  ];

  function etikete() {
    var s = "", n = 0;
    for (var r = 0; r < 2; r++) for (var c = 0; c < 3; c++, n++) {
      s += '<g transform="translate(' + (6 + c * 22) + " " + (5 + r * 22) + ')"><g class="et" style="--c:' + c + ";--r:" + r +
        ";--kut:" + KUTOVI[n] + '">' +
        '<g class="et-tisak"><rect class="sep-y" width="20" height="20" rx="1.5"/>' +
        '<rect class="sep-c" x="0" y="2.5" width="20" height="5.5"/>' +
        '<circle class="sep-m" cx="10" cy="12.6" r="3.9"/>' +
        '<rect class="sep-k" x="4.5" y="17.2" width="11" height="1.4"/>' +
        '<rect class="sep-s-rub" x="1.3" y="1.3" width="17.4" height="17.4" rx="0.8"/></g>' +
        '<rect class="et-rub" width="20" height="20" rx="1.5"/></g></g>';
    }
    return s;
  }

  function paser(x, y) {
    return '<g class="a-paser" transform="translate(' + x + " " + y + ')"><circle r="1.7"/>' +
      '<line x1="-2.8" y1="0" x2="2.8" y2="0"/><line x1="0" y1="-2.8" x2="0" y2="2.8"/></g>';
  }

  function arakSvg() {
    var strip = "", boje = ["k", "c", "m", "y", "s"];
    for (var i = 0; i < 5; i++) strip += '<rect class="sep-' + boje[i] + '" x="' + (25 + i * 5.4) + '" y="49.6" width="4.4" height="2.6"/>';
    // valovit arak: gornji i donji rub u valovima (papir koji nije aklimatiziran)
    var val = "M0 2 q9.5 -5 19 0 t19 0 t19 0 t19 0 L76 52 q-9.5 5 -19 0 t-19 0 t-19 0 t-19 0 Z";
    return '<g class="a-list"><rect class="a-papir a-ravan" width="76" height="54" rx="0.6"/>' +
      '<path class="a-papir a-valovit" d="' + val + '"/>' +
      '<g class="a-oznake">' + paser(3.2, 27) + paser(72.8, 27) + '<g class="a-strip">' + strip + "</g></g></g>" +
      '<g class="a-nalog"><rect class="a-nalog-list" x="6" y="-9" width="22" height="12" rx="1"/>' +
      '<line class="a-nalog-red" x1="9.5" y1="-5.4" x2="24" y2="-5.4"/><line class="a-nalog-red" x1="9.5" y1="-2" x2="19" y2="-2"/>' +
      '<path class="a-nalog-krivo" d="M13 -7.5 l8 9 M21 -7.5 l-8 9"/></g>' +
      '<g class="a-montaza">' + etikete() + '<line class="a-krivi-rez" x1="-3" y1="38" x2="79" y2="14"/></g>' +
      '<g class="a-paleta"><rect class="a-drvo" x="2" y="45" width="72" height="3.4"/>' +
      '<rect class="a-drvo" x="4" y="48.4" width="10" height="5.6"/><rect class="a-drvo" x="33" y="48.4" width="10" height="5.6"/>' +
      '<rect class="a-drvo" x="62" y="48.4" width="10" height="5.6"/>' +
      '<rect class="s-kutija" x="7" y="25" width="30" height="20"/><line class="s-tanko" x1="22" y1="25" x2="22" y2="45"/>' +
      '<rect class="s-kutija" x="39" y="25" width="30" height="20"/><line class="s-tanko" x1="54" y1="25" x2="54" y2="45"/>' +
      '<g class="a-gornja"><rect class="s-kutija" x="20" y="6" width="32" height="19"/><line class="s-tanko" x1="36" y1="6" x2="36" y2="25"/></g>' +
      '<g class="a-kartica"><rect x="56" y="-4" width="13" height="17" rx="1"/>' +
      '<line class="a-nalog-red" x1="58.5" y1="1" x2="66.5" y2="1"/><line class="a-nalog-red" x1="58.5" y1="5" x2="64" y2="5"/></g></g>';
  }

  function stvori(el) {
    var iza = "", ispred = "";
    for (var i = 0; i < 5; i++) {
      iza += '<g transform="translate(' + cx(i) + ' 0)">' + natpis(i) + IZA[i]() + "</g>";
      ispred += '<g class="st" data-i="' + i + '" transform="translate(' + cx(i) + ' 0)">' + ISPRED[i]() + "</g>";
    }
    el.innerHTML = '<svg class="scena-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" ' +
      'aria-label="Arak putuje kroz pet odjela tiskare">' +
      '<defs><pattern id="valjci" width="12" height="8" patternUnits="userSpaceOnUse">' +
      '<rect class="s-traka-podloga" width="12" height="8"/><circle class="s-traka-valjak" cx="6" cy="4" r="2.5"/></pattern></defs>' +
      '<g class="svijet"><line class="s-tracnica" x1="-200" y1="24" x2="1640" y2="24"/>' +
      '<line class="s-tlo" x1="-200" y1="192" x2="1640" y2="192"/>' + iza +
      '<rect class="s-traka" x="-200" y="' + POD + '" width="1840" height="8" fill="url(#valjci)"/>' +
      '<g class="arak">' + arakSvg() + "</g>" + ispred + "</g></svg>";
    korijen = el;
    svijet = el.querySelector(".svijet");
    arak = el.querySelector(".arak");
  }

  function los(ishod) { return ishod === "krivo" || ishod === "vrijeme"; }

  function slojevi(ishodi) {
    var n = ishodi.length, lose = ishodi.filter(los).length;
    var k = { "ima-nalog": n >= 1, "nalog-los": n >= 1 && los(ishodi[0]),
      "ima-montazu": n >= 2, "montaza-los": n >= 2 && los(ishodi[1]),
      "ima-tisak": n >= 3, "tisak-los": n >= 3 && los(ishodi[2]),
      "izrezano": n >= 4, "rez-los": n >= 4 && los(ishodi[3]),
      "na-paleti": n >= 5, "paleta-losa": n >= 5 && los(ishodi[4]),
      "kartica-zelena": n >= 5 && lose === 0, "kartica-zuta": n >= 5 && lose > 0 && lose < 3, "kartica-crvena": n >= 5 && lose >= 3 };
    Object.keys(k).forEach(function (ime) { arak.classList.toggle(ime, k[ime]); });
  }

  function lampe(ishodi) {
    korijen.querySelectorAll(".st").forEach(function (st) {
      var ishod = ishodi[+st.dataset.i];
      st.classList.toggle("je-tocno", ishod === "tocno");
      st.classList.toggle("je-blizu", ishod === "blizu");
      st.classList.toggle("je-krivo", los(ishod));
    });
  }

  function pomakni(kamera, x) {
    svijet.style.transform = "translateX(" + (-RAZMAK * kamera) + "px)";
    arak.style.transform = "translate(" + x + "px, " + ARAK_Y + "px)";
  }

  function cekaj(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function trajanje(ime) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 160;
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(ime)) || 900;
  }

  // Bez animacije postavi scenu: `ishodi` su ishodi odjela koji su gotovi.
  function postavi(ishodi) {
    var n = ishodi.length;
    korijen.classList.add("bez-prijelaza");
    slojevi(ishodi);
    lampe(ishodi);
    pomakni(Math.min(n, 4), n >= 5 ? xIzlaz(4) : xCeka(n));
    void korijen.offsetWidth;
    korijen.classList.remove("bez-prijelaza");
  }

  // Arak uđe u stroj odjela `i`, stroj radi, arak izađe promijenjen. `ishodi` uključuju i ovaj odjel.
  function obradi(i, ishodi) {
    var pola = trajanje("--dur-obrada") / 2, st = korijen.querySelector('.st[data-i="' + i + '"]');
    arak.style.transitionDuration = pola + "ms";
    pomakni(i, xUnutra(i));
    korijen.classList.add("radi-" + i);
    return cekaj(pola + 380).then(function () {
      slojevi(ishodi);
      lampe(ishodi);
      st.classList.add("bljesak");
      pomakni(i, xIzlaz(i));
      return cekaj(pola);
    }).then(function () {
      korijen.classList.remove("radi-" + i);
      st.classList.remove("bljesak");
      arak.style.transitionDuration = "";
    });
  }

  // Kamera i arak idu do sljedećeg odjela.
  function naprijed(i) {
    pomakni(i, xCeka(i));
    return cekaj(trajanje("--dur-put"));
  }

  window.Scena = { stvori: stvori, postavi: postavi, obradi: obradi, naprijed: naprijed };
})();
