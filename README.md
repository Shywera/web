# KAI-SOL — web stranica

Poslovna web stranica tvrtke KAI-SOL: izrada web stranica, dizajn, mjesečno održavanje,
upravljani hosting i poslovna IT podrška. Statični HTML/CSS/JS, bez frameworka i build koraka.

**Live:** https://kai-sol.com

## Struktura

```
index.html          konverzijska naslovnica (hero, izazovi, partnerstvo,
                    matrica usluga, izračun učinka, proces, kontakt forma)
usluge.html         detaljne usluge i cjenik
o-nama.html         priča, podjela uloga, iskustvo, načela rada
kontakt.html        kontakt forma i tijek prvog kontakta
404.html            stranica za nepostojeće poveznice
assets/css/style.css  cijeli dizajn-sistem u jednoj datoteci
assets/js/app.js      moduli: navigacija, otkrivanje, rotator, hero canvas,
                      izračun, forma
```

## Načela izvedbe
- Bez vanjskih JS knjižnica i bez build koraka: sve se učitava izravno.
- Jedan CSS i jedan JS zahtjev; fontovi s Google Fontsa jedina su vanjska ovisnost.
- Poštuje `prefers-reduced-motion`; animacija u hero sekciji staje kada nije u vidnom polju.
- Automatski deploy na **GitHub Pages** kroz GitHub Actions (`.github/workflows/deploy.yml`).

## Lokalni pregled
Otvorite `index.html` u pregledniku, nema build koraka.

## Arhiva
Prethodna verzija dizajna (tamna, minimalistička, s narančastim akcentom) sačuvana je
u repozitoriju [Shywera/kaiwebdes](https://github.com/Shywera/kaiwebdes).
