# signal-interference.js — PBE (Pirate Broadcast Engine) — design notes (Session 179)

Officially named the PBE as of this session. "Signal interference" was
the working description; PBE is the name going forward in conversation
and documentation. The filename itself stays `signal-interference.js`
unless you want a rename pass later — changing it now would mean
re-wiring every `<script src>` that already points to it, including
the live one on `entries/maestro.html`.

Status: **core scheduler + effect library built and tested standalone.
Not wired into any live page yet.** Per the 178 brief's agreed sequence
— build the core first, prove pacing on a small number of pages, then
do the sitewide swap-out — this is step one only.

## What it replaces (eventually, not yet)

- `ambient-glitch.js` (landing, 562 lines) — pirate-broadcast engine
- `ambient-glitch-entries.js` (73 entry pages, 92 lines) — quiet cousin
- `randanime_shield.js` (155 pages, 504 lines) — "SHIELD authenticates" register
- `randanime_maestro.js` (1 live page — `entries/maestro.html`; the
  brief's "2 pages" count included a stale duplicate in
  `scripts/entries_check/`, not a second real page — worth a note for
  whoever eventually cleans that scratch folder)
- `randanime_sword.js` (505 lines, confirmed 0 live pages — dead code,
  a leftover from the retired SWORD/SHIELD split)

`broadcast.js` (the one-time color-bars-to-reveal boot sequence) is
**not** part of this consolidation — it's a distinct one-shot intro,
not an ongoing ambient scheduler, and stays as-is.

## A concrete finding worth knowing before rollout

Checked directly rather than assumed: **72 of the 73 real entry pages
currently run `ambient-glitch-entries.js` and `randanime_shield.js`
simultaneously** — two fully independent schedulers with zero
awareness of each other, on almost every entry page on the site. That's
the clearest evidence of the "scattered mess" the 178 brief described,
not just an inference from the six-file count.

Also found: `randanime_maestro.js` already built a 5-tier weighted
system (`miniscule/minor/moderate/major/massive`) with a `WEIGHTS`
object — but that object is defined and never actually read anywhere
in its own scheduling logic. The weighting was decorative, not
functional. Worth not repeating — this new system's per-tier weights
are read directly by `effectiveRange()` on every scheduling decision.

Also found: only `ambient-glitch-entries.js` ever checked
`prefers-reduced-motion`. The landing engine and both randanime
variants did not. The new system checks it once, globally, and goes
fully inert if set — no CSS injected, no elements created, no timers
started.

## Architecture

Three tiers — `small`, `medium`, `large` — each a plain array of effect
functions in `POOLS`. Each function knows nothing about timing, only
what it does when fired, matching the brief's original framing.

One scheduler per tier, each with its own floor (`TIER_FLOOR_MS`: 3s
small / 6s medium / 12s large — never fired faster than this regardless
of weight) and a base range at weight 1.0 (`TIER_BASE_RANGE_MS`). A
page's `SIGNAL_MIX` weight (0–1, no need to sum to 1) scales how close
to the floor the effective range sits — higher weight, tighter/more
frequent; lower weight, looser/rarer; 0 disables the tier outright on
that page. This is the literal "mixing board channel" Maestro asked
for — one number per tier, set once, before the script tag.

All three tiers stagger their first fire (small ~2–5s in, medium
~6–12s, large ~15–28s) so a fresh pageview doesn't open with all three
firing in unison.

A single shared `safeToRun()` gate (reduced motion, tab hidden, hub
menu or TOC overlay open) replaces the three different ad-hoc checks
that used to live separately in `ambient-glitch.js`, `ambient-glitch-
entries.js`, and `randanime_shield.js`.

Per-page overrides, set before the script tag:
```html
<script>
  window.SIGNAL_MIX = { small: 0.6, medium: 0.3, large: 0.1 };
  window.SIGNAL_MESSAGES = { /* optional pool overrides, see file header */ };
</script>
<script src="/signal-interference.js"></script>
```

## Effect pools (18 total, consolidated from the four live scripts)

**Small (4):** scanline sweep, protocol notice (gold/cyan/red corner
text, generalized from SHIELD's system), paper-shift sepia breathing,
seal-pulse glow (feature-detects `.seal-img`, silently no-ops if absent
— same defensive pattern the old scripts used).

**Medium (6):** color bleed, horizontal bar interference + shake,
stamp flash, entry-word title flicker, integrity sweep, RGB split.

**Large (8):** text scramble, frame rip, pirate message flash, **pirate
station ID** (new — sequences "THIS IS THE ALLIANCE." / "WE INTERRUPT
THIS PROGRAM." as two beats rather than one flash), suppression
warning, lockdown flicker, **jamming freeze** (new — a hard freeze-
frame plus static burst that releases abruptly rather than fading,
matching the "yanked cable" feel from the brief), full meltdown (chains
several effects, ends in either a station ID or a suppression warning).

## Explicitly not built yet — real assets needed, not faked

Two of the discussed additions have real function stubs
(`fireCassetteHiss`, `fireMaskedGlimpse`) but are **inert** — they log
one console note and do nothing visible, and are deliberately left out
of every tier's pool. Cassette-hiss/tape-warble needs a real audio
file; the masked/silhouette "you're not supposed to be seeing this"
moment needs real art. Wiring in placeholder beeps or stock imagery
would be worse than waiting — flag when assets exist.

## Testing done so far

Standalone only — nothing live touched. Using jsdom (installed fresh
for this, not previously in the repo): confirmed the script loads
without throwing, confirmed all 18 effects fire individually without
throwing (both immediately and after a 4-second window covering every
effect's own delayed cleanup callbacks), and confirmed per-page
`SIGNAL_MIX`/`SIGNAL_MESSAGES` overrides actually take effect —
weight-0 genuinely disables a tier, and a custom message pool
genuinely gets used instead of the default.

**Not yet tested:** real browser rendering (CSS actually looks right,
z-index stacking doesn't fight with existing page chrome), real pacing
feel over an actual multi-minute session, and behavior on an actual
live page's real DOM (the jsdom test used a minimal stand-in body).

## Effect pools (28 total, consolidated from the four live scripts)

Grown from the initial 18 after Maestro asked to "greatly increase the
number in the hopper" — the additions are all real, already-tested
content ported from the old scripts, not invented filler.

**Small (8):** scanline sweep, protocol notice, paper-shift sepia
breathing, seal-pulse glow, **ink bleed** (thin vertical bleed near a
random gutter position), **double scan** (two scanline sweeps in quick
succession), **ledger pulse** (thin perimeter border pulse), **hex
audit** (protocol notice with a generated hex string instead of a
fixed line).

**Medium (10):** color bleed, horizontal bar interference + shake,
stamp flash, entry-word title flicker, integrity sweep, RGB split,
**encryption bleed** (scrolling hex/code rows), **redaction attempt**
(a black bar drawn over a real on-page paragraph/spec value, then
retracted — feature-detects `.section p, .spec-val, .fn-body`, silently
no-ops if none present), **screen tear** (single sharp tear + body
kicked sideways and snapping back), **document shake** (several quick
small translations of the whole body).

**Large (10):** text scramble, frame rip, pirate message flash, pirate
station ID, suppression warning, lockdown flicker, jamming freeze, full
meltdown, **signal dropout** (rapid opacity/brightness flicker reading
as the signal cutting in and out), **end of broadcast** (the "PLEASE
STAND BY" full-screen card — genuinely one of the strongest single
effects across the four old scripts).

## Second expansion — 40 effects (Session 179, same session)

Maestro asked for the pool to be "numerous." The four old scripts were
by that point fully mined out — every real, already-written effect had
already been ported — so this batch is genuinely new content, not
salvage. Built to match the established visual language rather than
invent a new one: same monospace fonts (`VT323`, `Share Tech Mono`),
same gold/cyan/red palette, same self-cleaning DOM-element pattern
every other effect already uses.

**Small (+4, now 12):** vignette pulse (breathing edge-darkening,
distinct from paperShift's flat wash), corner timestamp (a small
"● REC hh:mm:ss" readout, archival-surveillance register rather than
security-protocol register), flicker frame (a near-subliminal single
brightness dip, the quickest/smallest effect in the whole pool),
drift line (a faint vertical line crossing the screen horizontally,
distinct axis from the existing scanline sweep).

**Medium (+4, now 14):** channel switch (a hard black cut plus a
"CH 07"-style readout, like a physical dial turning), audio waveform
(a row of animating bars implying signal strength — purely visual, no
real audio backing it since none exists on these pages), coordinate
glitch (a corner readout of fake lat/lon plus a short trace hash,
different format from both encryptionBleed and hexAudit), margin note
(a small italic annotation — "verified ✓", "cross-ref: OK" — placed
near a real on-page paragraph/spec value when one exists, distinct
register from stampFlash's bold bordered stamp).

**Large (+4, now 14):** blackout (an instant hard cut to black and
back, no fade either direction — more brutal than jammingFreeze's
brightness/contrast shift), cipher overlay (a full-screen block of
structured uppercase cipher-looking text that holds and fades once,
distinct from scramble's continuously re-randomizing noise), archive
seal (a large ceremonial seal graphic slamming into center with a
shake — gives an actual visual payoff to the "ARCHIVE SEAL: UNBROKEN"
line that already existed only as text in the protocol notice pool),
transmission countdown (a 3-2-1 beat that builds into a blackout — the
only large effect that builds toward something rather than firing
immediately).

Verified the same way as before: all 40 effects fire without throwing,
both immediately and after a window covering every delayed cleanup;
per-page config overrides still work; all 40 fire cleanly against
maestro.html's actual real markup, not just a generic stand-in.

## Small tier doubled — 24 small, 52 total (Session 179, same session)

Direct request: double the small-tier count. 12 new effects added,
all genuinely new (the well was already dry from the two prior
expansions), deliberately the quietest, least "glitch," most ambient
additions yet — the point of this batch was to make the small tier
feel like a living texture rather than a fixed rotation of the same
dozen beats.

New small-tier effects: dust mote (a single tiny speck drifting slowly
on a diagonal, like dust in projector light — the quietest effect in
the whole pool), static whisper (an extremely faint single-frame
static flash, reusing the shared static primitive at very low
intensity), cursor ghost (a faint expanding ring at a random point,
like a phantom click echo), ghost text (a faint, fast-fading duplicate
of the page's own title offset slightly — distinct from
fireEntryWordVerify, which flickers the real title in place rather
than spawning a copy), pulse dot (a small blinking status-light dot in
a corner, pure indicator with no text), edge crackle (a few faint
hairline sparks along one screen edge), signal bars (a small
phone-style four-bar signal indicator, distinct from the medium-tier
audio waveform's wide row of many bars), timecode blip (a quick
SMPTE-style ticking counter, distinct from corner timestamp's static
surveillance-camera readout), hairline fracture (a single small jagged
static crack line at a fixed spot, distinct from drift line which
travels), color temp drift (a very subtle cool/blue hue shift, the
opposite pole from paper shift's warm sepia), frequency blip (a single
thin EQ-style bar blinking once, distinct from both signal bars and
the medium-tier waveform), margin tick (a tiny crosshair calibration
mark, the most utilitarian-looking effect in the pool).

Verified the same way as every prior expansion: all 52 effects fire
without throwing (immediate + delayed-cleanup window), config
overrides still work, all 52 fire cleanly against maestro.html's real
markup.

## fireHeaderChromaSplit — direct request (Session 179)

Asked for specifically: the page's title separating into RGB, drifting
apart slightly, then recombining. Neither existing effect actually did
this — `fireRGBSplit` is a whole-screen color overlay that snaps to
offset and only fades, never recombines; `fireGhostText` spawns one
single-color duplicate of the title that fades away, no channel split,
no recombine motion.

`fireHeaderChromaSplit` (medium tier, 53rd effect) builds three real
duplicate layers of the actual title text — red, green, blue, each
`mix-blend-mode: screen` — drifts them apart a few pixels in different
directions over ~260ms, holds briefly, then animates all three back to
zero offset over ~340ms before removing the layers. Feature-detects
the title the same way `fireEntryWordVerify` and `fireGhostText`
already do (`#entryWord` / `.entry-word` / `.title` / `h1`); silently
no-ops if none found.

Verified with a dedicated test using a mocked non-zero
`getBoundingClientRect` (jsdom doesn't do real layout, so the default
zero-width rect would make the feature-detection guard silently bail
every time without this) — confirmed it actually builds three layers
carrying the real title text in the three intended colors, not just
that it "didn't throw."

## How to add a new effect — the actual contract

Proven in practice: 21 effects were added across four separate rounds
this session without ever touching the scheduler, `effectiveRange`, or
the timing constants once. The contract is genuinely two steps.

**Step 1 — write a plain, no-argument function.** It owns its entire
lifecycle: builds its own DOM elements, styles them inline (reuse the
palette below), and cleans itself up with `setTimeout`/`.remove()`.
Nothing else in the file needs to know it exists.

**Step 2 — add the function name to a tier array.** `POOLS.small`,
`POOLS.medium`, or `POOLS.large`. That's the only registration step.
The scheduler just does `pick(pool)()` — it doesn't care how many
effects are in a pool or what they do.

Minimal template:
```js
function fireYourEffectName() {
  const el = document.createElement("div");
  el.style.cssText = `position:fixed;pointer-events:none;z-index:99969;opacity:0;transition:opacity 0.3s ease;/* your styling */`;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 400);
    }, rand(800, 1500)); // how long it holds before fading
  });
}
```
Then just add `fireYourEffectName,` inside the right tier's array in
`POOLS`.

Shared palette already established (reuse rather than invent new
colors): gold `rgba(212,175,55,*)` / `rgba(184,134,11,*)`, cyan
`rgba(92,220,235,*)`, red `rgba(255,74,74,*)`. Fonts: `'VT323'` for
large display text, `'Share Tech Mono'` for readouts/labels. `pick()`,
`rand()`, `randInt()`, and `cornerPosition()` are all available
helpers already defined near the top of the file.

One soft convention, not a hard rule: check the existing pool for
something conceptually close before naming a new effect, so two
effects don't quietly do the same thing under different names — every
new effect this session got a one-line comment noting what it's
distinct from, for exactly this reason.

## First live trial: entries/maestro.html (Session 179)

Live as of this session. `randanime_maestro.js` and `ambient-glitch-
entries.js` both removed from this one page; `signal-interference.js`
added in their place with a page-level `SIGNAL_MIX` of `{ small: 0.9,
medium: 0.6, large: 0.3 }` — an exact 3:2:1 ratio per Maestro's direct
request ("3 smalls for every large, 2 mediums"), read here as a
firing-frequency ratio rather than a pool-size ratio, and deliberately
denser overall than the sitewide default (`0.6/0.3/0.1`) since this is
meant to feel more active than a typical entry page, not just
proportioned the same way. Worth flagging: with floors of 3s/6s/12s
built into the scheduler itself, a literal 3:2:1 *pool size* would look
different from a 3:2:1 *frequency* — if the felt pacing doesn't match
what "3 smalls for every large" meant once you actually watch it run,
that's the knob to adjust, not the effect pools themselves.

Verified before pushing: all 28 effects fire without throwing against
a DOM stand-in built from maestro.html's own actual selectors (real
`h1.hero-title`, real `.seal-img` elements, real `.spec-val`/`.fn-body`
targets) — not just a generic placeholder body. The generic `h1`
fallback in `fireEntryWordVerify` correctly finds this page's actual
title, and `fireSealPulse` correctly reaches its real seal images.

**Still not verified:** actual browser rendering on this real page (all
testing here is jsdom/logic-level, not visual), and real-time pacing
feel over an actual multi-minute viewing session — that needs your own
eyes on the live page once Cloudflare Pages deploys this push.

## Sitewide rollout complete (Session 179, same session)

Per direct instruction: every live page except `/warning` (the
`index.html` ACCESS DENIED gate) and the WE ARE DORK board game demo
now runs the PBE. 77 pages total.

Worth noting: the 178 brief's original count of 155 pages loading
`randanime_shield.js` didn't match what a direct grep found tonight —
the real number was 83 (11 of which turned out to be stale duplicates
in `scripts/walkthrough_check/`, a scratch directory never actually
served, leaving 72 real live pages). Numbers drift between sessions;
recounted directly rather than trusting the earlier figure.

**72 entry pages:** `randanime_shield.js` + `ambient-glitch-entries.js`
(both running simultaneously, uncoordinated, on every one of them)
replaced with a single `signal-interference.js` include. No per-page
`SIGNAL_MIX` override — these use the engine's own sitewide default
(`0.6/0.3/0.1`), a quieter register than MAESTRO's or the landing
pages', matching what SHIELD's original character was going for.

**5 landing/hub pages** (`dice-src`+`dice`, `the-system-src`+
`the-system`, `landing.html`): `ambient-glitch.js` replaced with a
denser, more large-tier-leaning mix (`0.7/0.5/0.5`) matching these
pages' prior punchier pirate-broadcast character — this was the "main
event" engine, and it's meant to still feel that way.

**`foundation.html` deliberately excluded.** It never actually loaded
`ambient-glitch.js` as a script include — it only mentions it in a
comment, because it has its own bespoke inline glitch effects
"inspired by" the same techniques rather than using the shared script.
That's a genuinely different situation the original six-script
consolidation scope never covered, and it deserves its own decision
rather than getting silently folded into a sitewide sweep. Also found:
`entries/ai.html` had a small custom `.signal-decay` effect with a
comment explicitly assuming it layers "on top of (not replacing)
randanime_shield.js" — updated that comment to reference the PBE
instead, since the assumption still holds, just under a new name.

Verified before pushing: every one of the 77 touched files has exactly
one `signal-interference.js` include and zero remaining old script
tags (checked programmatically across all of them, not sampled);
zero pages ended up with duplicate PBE includes; the engine file
itself was untouched by this rollout and still passes its full test
suite.

**Not yet verified:** real browser rendering across this many
different page templates and layouts at once. The engine's DOM/CSS is
self-contained and shouldn't conflict with page-specific styles, but
77 pages is a lot of surface area to have only checked with jsdom —
worth spot-checking a handful of different page types (not just
entries) once this deploys.

