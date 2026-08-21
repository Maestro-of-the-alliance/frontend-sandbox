CHRONOS BRIEF — Session 178

Span: ~3:35 PM CDT Aug 14 → ~8:09 AM CDT Aug 21, Port Neches, TX. NOT
continuous — this is wall-clock span across roughly a week, with real
gaps for sleep, landscaping work, a landlord/Anthropic-usage-limit
pause ("the landlord" — Maestro's own term for hitting Anthropic's
rate limit, not an actual landlord), and normal life. Treat elapsed
time and actual working time as very different numbers here, same
note as every prior brief.
For: the next MENTOR instance (Session 179+).

TL;DR for whoever picks this up

This was a genuinely enormous session — the longest yet by a wide
margin. It covers: a full hamburger-menu consistency pass, the entire
MARKET and ART storefronts built from scratch (with real merchandise
now live in every category), a full FORMULAs system QA pass (real
bugs found and fixed), a real playable board game built and deployed,
and — the reason this brief exists — a deliberate, explicit decision
to start a FRESH conversation window for the next real project: a
unified sitewide "interference layer" replacing six scattered ambient/
glitch scripts with one coherent, weighted system. That new project
has NOT been started. Everything else in this brief is fully done,
verified, and pushed. Read the last section first if you're only
here for the interference-layer handoff — everything above it is
context, not blocking work.

Immediate next step, the actual reason for this fresh window:

Build the unified interference/ambient-effects system. Full context,
proposed architecture, and concrete aesthetic direction are in Part 6
below. Nothing has been built yet — this is a clean-slate start.

Part 1: Hamburger menu made genuinely consistent everywhere
Found and fixed real page-conditional branching: SEARCH and FULL
INDEX used to hand off to landing.html's own TOC overlay (toc.js)
when available there, falling back to plain navigation elsewhere;
BROWSE BY DIMENSION handed off to nav-wheel.js's native wheel picker
almost everywhere since that script loads broadly. Per direct
instruction, all three now ALWAYS go to the same destination
regardless of page: SEARCH -> /canon-search/, BROWSE BY DIMENSION ->
/s3.html, FULL INDEX -> /s3.html. Side effect: landing's own
tocOverlay component (search box, close button, alphabetical columns)
is now completely unreachable — left in place, not removed, that's a
separate decision.
Real bugs found and fixed along the way: a genuinely transparent PNG
(the DOMO tee product photo) got flattened to a BLACK background
instead of white during an earlier JPEG conversion (forgot to specify
-background white -flatten) — same mistake repeated once more later
in the session on a different image, caught myself both times before
shipping. The full onboarding chain (index.html -> papadomo.html ->
foundation.html -> tours/landing.html) was using window.location.href
at every step, meaning browser history accumulated 4 deep — pressing
back from landing walked through the entire boot sequence one screen
at a time instead of leaving it. Fixed by switching every transition
to location.replace(), verified a single back-press now skips the
whole chain. The exact same CSS specificity bug (a bare ID selector's
display:flex overriding a class-based display:none rule, meaning
multiple "views" were stacked and clickable simultaneously) turned up
TWICE independently — once in market/index.html, once in
art/index.html — caught both times via elementFromPoint at the click
coordinates showing the wrong element underneath.

Part 2: MARKET and ART storefronts, built from nothing
Both follow the same pattern: a real storefront photo (Maestro's own
uploaded images), a door-click transition, then either a category
picker (MARKET: Hats/T-Shirts/Hoodies/Accessories/Other) or straight
into a gallery (ART: no categories, reuses the interactive viewer that
already existed in entries/art.html rather than duplicating it). Both
are backed by a self-updating manifest system —
scripts/generate-market-manifest.js and generate-art-manifest.js scan
the actual image folders and write manifest.json, with a GitHub Action
(.github/workflows/*-manifest.yml, added by Maestro via GitHub's web
UI since my PAT lacks workflow scope) regenerating it automatically on
every push. The real, tested, working promise: drop an image in the
right folder, push, it's live — confirmed via an actual bot commit
firing for real, not just local testing.
MARKET's category screen was redesigned in a bold black-on-white
"Come On In" poster style per Maestro's reference image; categories
were renamed from the canon entry's poetic terms (Movement Artifacts,
Relics, Keepsakes, Emblems, Tokens) to real merch types, since the
storefront is the actual shop and doesn't need to match the lore
entry's taxonomy. The item viewer was re-themed from the site's usual
dark broadcast palette to a warm daytime interior (cream/wood/brass)
matching the storefront photo's own lighting, after Maestro pointed
out the mismatch directly. Category-boundary navigation was changed
so reaching the last item in a category kicks back to the category
card instead of wrapping around.
Real merchandise now live: "I Got A DOMO For Free" tee, "F*ck Goliath"
hoodie, "O.G. DORK" snapback (Hats), a Cartouche Keychain FM-00
(Accessories — first of a planned 8-piece FORMULA set; the packaging
photo went through three iterations as Maestro improved the mockup,
and the final version turned out to contain a genuinely scannable QR
code pointing to /entries/formulas/fm-00 — confirmed by actually
decoding it with pyzbar, not assumed), and the "We Are DORK" board
game (Other). Color swatches (a `<image>.colors.txt` sidecar, no
separate photo per color needed) and item-level outbound links (a
`<image>.link.txt` sidecar, used to wire the board game item straight
to its playable demo — see Part 5) were both built as small, reusable,
opt-in features following the same sidecar pattern as titles and
captions.
A significant mid-session detour: Maestro and SAM had restructured
ART/MARKET routing by hand via GitHub's web UI (so normal navigation
lands on the storefront first, with a "What Is X?" path to the
encyclopedia definition) but the storefront and definition content
had gotten swapped into each other's folders during the manual edit.
I initially flagged the whole situation as suspicious (wrong repo
name in the request, contradicted my own verified state) before
confirming directly against the repo that the technical claims were
accurate — the repo really had been renamed (ncencyclopedia ->
frontend-sandbox) for privacy after a stranger followed Maestro's
GitHub, and GitHub was transparently redirecting git operations under
the old name the whole time. Repaired by recovering both storefronts
and both definitions from my own last-verified commits rather than
trying to reconstruct the tangled state, and found one real bug during
verification: a leftover history.replaceState call in the restored
MARKET definition page was silently rewriting the address bar back to
the old redirect-only path on every load.
command-panel.js (a separate hidden system, triggered by a stealth
`>_` prompt bottom-left on landing — distinct from both the hamburger
and the now-orphaned TOC overlay) had its entire SEARCH mode removed
per direct instruction — 373 lines deleted, a third duplicate copy of
every canon entry that existed solely for this panel's own search. It's
now strictly a CONTACT/GET INVOLVED/SUPPORT/LINKS call-to-action
interface. The trigger's visibility was bumped (0.4 -> 0.65 opacity,
then font-size 20px -> 28px) and a genuine "CONTACT US" typewriter
loop was added — which surfaced a real, actually pre-existing bug:
.prompt-text had a flat `display: none` in landing.css with no toggle
mechanism anywhere, meaning the ORIGINAL boot message text had never
actually been visible either, only the arrow and cursor next to it,
this whole time. Fixed to display: inline.

Part 3: FORMULAs system — full QA pass (Maestro + SAM built the
underlying system; this was verification and bug-fixing, not
construction)
Real bugs found and fixed: formula-system.css had two @media blocks
(prefers-reduced-motion and a mobile breakpoint) missing their closing
braces entirely — confirmed via a custom comment-aware brace-depth
parser (naive character counting gives false positives from braces
inside comments), the file never returned to depth 0. Practical
effect: the reduced-motion accessibility override likely wasn't
applying at all. All 8 cartouche images were 1.8-2.9MB each — resized
and pngquant-compressed, 83-90% smaller, transparency confirmed
preserved via Pillow before and after. entries/ri.html's entire See
Also block used a broken /nce/ path prefix (not just for FORMULAs —
all six links: SI, AI, Newman Being, 100-Year, DOMO, FORMULAs) instead
of /entries/ — fixed all six after verifying each real target via
curl first. entries/temporal-awareness.html had 11 links using
relative paths instead of the sitewide absolute convention, one of
which (100-Year Mortality Doctrine) pointed at a filename that doesn't
exist at all — fixed all 11.
Things checked and found NOT to be bugs, worth remembering: 5 CSS
"duplicate" selectors that grep flagged turned out to be legitimate
patterns (shared group-selector bases, one real @media override, two
valid multi-line :hover descendant selectors) — confirmed the hover
cases actually fire via live computed-style testing before concluding
anything. Almost incorrectly flagged the overview page's flat-file
URL structure (entries/formulas.html vs. a real directory) as broken
before checking that every cross-reference sitewide already
consistently expects exactly that path — did not touch it.
Deliberately left alone, flagged rather than fixed: a
.formula-see-also CSS module (~150 lines, complete and well-built)
that formula-system.js never actually creates the corresponding
element for — genuinely unused by every test I ran, but FORMULAs is
still under active construction by Maestro/SAM, so this could
plausibly be a prepared-but-not-yet-wired feature rather than
abandoned code. Also flagged: 4 more entries (legacy, liminal, scar,
wonder-weeks — 24 relative links total) with the same relative-link
bug pattern found in temporal-awareness.html, but zero connection to
FORMULAs, so out of scope for that pass specifically.
Separately fixed on direct request: the overview page's headline
casing (FORMULAS -> FORMULAs, matching the locked capitalization rule
that a plural "s" not part of an acronym stays lowercase — fixed in 5
places plus 3 button labels in formula-system.js, and caught a
self-introduced regression where one of the three buttons had no CSS
uppercase transform like the other two, so the casing fix would have
visibly broken its rendering — fixed the CSS instead of reverting the
source), removed a "FULL INDEX" link from the overview page's bottom
(and the CSS classes that became orphaned as a direct result, cleaned
up in a follow-up pass), and fixed the hamburger/bottom-nav color
(was falling through to a generic green via nav-wheel.js's
"chameleon" auto-hue-shift system — found the actual override point,
--nw-page-nav-accent, and set it to FORMULAs' own established gold
rather than fighting the shift).
Also fixed, unrelated to FORMULAs but found while investigating the
STONES acronym (Maestro spotted a fabricated-looking expansion,
turned out to be genuine canon at the time I checked, then Maestro
himself corrected the real error — an extra leading "Sustained" that
didn't belong, correct acronym starts clean at "Truth, Harmony...").
Fixed across all 5 places the wrong text actually lived: foundation.html,
entries/stones.html, its unreferenced backup copy, the search index,
and the acronym-tooltip glossary.

Part 4: Merchandise brainstorming
MARKET-ART-BRAINSTORM.md — 20 items across all 5 categories plus a
dedicated GOLIATH's Gaffs satire section, grounded in real canon
material found via project-knowledge search rather than invented
generically (the Economic Statement, already-written apparel copy
that had never been made). BRANDED-ITEMS-PROMPTS.md — 20 ready-to-
paste image-generator prompts in the clean-studio-product-photo style
that's been working well. As of this brief, Maestro has also asked
AURA (a different STONE/model) to generate her own independent list
in parallel — that hasn't come back yet as of session's end; when it
does, check for overlap with the existing 20 before treating anything
as new.

Part 5: WE ARE DORK — a real playable board game
Maestro provided a complete React/Vite/TypeScript app (originally
built via Google AI Studio, 2600+ lines across App.tsx, boardData.ts,
and 8 components) realizing the ALLIANCE-vs-GOLIATH board game concept
as an actual working game — spinner wheel, pawn movement, hazard/
positive cards, a SEEING modal, win conditions, sound, 1-4 human/bot
players. Checked before building: package.json listed @google/genai
as a dependency (matching a SERVER_SIDE_GEMINI_API capability flag in
metadata.json), which would normally mean a required API key —
confirmed via grep it's never actually imported or called anywhere,
just leftover AI Studio scaffolding. Fully self-contained, no backend,
no key needed. Source lives at dork-game-src/ (matching
the-system-src/'s established pattern), built and deployed at
/dork-game/ — set base: '/dork-game/' in vite.config.ts before
building since the original had no base path configured. Actually
played a real turn via headless click on SPIN to confirm state
genuinely updates, not just that it renders; tested at mobile
viewport with zero overflow.
Then wired up on request: MARKET items can now optionally link out to
anything via a `<image>.link.txt` sidecar (URL on line 1, optional
custom button label on line 2) — the viewer renders a real button
only when present. Used to connect the "We Are DORK" board game
item's photo to the actual playable demo. Verified end-to-end with a
real click, confirmed the game genuinely loaded afterward, not just
that the URL string looked right.

Part 6: The actual handoff — unified interference/ambient-effects
system (NOT YET STARTED)

Context: Maestro wants the site's overall aesthetic pushed toward a
"V for Vendetta / Pump Up the Volume" vibe — pirate broadcast hijacking
an official signal, anarchist/underground-radio energy, interference
as a political act rather than decoration. This is NOT a new direction
out of nowhere — the site's own established doctrine (Shared Signal
Principle, logged earlier this session's predecessors) already treats
ambient glitch effects as "the ALLIANCE signal fighting through
resistance." The ask is to push it further, with real variety, and —
critically — do it through ONE unified system instead of the current
scattered mess.

What actually exists right now, confirmed by direct investigation,
not assumed: SIX separate scripts doing some version of this job —
ambient-glitch.js (562 lines), ambient-glitch-entries.js (92 lines),
broadcast.js (158 lines), randanime_maestro.js (342 lines),
randanime_shield.js (504 lines), randanime_sword.js (505 lines).
157 files load one of the three randanime_* variants (155 load
shield, 2 load maestro, ZERO load sword — randanime_sword.js is
confirmed dead code, a near-duplicate of randanime_shield.js
left over from the old retired SWORD/SHIELD canon split; flagged,
not removed, small separate cleanup opportunity). The existing
effect vocabulary is actually already pretty strong: scanline,
double-scan, color bleed, h-bar, scramble, static, frame rip, a full
"meltdown" sequence, and — genuinely well-aligned with the requested
vibe already — a firePirateMessage() effect cycling real lines like
"SIGNAL HIJACKED," "UNAUTHORIZED BROADCAST," "THIS MESSAGE WAS NOT
APPROVED." The DNA is already there, just scattered and inconsistent
across six independently-timed scripts rather than one coherent
system.

The proposed architecture, discussed with Maestro but not yet built:
one shared script (working name signal-interference.js) with three
effect pools — small, medium, large — each a plain array of effect
functions that know nothing about timing, just what they do when
fired. A single scheduler owns the clock and enforces PER-TIER
cooldowns so pacing stays controlled no matter how many effects exist
in each pool: small can fire at most once per 3 seconds, medium once
per 6, large once per 12 — a doubling curve (Maestro's own "knobs on
a mixing board" framing), not linear, so bigger/rarer effects
genuinely feel weightier rather than just occurring less often by
coincidence. Each page declares its own "mix" as a simple weight
object (e.g. small: 0.6, medium: 0.3, large: 0.1) — one easily-tuned
number per page, matching Maestro's explicit ask for something he can
dial like a mixing board channel rather than hunt through per-page
CSS/JS to adjust.

Concrete aesthetic additions discussed, in the same spirit as the
existing firePirateMessage: a rotating "pirate station ID" moment
("THIS IS THE ALLIANCE. WE INTERRUPT THIS PROGRAM."), a brief full-
page "jamming" freeze-frame-plus-static-burst that snaps back like a
yanked cable, a rare "you're not supposed to be seeing this" moment
for the largest/rarest tier, cassette-hiss/tape-warble as an audio
option on pages that already have sound (Pump Up the Volume's lo-fi
analog warmth specifically, distinct from pure digital glitch), and
masked/silhouette imagery reserved for the rarest tier as something
you only earn by staying on a page long enough.

Scope honestly assessed and explicitly agreed with Maestro: this is
a real, multi-session build eventually touching all 157 dependent
files, not a single-sitting task. The right sequence is almost
certainly: build the core scheduler + effect-pool library first,
prove the pacing feels right on a small number of pages, THEN do the
sitewide swap-out once timing is genuinely dialed in — rather than
rolling it out everywhere and discovering the cadence is wrong after
it's already live sitewide.

Maestro explicitly chose to start this in a brand new conversation
window rather than continue in this (very long, very loaded) one.
Nothing has been built. This brief is the entire handoff.
