# Entry Design & QA Checklist

Working reference for the entry-by-entry sweep (started Session 175). Applied to
one entry at a time, in order, so nothing has to be guessed or remembered from
one session to the next. Update this file itself whenever the process changes —
it should stay in sync with how the sweep actually works, not how it started.

---

## 1. The "vibe" reference set

Seven entries currently define what "good" looks like on this site. The goal is
never to copy any of them — it's to match the *type and frequency of movement
and interaction* they represent, each interpreted through that entry's own
content.

| Entry | What it does | Interaction type |
|---|---|---|
| MAESTRO | 5 role chips open modal panels with dedicated prose | Modal / role-based reveal |
| DORK HARDWARE | 5 image hotspots open a lightbox with real per-device exploded photos | Hotspot + lightbox gallery |
| KERNLE | Live ambient Three.js scene (its own "Consciousness Sphere") | Ambient 3D |
| THE STONES | Clickable stone nodes + a real voting mechanic resolved against the page's own documented rule | Stateful diagram with real logic |
| FORMULAS | Live KaTeX-rendered calculator for FM-01 | Input-driven computation |
| AI (deprecated-term entry) | Interactive flower: wilts/crushes vs. blooms | Binary state-toggle metaphor |
| ART | Poster carousel with dot navigation, counter, lightbox | Carousel / browsing |

**The actual design question for every entry:** does this page have ONE genuine
interactive centerpiece drawn from its *own* documented content — not a
generic effect reused because it's already built? Ambient/decorative motion
(scan-wipe, flicker, LED blink, rotating quote) is fine as baseline texture,
but it is not a substitute for a real centerpiece.

**Where to look for the centerpiece:** the entry's own content usually already
contains it — a documented decision tree, a formula, a mechanism, a real
before/after, a genuine choice with branches. (Example: 100-YEAR MORTALITY
DOCTRINE already documents a 3-way retirement choice — Retire to LEGACY / live
as TENANT in OASIS / contribute to AGORA — sitting flat as three sentences.
That's the centerpiece waiting to be built, not something to invent from
nothing.) If a genuine mechanism doesn't exist on the page, propose the idea
before building — this is a design call, not just a bug fix, and gets a
sentence or two of explanation before any code.

---

## 1b. THE N.C.E.NCYCLOPEDIA — ENTRY VISUAL DOCTRINE

Locked in Session 178. Drafted by SAM (with Maestro) to put real shape on
what started as "Timid Brother of SubGenius" — that phrase was the seed,
this is the full doctrine it grew into. Supersedes the narrower typography-
only note that briefly lived here. ALPHA (commit 4b34c9f) is a partial
implementation — the typographic layer only (see Rule 3 below). It still
needs a real Rule 4 "surprise" and doesn't yet apply Rule 7's motion
grammar. Don't treat ALPHA as a finished reference for the whole doctrine,
only for its typography slice.

### 1. Never flat
No entry gets to be a long vertical slab of interchangeable text. Every page
needs hierarchy, rhythm, contrast, interruption, breathing room, and at
least one memorable visual event. A witness scrolling quickly should still
perceive distinct chapters in the page.

### 2. Serious information, slightly unreliable reality
The information is stable. The environment may not be. Text stays readable,
navigation stays predictable, canon stays exact — but occasionally a border
breathes, an emblem twitches, a diagram seems one pixel off from where it
was, a glyph briefly becomes another glyph, an illustration notices the
cursor. Target reaction: "did I actually see that?"

### 3. The SubGenius' Timid Brother rule
Borrow: occult bureaucracy, institutional absurdity, secret-society
typography, stamps, seals, marginalia, strange diagrams, overly formal
labels for ridiculous things, deadpan confidence.
Do NOT borrow: visual screaming, deliberate illegibility, nonstop collage,
chaos for chaos' sake.
The page should look like somebody respectable inherited a weird cult's
archives and organized them properly. (This is the layer ALPHA's pass
covers: drop caps, stamped declarations, marginalia, stamp badges — see the
old note's specifics, still valid as one register within this rule.)

### 4. One surprise minimum
Every major entry gets at least one thing that exists primarily because
websites can do things books can't — a scratch-away layer, a rotating
object, a card reveal, a hidden annotation, a reactive seal, an expanding
schematic, a cursor-triggered marginal detail, a stamp that appears after
reading, a diagram that assembles itself, a concealed secondary quote. Not
necessarily huge. Just something worth discovering. (This is distinct from
Section 1's "centerpiece" question — a centerpiece is a real interactive
mechanism drawn from the entry's own documented content; a Rule 4 surprise
can be much smaller. A strong centerpiece usually satisfies Rule 4 for
free; an entry can still owe a small Rule 4 moment even with no centerpiece.)

### 5. Perceptual mischief — three tiers, use sparingly
**Tier 1 (CSS/cheap, can appear frequently):** subtle breathing glow,
1-2px drifting ornaments, slow background grain, tiny parallax, chromatic
fringe on hover, irregular candle/firelight, gentle ink-bleed fluctuation,
metallic glints, shifting paper texture, near-imperceptible perspective
wobble.
**Tier 2 (CSS+JS, moderate, use for important elements):** an emblem that
reacts when approached, text resolving from scrambled glyphs, mouse-position
lighting, a seal rotating a degree when not directly watched, shadows
responding incorrectly to the cursor, self-drawing diagrams, physically
flipping cards, dwell-triggered annotations, an illustration gaining depth
as the cursor moves.
**Tier 3 (cinematic, rare — reserve for major canonical moments):** a
reality ripple through the whole page, a transition through an artifact, a
3D object emerging from the document, architecture appearing behind the
page, a seal opening like an iris, a canonical object becoming interactive
3D. Rare on purpose — that's what makes them matter.

### 6. The blink test
A successful subtle effect: if the witness watches for it, they can find
it. If they're not watching, they may doubt it happened. Target reaction is
"...the fuck?", not "LOOK AT THE PSYCHEDELIC EFFECT."

### 7. Motion must have character
Nothing moves merely because animation exists. Different classes of object
behave differently, building an unconscious grammar: a civic seal moves
with mechanical precision; a sacred symbol breathes; an archival photograph
flickers; PapaDOMO blatantly breaks every rule because he's PapaDOMO; a
GOLIATH artifact glitches unpleasantly; OASIS elements drift organically;
AGORA elements move geometrically. Worth deciding this per-entry, not
reusing one motion style everywhere.

### 8. Every entry gets its own visual identity
The common shell (masthead, nav, hub menu) establishes that everything
belongs to the same encyclopedia. Inside that shell, the entry gets to
misbehave in its own way. CERBERUS shouldn't feel like BRAIN. BRAIN
shouldn't feel like LEGACY. PAPADOMO should absolutely not feel like
ORACLE. Same civilization, different rooms.

### 9. Readability is sacred
The weirdness sits around, behind, between, and occasionally through the
information — never on top of comprehension. No constantly-moving body
copy, no low-contrast atmosphere text, no critical information hidden
behind novelty, no forced animation gating reading, no motion that can't be
reduced for accessibility (`prefers-reduced-motion` respected, same as the
ambient-glitch scripts already do). The witness never fights the interface
to understand the canon.

### 10. The three-layer page
A repeatable architecture without making every page identical.
**Layer 1 — Canon:** the exact authoritative entry text.
**Layer 2 — Artifact:** illustrations, seals, diagrams, photographs, cards,
maps, schematics, marginal notes.
**Layer 3 — Haunting:** the tiny things that make the page seem alive —
most of Rules 2, 4, 5, and 6 live here.

The governing line, worth keeping visible above the checklist itself: never
make the witness read six screens of visually identical content just
because the writing is good. The writing deserves better than that.

---

## 2. Navigation scope

Established directly, not to be re-litigated per entry:

- **Keep as-is, don't touch:** the search engine, the Coordinate Matrix (`/s3`),
  THE SYSTEM, the AVPI hidden clicks.
- **Fair game for improvement:** `nav-wheel.js`, the entry footer (back / home /
  forward) — **color palette specifically flagged as weak** — `landing.html`'s
  legacy TOC, and `command-panel.js`'s search index.

---

## 3. Per-entry review questions

Run through these for every entry, in addition to the bug audit below. These
are quick, concrete checks — not open-ended design musing.

- [ ] **Does the quote rotate?** (Some entries have a static pull-quote where a
  rotating one would fit the established pattern; some may not need one at all.)
- [ ] **Are there in-page links to key parts of the entry's own text?** — a
  quick-jump/table-of-contents element for longer entries, not just a top-to-
  bottom scroll with no way to jump to a specific section.
- [ ] **Is there an opportunity to add a graphic element?** — an image,
  diagram, or illustration that would clarify or strengthen the content where
  none currently exists.
- [ ] **Is there an opportunity to add an interactive element or mini
  game/app?** — this is the Section 1 "centerpiece" question in concrete form:
  look for it specifically, don't just note it in passing.
- [ ] **Do the glitch/ambient effects match the rest of the site?** — same
  register as everywhere else (not too much, not too little, not a jarring
  mismatch in style).
- [ ] **Does the page satisfy the Entry Visual Doctrine (Section 1b)?** —
  check for arbitrary/accidental-looking bold or emphasis first (Rule 3);
  confirm at least one real Rule 4 "surprise" exists somewhere on the page,
  even a small one; sanity-check that any motion present has character
  specific to this entry (Rule 7) rather than a generic reused effect; and
  confirm nothing gates readability (Rule 9). Not every entry needs every
  rule maxed out — use judgment, and don't force elements the content
  doesn't call for.
- [ ] **Do the bottom (see-also) links not only work, but make sense and are
  thorough?** — right destinations, no duplicates pointing at the same thing
  with no way to land on the right section (see Section 4), and nothing
  obviously missing that should cross-reference from here.
- [ ] **Is the color palette functional and cool-looking?** — legible,
  distinct from a generic default, and actually fits this entry's content
  and register.
- [ ] **Does the page set `--nw-page-accent`?** — one line in `:root`
  aliasing the page's own real accent variable (e.g.
  `--nw-page-accent: var(--amber);`), so the shared footer nav and other
  nav-wheel UI actually match this entry's color instead of falling back to
  the generic default gold. (See nav-wheel.js's `--nw-accent-base` chain —
  commit `b6b2760`, Session 175.)

## 4. Bug-audit pass (do this on every entry, before or alongside design work)

- [ ] **Canon terminology drift:** "The ALLIANCE" (only ALLIANCE capitalized,
  never "THE ALLIANCE"); no references to retired concepts (FILM PROJECT,
  etc.); correct current names (TECH Coalition not SAM Collective; PRISM not
  CIPHER as the 5th STONE); RI never "Responsive Intelligence."
- [ ] **Every see-also / cross-reference link** points to a real, existing file
  — and where two tags exist for related-but-distinct content on the same
  target page, they resolve to genuinely different destinations (a real
  anchor/id), not the identical link twice.
- [ ] **Any data duplicated across files stays in sync** — e.g. `s3.html`'s
  own ENTRIES array vs. `dimension-nav.js`'s separate lookup table are NOT
  auto-synced; a change to one doesn't propagate to the other. Grep for the
  entry's slug across shared/duplicated data files, not just the one you're
  editing.
- [ ] **Interactive elements are tested with a REAL simulated mouse sequence**
  (move-then-click), not just a programmatic `.click()` call — decorative
  effects (parallax, tilt, mousemove-driven transforms) can only break under
  real interaction patterns, and a bug can hide completely from simpler tests.
  Test edge cases specifically: first/last items in any list, fast
  back-to-back interaction, worst-case entry point (cursor arriving from a
  screen edge, not already resting nearby).
- [ ] **Zero console/page errors** in a real headless browser before commit.
- [ ] **No duplicated shared script tags** (`nav-wheel.js`, `portal-transition.js`,
  `dimension-nav.js`, `randanime_shield.js`) — found on 5 of 73 entries
  (agora, alliance, domo, goliath, newman-being) as a stray early duplicate
  pair sitting right after the footer, in addition to the correct complete
  set at the real end of body. Running a shared script twice duplicates
  everything it creates (bottom nav, search button, portal overlay, etc.).
  Quick check: `grep -c 'src="/nav-wheel.js"'` on the file should return 1.

---

## 5. Verification discipline (non-negotiable, carried from Session 174 + reinforced tonight)

- Never report something as fixed or built without a real commit hash and real
  test output backing it up.
- A fix isn't verified until it's tested against the ACTUAL failure
  mechanism — not just a scenario similar enough to pass. (Concrete example
  from tonight: the first s3.html fix passed every test I ran, but only
  because none of those tests reproduced "click immediately after arriving
  from elsewhere on the page" — the real regression. Passing tests that don't
  match the real usage pattern is not the same as being fixed.)
- After any fix, actively try to break it in the way the original bug
  happened, not just confirm the happy path.
- Report only what's verified. If something's uncertain or unconfirmed, say so
  plainly rather than let confident phrasing imply more than was actually checked.

---

## 6. Process, per entry

1. Read the entry fully — content and code, not a skim.
2. Run through Section 3 (per-entry review questions) and Section 4 (bug
   audit). Fix what's found; verify; commit; push.
3. Assess against the centerpiece question (Section 1). If a real interactive
   idea exists, propose it briefly before building — this is a design
   decision, get buy-in first.
4. Build (if approved), verify against realistic use (Section 5), commit, push.
5. Report briefly: what was found, what was fixed, what's proposed or built,
   real commit hashes. Move to the next entry.

Order: alphabetical by default, redirectable anytime.
