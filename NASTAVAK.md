# NASTAVAK — KAIS (KAISolutions) web stranica

> Ovaj dokument je **handoff za nastavak rada** (npr. Claude Code kod kuće).
> Sadrži cijeli kontekst projekta, poslovnu strategiju, kako ga pokrenuti, plan za
> hosting i email, te popis onoga što još treba napraviti.

---

## 1. Što je ovo

Marketinška web stranica za **KAIS (KAISolutions)** — novu firmu specijaliziranu za
**custom WMS (Warehouse Management System) po mjeri** za **male i srednje proizvodne
i skladišne firme** (30–250 zaposlenih).

- **Jezik:** hrvatski
- **Stil:** moderna, tamna "tech" tema (gradijent plava → cyan → ljubičasta)
- **Tehnologija:** statični **HTML / CSS / JS** — bez build koraka, bez ovisnosti (samo otvoriš `index.html`)

### Vlasnički kontekst (VAŽNO za sadržaj!)
- Osnivač **radi kao tehnolog u tiskari etiketa** i KAIS gradi **uz taj posao**.
- Sustavi iz "Projekti" (WMS, ERP/MES/WMS, QMS...) izgrađeni su **za tu firmu, interno** — zato se
  na stranici NE smiju prikazivati kao KAIS-ovi klijentski projekti niti s imenom firme,
  screenshotovima ili fotografijama pogona. Smiju se **spomenuti kao iskustvo** (anonimno:
  "proizvodna firma u kojoj osnivač radi kao tehnolog"). Ta formulacija je već primijenjena
  na index/projekti/o-nama — zadrži je pri budućim izmjenama.

## 1a. POSLOVNA STRATEGIJA (temelj cijele stranice — ne razvodnjavati!)

Rezultat multi-agent istraživanja (pozicioniranje + konkurentske poruke), srpanj 2026:

- **Pozicioniranje:** "Tehnolog iz proizvodnje koji gradi softver" — tagline: **"Izgrađen u tvornici, ne u uredu."**
  Pobjeđuje: velike ERP-ove (brzina, cijena, po mjeri), SaaS WMS-ove (procesi SME ne stanu u forme;
  vlasništvo koda), generične agencije (domensko znanje bez učenja na kupčev račun).
- **Ciljni kupac:** proizvodne/skladišne firme 30–250 zaposlenih — prerasle Excel, premale za SAP.
- **JEDAN primarni CTA svugdje:** "Dogovorite snimku skladišta" (ne "kontaktirajte nas").
- **Model ponude (3 paketa):**
  1. **Snimka skladišta — 490 € fiksno** (1–2 dana u pogonu, pisani nalaz + plan + fiksna ponuda;
     iznos se odbija od pilota; plaćeno namjerno — filtrira ozbiljne kupce) <!-- cijenu potvrditi -->
  2. **WMS Pilot — fiksna cijena i rok** (jedno skladište/zona, 6–8 tjedana, kriterij "gotovo" =
     inventura prolazi s 99%+ točnosti; interno ciljati 6–12k €)
  3. **Rast i podrška — mjesečno** (hosting, podrška, dorade; recurring prihod)
- **Portfolio: max 3 case studyja** (WMS flagship → ERP/MES → QMS). "Arhiva 13 skripti" je IZBAČENA
  kao stavka — spominje se samo jednom rečenicom kao dokaz iskustva. AI ponude spomenute unutar ERP casea.
- **Brojke na stranici** su industrijski rasponi (Gartner/implementatori) i uvijek označeni kao takvi:
  99%+ točnost zaliha, do 80% manje grešaka, inventura u satima, ROI 12–24 mj. Za vlastite sustave
  koriste se samo stvarne činjenice (1.500+ pozicija, Zebra PDA, 0 izgubljenih paleta, u produkciji).
- **Founder story** je središnji dokaz povjerenja (o-nama piše u prvom licu). Regionalna konkurencija
  (Špica, Info-kod...) komunicira generično i bez brojki — ovo pozicioniranje nema direktnog konkurenta u HR.

---

## 2. Git

- **Lokalni folder:** `C:\Users\Tehnolog\Desktop\KAIS-website`
- **GitHub:** https://github.com/Shywera/web  (grana `main`)
- Kod kuće:
  ```bash
  git clone https://github.com/Shywera/web.git
  cd web
  ```

---

## 3. Struktura projekta

```
KAIS-website/
├── index.html          # Početna
├── usluge.html         # Usluge (WMS istaknut kao specijalnost)
├── projekti.html       # Portfolio — 5 rješenja
├── o-nama.html         # O firmi, misija, vrijednosti, proces
├── kontakt.html        # Kontakt forma + info
├── README.md           # Kratki opis + upute
├── NASTAVAK.md         # <-- OVAJ dokument
└── assets/
    ├── css/
    │   ├── base.css    # DIZAJN-SISTEM: tokeni (boje/fontovi/razmaci), header, footer, gumbi, kartice, animacije
    │   ├── home.css    # stilovi samo za index.html
    │   ├── usluge.css  # stilovi samo za usluge.html
    │   ├── projekti.css
    │   ├── o-nama.css
    │   └── kontakt.css
    ├── js/
    │   └── script.js   # sticky header, mobilni meni, reveal-on-scroll animacije, brojači
    └── img/
        └── favicon.svg # logo/favicon (K u gradijentnom kvadratu)
```

### Kako je izrađeno (za kontekst)
Multi-agent pristup: prvo je ručno napravljen **dizajn-sistem** (`base.css`) + `index.html`
da se zaključa izgled, zatim su **4 agenta paralelno** izgradila po jednu stranicu, svaki
prateći isti header/footer i klase iz `base.css`. Zato su sve stranice vizualno usklađene.

---

## 4. Dizajn-sistem (VAŽNO za izmjene)

Sve boje, fontovi i razmaci definirani su kao **CSS varijable** u `assets/css/base.css`, u bloku `:root`.
Za promjenu izgleda cijele stranice mijenjaš samo te varijable. Najvažnije:

| Varijabla | Značenje | Trenutna vrijednost |
|---|---|---|
| `--bg` | glavna pozadina | `#080b14` |
| `--accent` | glavni akcent (plava) | `#5b8cff` |
| `--accent-2` | drugi akcent (cyan) | `#22d3ee` |
| `--accent-3` | treći akcent (ljubičasta) | `#a78bfa` |
| `--grad` | glavni gradijent (gumbi, naslovi) | plava→cyan→ljubičasta |
| `--font-head` | font naslova | Space Grotesk |
| `--font-body` | font teksta | Inter |

Fontovi se učitavaju s Google Fonts (link u `<head>` svake stranice).

**Gotove klase** (definirane u base.css, koriste ih sve stranice):
`.container`, `.section`, `.eyebrow`, `.section-head(.center)`, `.lead`, `.btn`/`.btn-primary`/`.btn-ghost`/`.btn-lg`,
`.card` (+ `.ico`, `.tag`), `.grid`/`.grid-2`/`.grid-3`/`.grid-4`, `.gradient-text`,
atribut `data-reveal` (+ `data-delay="1..4"`) za animaciju pojavljivanja.

**Header i footer su identični na svim stranicama** — ako mijenjaš navigaciju ili footer,
promijeni na SVIH 5 .html datoteka (nema include mehanizma jer je čisti statični HTML).

---

## 5. Lokalni pregled

Najlakše: dvoklik na `index.html`.

Za "server" pregled (da sve relativne putanje sigurno rade):
```bash
python -m http.server 8000
# pa otvori http://localhost:8000
```

---

## 6. HOSTING — ✅ AKTIVNO (besplatno)

**Stranica je ŽIVA na:** https://shywera.github.io/web/

Hostano besplatno preko **GitHub Pages + GitHub Actions**. Deploy je automatski:
svaki `git push` na granu `main` pokrene workflow `.github/workflows/deploy.yml`
koji ponovno objavi stranicu (za ~1 min). Ne treba ništa ručno raditi.

> Napomena: prvo smo probali klasični (Jekyll/"legacy") Pages build, ali je zapeo,
> pa je dodan `.nojekyll` i prebačeno na Actions deploy (`build_type: workflow`). Sad radi.

Alternativa (ako ikad zatreba): **Cloudflare Pages / Netlify** — spojiš git repo, bez build komande.

### Opcija B — Cloudflare Pages / Netlify
- Spojiš git repo, bez build komande (statični site). Isto besplatno, lakše spajanje vlastite domene.

Sve tri opcije podržavaju **vlastitu domenu** (npr. `kais.hr`) besplatno kad je registriraš.

---

## 7. VLASTITA DOMENA + EMAIL (@kais.hr) — plan

### Dostupnost domena (provjereno 2026-07-08)
| Domena | Status |
|---|---|
| `kais.com` | ❌ zauzeta |
| `kaisolutions.com` | ❌ zauzeta |
| **`kais.hr`** | ✅ slobodna (preporuka) |
| **`kaisolutions.hr`** | ✅ slobodna |

### Trošak — što JE, a što NIJE besplatno
- **Hosting stranice:** besplatan.
- **Domena:** ~**10–15 €/godišnje** (jedini stvarni trošak; ne postoji legalan način da se
  `@kais.hr` dobije potpuno besplatno jer domenu treba vlasnički registrirati).
- **Email sandučić:** **besplatan** nakon što imaš domenu (vidi dolje).

### Registracija domene `.hr`
Kod hrvatskih registrara: **Plus hosting**, **Avalon**, **Studio4web** i sl.

### Email `@kais.hr` — besplatne opcije (nakon što imaš domenu)
- **Cloudflare Email Routing** (preporuka): besplatno prosljeđivanje —
  `info@kais.hr` stiže na tvoj Gmail; uz Gmail "Send mail as" možeš i **slati** kao `info@kais.hr`.
- **Zoho Mail** — besplatan plan s vlastitom domenom (pravi sandučić, do 5 korisnika, 5 GB).

### Ako baš treba 0 € (bez domene)
- Stranica na `shywera.github.io/web` + obični `kaisolutions@gmail.com`. Radi, ali manje profi.

### Preporučeni setup
Registriraj **`kais.hr`** → stranicu hostaj besplatno (Cloudflare Pages / GitHub Pages) →
email besplatno preko Cloudflare Email Routing. Ukupno: samo cijena domene (~1 €/mjesec).

---

## 8. TODO — što još treba napraviti

- [ ] **Potvrditi cijenu snimke skladišta** — na stranici stoji 490 € (preporuka istraživanja 490–990 €).
      Ako se mijenja: traži "490" kroz index.html, usluge.html, kontakt.html, NASTAVAK.md.
- [ ] **Ime i fotografija osnivača** na o-nama.html (`<!-- TODO: ime i fotografija osnivača -->`) —
      portret, NE fotografije pogona/sustava (vidi vlasnički kontekst u točki 1).
- [ ] **Odabrati domenu** (`kais.hr` ili `kaisolutions.hr`) i registrirati je.
- [ ] **Zamijeniti email** `info@kaisolutions.hr` stvarnim (npr. `info@kais.hr`) na **svih 5 .html** stranica
      (traži string `kaisolutions.hr`).
- [ ] **Kontakt forma:** trenutno otvara mail klijent (mailto). Za pravu obradu spojiti na
      **Formspree** ili **Netlify Forms** (u `kontakt.html` je HTML komentar gdje se to ubacuje).
- [ ] Dodati **stvarni telefon** (sad piše "na upit") u `kontakt.html` (`<!-- TODO: broj telefona -->`).
- [x] ~~Uključiti GitHub Pages~~ — **GOTOVO**, živo na https://shywera.github.io/web/ (auto-deploy na svaki push).
- [ ] (Opc.) Pravi **logo** umjesto slova "K" i **OG slika** za dijeljenje na društvenim mrežama.
- [ ] (Opc.) 2–3 **stručna članka** na hrvatskom ("Kako pripremiti skladište za WMS", "Zašto inventura laže")
      — nitko u HR niši ne piše ovako konkretno; brzo gradi autoritet i SEO.
- [ ] (Opc.) Kratki **video** (60–90 s) kako izgleda sken → pozicija → izdavanje — ali tek kad bude
      moguće snimiti bez povjerljivih podataka poslodavca (ili na demo podacima).

> NAPOMENA: NE dodavati screenshotove postojećih sustava — izgrađeni su interno kod sadašnjeg
> poslodavca i ne smiju se javno prikazivati (vidi točku 1).

---

## 9. Upute za Claude Code (kod kuće)

Kad nastavljaš rad, korisan prompt za Claude:

> "Ovo je KAIS (KAISolutions) marketinška web stranica — statični HTML/CSS/JS, hrvatski, tamna tech tema.
> Pročitaj `NASTAVAK.md` za cijeli kontekst. Dizajn-sistem (boje/klase) je u `assets/css/base.css`.
> Header i footer su identični na svih 5 .html stranica — ako ih mijenjaš, promijeni svugdje.
> Svaka stranica ima svoj `*.css` u `assets/css/`. Zadatak: [tvoj zadatak]."

Napomene za nastavak:
- **Ne diraj** strukturu `base.css` tokena osim ako namjerno mijenjaš brend.
- Nove stranice trebaju isti `<head>` (Google Fonts + `base.css` + vlastiti css), isti header/footer,
  i `<script src="assets/js/script.js">` prije `</body>`.
- Za provjeru izgleda: pokreni `python -m http.server` i otvori u pregledniku (animacije ovise o `script.js`).
- Nakon izmjena: `git add -A && git commit -m "..." && git push`.

---

*Zadnje ažurirano: 2026-07-08*
