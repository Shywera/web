# NASTAVAK — KAI-SOL web stranica

> Handoff dokument za nastavak rada (npr. Claude Code na drugom računalu).
> Sadrži kontekst projekta, dizajn-sistem, poslovne odluke i popis preostalih zadataka.

---

## 1. Što je ovo

Web stranica tvrtke **KAI-SOL**, male agencije koju vode dvoje ljudi:

| Osoba | Područje |
| --- | --- |
| Osoba A | dizajn, kod, sociologija odlučivanja i korisnički tok |
| Osoba B | infrastruktura, domene, ekonomija, prodaja i ugovori |

**Usluge (4):** web razvoj i dizajn (od 490 €), mjesečni paket održavanja (od 49 €/mj),
upravljani hosting i infrastruktura (od 19 €/mj), poslovna IT podrška (od 149 €/mj).

- **Jezik:** hrvatski, književni standard, profesionalan i **suosjećajan** ton
  ("razumijemo vaše probleme"), bez prodajnog pritiska i bez em crtica u tekstu.
- **Tehnologija:** statični HTML/CSS/JS, bez build koraka i bez npm-a.
- **Live:** https://kai-sol.com (GitHub Pages + Actions, automatski deploy na push u `main`).

## 2. Dizajn-sistem v3 (2026-08-31)

Treća vizualna iteracija. Prethodne dvije sačuvane su u git povijesti i u arhivskom
repozitoriju **[Shywera/kaiwebdes](https://github.com/Shywera/kaiwebdes)** (v2, minimalistička
tamna s narančastim akcentom).

- **Boje:** obsidian pozadina `#08090a`, krem tekst `#f2f1ec`, jedan signalni akcent
  **žad `#14c99a`** (rast, povjerenje, konverzija). Zlatna `#d9b26a` koristi se isključivo
  za novčani iznos u izračunu učinka, nigdje drugdje.
- **Tipografija:** Instrument Serif (naslovi, kurziv za naglaske) + Inter (tijelo i sučelje).
- **Struktura:** hibrid, konverzijska naslovnica plus tri dubinske stranice radi SEO-a
  (usluge, o nama, kontakt). Naslovnica sadrži cijeli tok: hero, izazovi, partnerstvo,
  matrica usluga, izračun, proces, forma.
- **Interakcije na naslovnici:** interaktivna mreža točaka na canvasu koja reagira na
  pokazivač, kinetička izmjena riječi u naslovu (uvjerava / prodaje / gradi povjerenje),
  `<details>` matrica usluga, izračun učinka s klizačima, forma s plutajućim oznakama
  i validacijom u koracima.

### Zašto nije Tailwind
Prompt je tražio Tailwind, no na radnom računalu nema Node/npm okruženja za kompilaciju,
a Tailwind Play CDN kompajlira u pregledniku (oko 380 kB JS-a i bljesak nestiliziranog
sadržaja). Za agenciju koja prodaje brzinu to bi bilo kontraproduktivno, pa je CSS pisan
ručno, modularno i s varijablama, u jednoj datoteci. Ako se poželi prijeći na Tailwind,
klase su semantične i lako se preslikavaju.

## 3. Poslovne napomene

- **Cijene su okvirne i treba ih potvrditi** prije ozbiljne kampanje. Postavljene su prema
  procjeni tržišta u Zagrebu, u rangu "profesionalno, ali dostupno".
- **Izračun učinka** koristi ilustrativno poboljšanje od 40 % (`UPLIFT` u `app.js`).
  Na stranici je jasno označen kao procjena, ne kao obećanje rezultata. Ako se promijeni
  pretpostavka, uskladiti i tekst ispod izračuna.
- **Iskustvo iz proizvodnje** (WMS, poslovni sustavi) navodi se kao dokaz sposobnosti,
  anonimno i bez naziva tvrtke, jer je nastalo u tvrtki u kojoj jedan od osnivača radi
  kao tehnolog. Ne smije se prikazivati kao klijentski projekt KAI-SOL-a.

## 4. Preostali zadaci

- [ ] Potvrditi konačne cijene svih paketa.
- [ ] Zamijeniti `mailto` slanje forme pravim backendom (Formspree ili Netlify Forms);
      TODO komentar stoji iznad oba `<form>` elementa.
- [ ] Dodati telefonski broj kada bude dostupan (trenutno samo e-pošta).
- [ ] Izraditi pravu OG sliku za dijeljenje na društvenim mrežama.
- [ ] Nakon prvih klijenata: dodati stranicu s referencama ili prikaz projekata.
- [ ] Razmotriti Google Analytics ili Plausible radi mjerenja konverzija.
