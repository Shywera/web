# KAIS — KAISolutions · web stranica

Marketinška web stranica za **KAIS (KAISolutions)** — firmu specijaliziranu za **custom software i WMS rješenja** za male i srednje firme.

Statična stranica (HTML / CSS / JS) — bez build koraka, bez ovisnosti. Otvori `index.html` i radi.

## Stranice

| Datoteka        | Sadržaj                                             |
|-----------------|-----------------------------------------------------|
| `index.html`    | Početna — hero, usluge, proces, portfolio, CTA      |
| `usluge.html`   | Detaljan pregled usluga (WMS, ERP/MES, QMS, …)      |
| `projekti.html` | Portfolio — 5 realiziranih rješenja                 |
| `o-nama.html`   | O firmi, misija, vrijednosti, pristup               |
| `kontakt.html`  | Kontakt forma + informacije                         |

## Struktura

```
KAIS-website/
├── index.html, usluge.html, projekti.html, o-nama.html, kontakt.html
└── assets/
    ├── css/
    │   ├── base.css      # dizajn-sistem: tokeni, header, footer, gumbi, kartice, animacije
    │   ├── home.css      # stilovi početne
    │   └── *.css         # stilovi po stranici (usluge, projekti, o-nama, kontakt)
    ├── js/
    │   └── script.js     # sticky header, mobilni meni, reveal animacije, brojači
    └── img/
```

## Dizajn-sistem

Sve boje, razmaci i tipografija definirani su kao CSS varijable u `assets/css/base.css` (`:root`).
Tamna "tech" tema; glavni akcent je gradijent plava → cyan → ljubičasta.
Fontovi: **Space Grotesk** (naslovi) + **Inter** (tekst) preko Google Fonts.

Za promjenu brenda dovoljno je urediti varijable u `:root` (npr. `--accent`, `--accent-2`).

## Lokalni pregled

Samo otvori `index.html` u pregledniku. Za čisti "server" pregled (npr. da relativne putanje rade svugdje):

```bash
# Python
python -m http.server 8000
# pa otvori http://localhost:8000
```

## Objava (hosting)

Stranica je statična pa je možeš besplatno hostati na:

- **GitHub Pages** — Settings → Pages → Deploy from branch (`main` / root)
- **Netlify** — drag & drop foldera ili spoji git repo
- **Cloudflare Pages / Vercel** — spoji git repo, bez build komande

## TODO / dovršiti kod kuće

- [ ] Zamijeniti `info@kaisolutions.hr` stvarnim mailom / dodati telefon
- [ ] Kontakt forma: spojiti na Formspree ili Netlify Forms (trenutno otvara mail klijent)
- [ ] Dodati pravi logo / favicon i OG sliku za dijeljenje
- [ ] Provjeriti tekstove i po potrebi dodati stvarne screenshotove projekata
- [ ] (opc.) vlastita domena

---

© KAIS — KAISolutions
