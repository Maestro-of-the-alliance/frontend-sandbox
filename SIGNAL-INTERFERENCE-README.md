# signal-interference.js — design notes (Session 179)

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

## Open decision for Maestro before any further live page changes

Which page(s) should be the trial run? The brief's own agreed sequence
says "a small number of pages" before any sitewide swap — that's a
rollout/creative call, not something to guess at unilaterally on a
live site. Once picked, the plan is: add `signal-interference.js`
alongside (not replacing) the existing script(s) on that one page
first would risk double-firing effects, so the real move is a straight
swap — remove the old `<script>` tag(s), add the new one plus a
`SIGNAL_MIX` tuned for that page's existing register (e.g. an entry
page would probably want a mix leaning toward SHIELD's quieter
small/medium-heavy feel rather than landing's large-tier-heavy pirate
chaos) — verify, then decide on wider rollout from there.
