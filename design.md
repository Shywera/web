# Design: KAI-SOL

A locked design system for kai-sol.com. Every page reads this file before emitting code.
Do not regenerate it per page: extend or amend it when the system needs to grow.

Written 27.09.2026 by a Hallmark multi-page redesign (v5). Supersedes the design system in
`assets/css/base.css` + `assets/css/home.css`, which stay on disk for rollback only.
`zasto-nas.html` never used them: it is fully self-contained.

---

## Genre

**Editorial.** Print discipline on screen: hairline rules, real measure, ordinal numerals,
generous asymmetry. Not "modern SaaS", not atmospheric, not playful. The page should read
like a well-set document about a business, not like a product launch.

## Macrostructure family

Three page types. Pages within a type share the type's shape and vary only in content.

- **Marketing pages** (`index`, `usluge`): **Index-First**. The page IS a priced index.
  No decorative hero, no narrative build-up. A masthead statement, then dense typographic
  rows that name a service, its price, and where it goes. Variation knob: row density
  (index = 4 rows, compact) vs (usluge = 4 rows, expanded with detail columns).
- **Content pages** (`iskustvo`, `o-nama`): **Long Document**. Continuous prose with
  inline heads and a narrow measure. Figures sit inline, not in cards. The page is
  literature about the work. Variation knob: numbered case sections (iskustvo) vs
  unnumbered narrative (o-nama).
- **Action page** (`kontakt`): **Ledger**. Two columns: what happens after you write,
  numbered, on the left; the form on the right. Nothing else on the page.
- **Utility** (`404`): a single statement and one link.

**Out of system:** `zasto-nas.html`, the interactive piece behind the door, and
`best-view.html`, the Watamu apartment page (see Amendments, 09.10.2026). Both are
self-contained. `zasto-nas.html`
carries its own palette, fonts and logic. Do not bring it into this system and do not
clean it up; it is the one place on the site that is allowed to be loud.

**The door into it is in system.** Amended 27.09.2026: the RGB glitch button that used to
sit on the homepage is gone. Inside a restrained editorial system it stopped reading as a
deliberate joke and started reading as leftover from the old site. The invitation is now a
`.door` block: display type, a numbered meta list, one accent hairline that draws in on
hover, and a plain note that the destination has sound. Same promise, no rainbow. The
site therefore has **no loud element on its own surfaces**; the loudness lives behind one
clearly-marked link.

**Copy rule that came with it:** no dares, no hype, no "click if you dare", no "turn the
sound up". The invitation states what the thing is (interactive, has sound, two minutes)
and lets the visitor decide. Confidence is stating the fact; hype is asking to be
believed.

## Theme

Brand-locked, dark. Values live in `assets/css/tokens.css` as OKLCH and are a faithful
translation of the original hex palette, not a new palette.

- `--color-paper`      oklch(14.5% 0.005 85.9)  warm near-black
- `--color-paper-2`    oklch(17.8% 0.006 78.0)
- `--color-paper-3`    oklch(19.7% 0.007 78.2)
- `--color-ink`        oklch(95.0% 0.016 86.4)  cream, never pure white
- `--color-ink-2`      oklch(81.7% 0.025 83.4)
- `--color-ink-3`      oklch(63.0% 0.025 78.1)  muted, clears 4.5:1 on paper
- `--color-rule`       oklch(27.5% 0.012 78.1)
- `--color-rule-2`     oklch(33.1% 0.017 82.3)
- `--color-accent`     oklch(68.3% 0.209 35.9)  flare, the only signal colour
- `--color-accent-2`   oklch(82.4% 0.149 73.3)  amber, second signal, used sparingly
- `--color-accent-ink` oklch(48.0% 0.170 36.6)  accent on light surfaces
- `--color-on-accent`  oklch(14.5% 0.005 85.9)  text on accent, never white
- `--color-focus`      oklch(82.4% 0.149 73.3)

**No blue.** The palette exists as a reaction against it. No blue in gradients, links,
charts, states or hover. **Accent under 5 % of any viewport.** It marks one thing per
screen, it never fills.

## Typography

Two families, site-wide. A third would be slop.

- **Display:** Fraunces, weight 400 (500 for h3), `font-style: normal`
- **Body:** Inter, 400 / 600 / 700
- **Numerals:** Inter with `font-variant-numeric: tabular-nums` everywhere a number
  sits in a column (prices, metrics, results)

There is no outlier face any more. Impact left with the RGB button.

**Headings are roman. Always.** An italicised emphasis word inside a heading is the most
reliable AI tell there is, and it is banned from this system. Emphasis is carried by
`.mark`: the accent colour plus a 2px drawn underline. Italic survives only as body-copy
emphasis inside running paragraphs.

- `--text-display`   clamp(2.9rem, 6.4vw, 5.6rem)  · line-height 1.02
- `--text-display-s` clamp(2.2rem, 4.4vw, 3.4rem)
- `--text-4xl`       clamp(1.7rem, 2.8vw, 2.4rem)
- `--text-2xl`       clamp(1.25rem, 1.8vw, 1.5rem)
- Prose measure: 62ch on content pages, 46ch for ledes. Never outside 45 to 75ch.

## Spacing

4-point named scale, tokens only, never raw values:
`--space-2xs 4` `xs 8` `sm 12` `md 20` `lg 32` `xl 48` `2xl 72` `3xl 112` `4xl 160`.

**Sections are not equally padded.** `.band` / `.band--tight` / `.band--tall` exist so the
page has rhythm. Equal whitespace between every section is a named anti-pattern.

## Nav and footer

- **Nav: N6 Masthead.** Wordmark left, a hairline rule across the page, the existing
  fullscreen overlay menu behind a `Meni` / `Zatvori` toggle. Not a pill row, not a
  centred link list. Escape closes, `aria-expanded` stays in sync.
- **Footer: Ft5 Statement**, site-wide. One large roman closing line per page, then
  wordmark, links and copyright in small muted type. **No four-column sitemap and no
  social-icon row**, because that shape is the single most recognisable AI footer.

Closing lines by page: index *"Recite nam što vas muči."* · usluge *"Cijena prije
početka, ne poslije."* · iskustvo *"Budite među prvim web klijentima."* · o-nama
*"Popričajmo o vašem projektu."* · kontakt *"Odgovaramo u roku 24 h."*

## Motion

Three primitives on the whole site. Cut before adding.

1. **Entrance**: one orchestrated reveal on first load, staggered by `--i`. Not a
   fade-up per section on scroll; the page settles once and stays settled.
2. **Rule-draw**: an accent hairline draws in under an index row on hover/focus,
   via `transform: scaleX()`. Never animate `width`.
3. **Spotlight**: a soft accent glow follows the cursor, desktop pointers only.

Easings: `--ease-out` `--ease-in` `--ease-in-out`. Never the browser default `ease`,
never bounce or overshoot on UI state. Animate `transform` and `opacity` only.
`prefers-reduced-motion: reduce` collapses spatial motion to a ≤150ms opacity crossfade.

## Copy voice

Croatian, formal `vi`. Short sentences. Name the customer's problem before the service.
Diagnostic, not boastful. Prices are shown, never hidden behind "contact us".

**No invented numbers, ever.** The metrics on `iskustvo` (1.500+ pozicija, 0 paleta bez
lokacije, 100 % izdavanja uz skeniranje, svaki dan u produkciji) are real and supplied by
the client, and the page states plainly that client names are withheld. The performance
figures in the proof block are measured live in the visitor's browser by the Performance
API; when a browser will not report one, the row hides itself rather than print a number.
The 24-hour response promise is the firm's own, already published on `usluge` and
`kontakt`. Anything not in those three categories does not go on the site as a number.

## Accessibility floor

Non-negotiable, every page:

- `overflow-x: clip` on `html` and `body` (`clip`, not `hidden`)
- Every interactive element ships default · hover · `:focus-visible` · `:active` ·
  disabled styling; the focus ring appears instantly and never animates in
- Body text 4.5:1, large text and focus rings 3:1, verified against the computed
  background, not the page background
- No clickable label wraps to two lines at any width from 320px up
- Image-bearing and text grid tracks use `minmax(0, 1fr)`, never bare `1fr`
- Display headings carry `overflow-wrap: anywhere; min-width: 0`
- Decorative marks are `aria-hidden`; the page reads correctly with JS disabled

## Implementation

Static HTML, one shared stylesheet, one shared script. **No framework, no build step, no
bundler, no runtime dependency except Google Fonts.** Deploys unchanged through GitHub
Actions to GitHub Pages at kai-sol.com.

- `assets/css/tokens.css`: every colour, type, space, motion token
- `assets/css/kai.css`: the system: reset, masthead, index, long document, ledger,
  footer. Carries the Hallmark stamp on line 1.
- `assets/js/kai.js`: menu, entrance, spotlight, package configurator, live metrics
- `assets/css/base.css`, `home.css`, `usluge.css`, `iskustvo.css`, `kontakt.css`,
  `o-nama.css`, `assets/js/script.js`: **legacy.** Still on disk for `zasto-nas.html`
  and for rollback. No redesigned page links them.

## Exports

`assets/css/tokens.css` is the portable export. If this project ever moves to Tailwind or
a token pipeline, generate the other formats from that file, not from the page CSS.

---

## Amendments

### 09.10.2026 - best-view.html leaves the system

A page about a holiday apartment in Watamu, Kenya. It was first built inside this system
as a Long Document and it was wrong: the warm near-black paper fought seven bright
photographs of an equatorial bay, and a dark editorial document is the wrong register for
hospitality. It is now **out of system**, the second page to be so after `zasto-nas.html`.

**What out of system means here.** `best-view.html` links neither `tokens.css` nor
`kai.css`. Its palette, its two fonts and its whole stylesheet live in one `<style>` block
in the page. Nothing it does can reach the five business pages, and nothing in the locked
system constrains it. The figure styles briefly added to `kai.css` for the first version
were reverted, because no page in the system uses them: a design system should not carry
rules nothing references.

**Its own system, recorded so it can be rebuilt:**

- Macrostructure **08 Photographic**: full-bleed photographic plates alternating with
  narrow text bands. The image edge is the divider; there are no rules between sections.
  Captions are factual, naming the time of day or the thing in frame, never selling.
- Nav **N9 Edge-aligned minimal**, footer **Ft4 Dense colophon**. Deliberately not the
  system's N6 Masthead and Ft5 Statement, so the page does not half-belong.
- Light limewash paper `oklch(96.4% 0.012 84)`, carved-hardwood ink `oklch(25% 0.02 48)`,
  terracotta accent `oklch(53% 0.132 42)`, one deep palm green for a single rule.
- Display **Marcellus**, body **Karla**. Marcellus ships one weight and no italic, which
  enforces the roman-headings rule structurally rather than by discipline.
- Motion: two primitives only, an opening fade on the hero plate and an underline draw on
  the one nav link. The macrostructure's instruction is to let the photographs work.

**What carried over from the locked system, because it is right everywhere:** roman
headings with no italic, no eyebrow labels, tokens only with no raw colour values outside
`:root`, `overflow-x: clip` on `html` and `body`, `minmax(0, 1fr)` on grid tracks, and the
no-invented-numbers rule. 200 m2, 70 m2 and 2 bedrooms are owner-supplied. Rates, ratings,
distances and sleeping capacity are absent because they are in none of the three permitted
categories. A closing note states the page was built from photographs and supplied
details, not from a stay.

**Still not in the nav and not in the sitemap**, on the same reasoning as before: the
business site sells web development, and a page about an apartment in Kenya would blur
that in the masthead. Direct link only.

**The precedent this sets.** A page may leave the system when its content has a genuinely
different register, but it leaves *completely*: own stylesheet, own fonts, own palette, no
shared classes in either direction. Half-in pages are how a design system dies.

### 23.10.2026 - zastarjelo.html, the third page out of system

A Croatian satire page in the manner of deprecation.org: an "AI vendor" that sells the
retirement of human jobs, written deadpan. His request. It is a joke page, so it leaves the
system completely, on the precedent above: own `<style>` block, own fonts, own palette, no
shared classes, no `tokens.css` or `kai.css`.

**Its own system, recorded so it can be rebuilt:**

- One long landing page in the original's order: live counter bar, hero with the
  OTPISIVAČ-5 machine, client strip, stats, four steps, services, customer story, price
  bars, FAQ, signup, hazard stripe, the redundancy check, the gift shop, footer.
- Near-black `#0c0c0e` with surfaces `#131416` / `#1a1b1e` / `#232428`, warning yellow
  `#f5c518` as the accent, signal orange `#ec5b33` for the human side and the verdict.
  No blue, same as the rest of the site.
- Headings **VT323** (Pixelify Sans was tried and dropped: its Č renders with a dot, the
  same as Ć), body **Geist**, labels **Geist Mono**, one hand note in **Caveat**.
- The machine is our own pixel SVG (`shape-rendering: crispEdges`), not the original's
  artwork. Motion is loops on `transform` and `opacity` only, all off under
  `prefers-reduced-motion`.
- The redundancy check runs in the browser: a hash of the job title gives 2 to 18 months,
  a keyword list adds a line per job. Nothing is sent or stored. The signup form has no
  name and `method="dialog"`, so it cannot submit anywhere even without JavaScript.

**The one rule it breaks on purpose:** no invented numbers. Every figure on the page is
part of the joke, and the page says so in a yellow "Satira. Nitko nije otpušten." bar with
a credit to deprecation.org. That is why it is `noindex`, outside the nav and the sitemap,
and reached by direct link only.
