# NASTAVAK — KAI-SOL web stranica

> Ovaj dokument je **handoff za nastavak rada** (npr. Claude Code na drugom računalu).
> Sadrži kontekst projekta, poslovnu strategiju i popis onoga što još treba napraviti.

---

## 1. Što je ovo

Marketinška web stranica za **KAI-SOL** — malu firmu koju vode dvoje ljudi, s uslugama:

1. **Web izrada** (glavna usluga) — landing stranice, poslovni sajtovi, webshopovi
2. **Dizajn** — vizualni identitet, UI/UX, marketinški materijali
3. **Hosting i mjesečna skrb** — hosting, backup, sitne izmjene, podrška (pretplata)
4. **IT podrška za ured i server** — radne stanice, mreža, backup, daljinska i terenska podrška

- **Jezik:** hrvatski
- **Stil:** tamna tema, gradijent plava → cyan → ljubičasta (isti dizajn-sistem kao prije pivota)
- **Tehnologija:** statični **HTML / CSS / JS** — bez build koraka, bez ovisnosti

### Vlasnički kontekst (VAŽNO za sadržaj!)
- Dvoje ljudi vodi firmu: jedan radi dizajn i razvoj (pozadina u sociologiji), drugi
  poslovnu stranu, prodaju, domene i ugovore (pozadina u ekonomiji). Na stranici se
  NE koriste imena, piše se u "mi" tonu i kroz dvije role (vidi o-nama.html).
- Osoba zadužena za razvoj **radi kao tehnolog u tiskari etiketa** i prije KAI-SOL-a
  izgradila je interne sustave (WMS, poslovna platforma, QMS) za tu firmu. Ti se sustavi
  smiju spominjati kao **iskustvo/dokaz sposobnosti** (anonimno, bez imena firme,
  bez screenshotova pogona) na stranici "Iskustvo" (iskustvo.html), ali se NE smiju
  prikazivati kao KAI-SOL-ovi klijentski web projekti — KAI-SOL kao web agencija
  tek gradi svoj portfolio (na iskustvo.html i indexu to je iskreno napisano:
  "prvi web klijenti tek dolaze, rade se po povoljnijim uvjetima").
- Živa stranica: **https://kai-sol.com** (GitHub Pages + Actions auto-deploy na push).

## 1a. PIVOT (2026-08-31): promjena pozicioniranja

Stranica je **prije** bila specijalizirana za custom WMS za proizvodne/skladišne firme
("Izgrađen u tvornici, ne u uredu"). Korisnik je odlučio da KAI-SOL umjesto toga postane
**web/dizajn/hosting/IT agencija** koju vodi dvoje ljudi (dizajn+razvoj / biznis+prodaja).
Stara WMS strategija i dalje postoji kao git povijest ako je ikad zatreba, ali trenutna
stranica je u cijelosti zamijenjena novim sadržajem. Stari sustavi (WMS, ERP/MES,
QMS) sad služe samo kao "Iskustvo" stranica, dokaz tehničke sposobnosti, ne kao
glavna ponuda.

**Pozicioniranje:** "Dizajn koji privlači pažnju + razumijevanje kako firma posluje."
Diferencijacija: dvoje ljudi pod istim krovom (dizajn/razvoj + prodaja/biznis), umjesto
agencije gdje klijent prolazi kroz više ljudi i ugovora.

**Cijene (PLACEHOLDERI — korisnik ih treba potvrditi/prilagoditi prema stvarnom
tržištu, orijentacija je bila "okvirno tržište Zagreb, profesionalno ali povoljno"):**
- Web izrada: landing od 490 €, poslovna stranica od 990 €, webshop od 1.990 €/po dogovoru
- Dizajn: vizualni identitet od 350 €, UI/UX redizajn od 690 €, marketing materijali od 150 €
- Hosting i skrb (mjesečno): Basic 19 €, Standard 49 €, Premium 99 €
- IT podrška: mjesečni ugovor od 149 €/mj (po broju uređaja), ili satnica po intervenciji

**Poseban "wow" element (jedinstvena animacija):** na indexu, hero vizual je mock
preglednika koji se sam "gradi" — kostur (wireframe) prelazi u gotov, obojan layout u
petlji (CSS keyframes, `assets/css/home.css`, klase `.bp-skel-group` / `.bp-final-group`
/ `.bp-cursor`), uz dinamičnu riječ u eyebrowu koja se ispisuje/briše (typewriter efekt,
`assets/js/script.js`, `data-typewriter`/`data-words`). Na usluge.html postoji
**konfigurator paketa** (`#konfigurator`): checkboxovi za svaku uslugu, zbraja
jednokratni i mjesečni trošak uživo i šalje odabir kao query string na kontakt.html,
gdje se automatski predispuni poruka u formi.

---

## 2. Git

- **GitHub:** https://github.com/Shywera/web (grana `main`)
- Rad se odvijao u privremenom scratchpad folderu (radno računalo), ne u
  `Desktop\Projekti\web` kao ranije — taj folder postoji samo na korisnikovom
  privatnom računalu.

## 3. TODO (sljedeći koraci)

- [ ] Potvrditi/prilagoditi sve cijene (vidi popis gore) prema stvarnom dogovoru
      dvoje vlasnika i tržišnim istraživanjem (Zagreb/HR tržište).
- [ ] Formspree ili Netlify Forms umjesto trenutnog mailto slanja na kontakt.html
      (TODO komentar već stoji iznad `<form>` u kodu).
- [ ] Pravi telefonski broj (trenutno sakriven, samo email u kontakt info bloku).
- [ ] Pravi logo/OG slika (trenutno generički "K" favicon iz starog dizajna).
- [ ] Kad se pojavi prvi pravi web klijent, dodati pravi case study na iskustvo.html
      ili napraviti zasebnu "Portfolio" sekciju.
- [ ] Razmisliti treba li novo ime tvrtke umjesto "KAI-SOL" s obzirom da više nije
      WMS specijalist (korisnik nije tražio promjenu imena, samo pivot ponude).
