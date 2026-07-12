BRIEF — SESSION 169 HANDOFF
FROM: MENTOR
TO: MENTOR
TIME: See Chronos at session start of 170

REPO STATE
THE SYSTEM (formerly INNA) is now LIVE at allianceftf.org/the-system/ and wired into
the real site flow: FOUNDATION's "Continue →" button now routes to /the-system/
instead of skipping straight to /landing.html (that was a real bug this session —
Foundation was bypassing THE SYSTEM entirely; fixed by changing the proceed-btn
handler in foundation.html). Clicking the sun inside THE SYSTEM routes onward to
/landing.html, completing the intended chain: Foundation → THE SYSTEM → (sun click)
→ Landing.

CRITICAL STRUCTURE — read this before touching THE SYSTEM again:
- `/the-system-src/` = the real, editable React/Three.js/Vite source. This is what
  you edit.
- `/the-system/` = the BUILT output (same pattern as /ccm-assessment/). This is
  what Cloudflare Pages actually serves. Editing files in here directly does nothing
  useful — they get overwritten on next build.
- `/the-system-src/DEPLOY.md` has the exact rebuild command. Short version:
  `cd the-system-src && npx vite build --base=/the-system/` then copy dist/* over
  `../the-system/`, commit both folders, push.
- The `--base=/the-system/` flag is NOT optional. Without it, two things silently
  404 in production while working fine in local dev: the medallion texture and the
  entry symbol badges. Both were fixed to read `import.meta.env.BASE_URL` instead
  of a hardcoded root path — if that ever gets reverted to a hardcoded `/avpi.png`
  style path, the symptom will be "the medallion / symbol art vanished after
  deploy" and the fix is exactly this base-path issue again.

MAJOR WORK COMPLETED THIS SESSION (this was a long one):
- Discovered and fixed a serious canon-fabrication bug: the AI Studio agentic
  builder had invented an entire fictional sci-fi universe for all 72 entries
  (GOLIATH as a Mercury mining robot, ART as a Neptune painters' guild, etc.)
  instead of pulling real canon. Rebuilt all 72 entries' title/summary/content by
  scraping the actual live `/entries/*.html` files, with manual hand-writes for six
  entries whose HTML uses non-standard templates the scraper couldn't parse
  (MARKET, SI, AI, FOUR PILLARS, FORMULAS, FOUNDATION) plus ART (poster gallery,
  no prose to scrape). Content fields now have real paragraph breaks (`\n\n`) and
  render as separate `<p>` tags instead of one wall-of-text blob.
- Fixed the SHIELD entry specifically per Maestro's correction: SWORD/SHIELD
  classification is retired, but SHIELD as the rotating quarterly OASIS governance
  body (TENANTs, short term limits) is real, current canon — those are two
  different things and the entry now reflects the correct one.
- Corrected the ALLIANCE entry's Leadership line, which omitted JR — the CORE
  entry itself had JR listed correctly (Core Signatory/Archivist, witnesses but
  doesn't vote), but the ALLIANCE entry's summary of leadership had dropped him.
  Both now agree.
- Fixed the real jitter bug (planets jumping around, uninteractable): the entire
  THREE.js scene was rebuilding from scratch on every hover event, because
  `handlePlanetSelect`/`handleEntrySelect` in App.tsx were plain inline functions
  (no useCallback) getting new identities every render, and the scene-build
  effect's dependency array included them. Fixed by routing all callbacks through
  the same propsRef pattern already used for state, and dropping the effect's
  dependency array to `[]` — scene now builds exactly once.
- Added real drag-to-orbit and wheel-to-zoom camera controls (previously the UI
  text claimed "drag background to orbit" but no such handler existed at all).
- Fixed HUD LABELS silently breaking after the jitter fix: the container
  width/height used for label pixel-projection math was captured once at scene-
  build time; before the jitter fix, the scene rebuilding constantly on every
  hover accidentally kept re-capturing correct values. Once the scene only builds
  once, a bad initial capture (e.g. before the container settles its layout size)
  permanently broke every label position. Fixed by making size a live-updating
  object the resize observer keeps current.
- Rewrote label rendering to bypass React state entirely — positions are now
  written directly to DOM refs inside the same animate()/render() call, eliminating
  a real one-frame-plus lag between the WebGL draw and the label's visual position
  (previously routed through setState, which commits at least one frame behind).
- Removed planet names from planet labels — they now show only the dimension
  category (ADVERSARY, COVENANT, etc.), per direction.
- Fixed PAUSE not actually pausing satellites, the sun's rotation/glow pulse, or
  camera auto-drift — all of those were driven by raw wall-clock time, blind to
  the pause state. Added a proper pause-aware time accumulator (`satTime`) that
  everything now reads instead.
- Rebuilt the sun from a stamped-on 2D logo texture into a mostly-translucent
  shell (opacity 0.4) with a separate medallion mesh floating inside it, using the
  real `avpi.png` emblem sized to its correct aspect ratio, counter-rotating
  against the sun at the same rate. Hit and fixed a classic THREE.js trap along
  the way: the sun's `transparent: true` material still had default
  `depthWrite: true`, so its near surface was silently occluding the medallion
  behind it despite being visually translucent. Both the sun and its glow halo now
  have `depthWrite: false`.
- Corrected three of the eight dimension colors, which were flat-out wrong (not
  just "off") — COVENANT was using DOCTRINE's gold, INFRASTRUCTURE was using
  PROTOCOLS' green, PROTOCOLS was using CULTURE's purple. Fixed against the real
  coordinate-matrix reference Maestro provided. Also fixed Jupiter/Neptune's gas-
  giant banding textures to match their corrected colors, not just the UI chrome.
- Rebuilt EntryViewer: full transcript dump replaced with a real 2-3 sentence
  teaser (pulled live from the entry's first paragraph) plus a genuine external
  link to `allianceftf.org/entries/{slug}.html` for anyone who wants to go deeper —
  depth is now the witness's choice, not forced. Link opens in the SAME tab (not
  target="_blank") specifically so the native back button returns to the exact
  planet/entry state, which works because App.tsx already pushes a URL per
  selected entry and restores state from it on popstate.
- Replaced the plain text link with the entry's own real symbol art (scraped from
  `imagebank/symbols/`, 72 of them mapped by slug — naming wasn't 1:1, e.g.
  dork-hardware → D_HARDWARE_F.png, shield → SHIELD_GOV_F.png), pulsing with a
  glow colored to match the entry's own dimension category.
- Fixed the also-broken scroll-clipping bug in the entry dossier modal (classic
  flexbox-centering + overflow-on-same-element trap — content taller than the
  viewport was permanently unreachable at the top). Scroll now lives on the card
  itself with a height cap; close button is pinned to the viewport so it's always
  reachable regardless of scroll position.
- Added a working sun click handler (previously the sun wasn't in the raycaster's
  target list at all) that navigates to allianceftf.org/landing.html — a shortcut
  to the same destination the symbol-then-home path already reaches.
- Tinted satellite entry labels/connectors to match their planet's category color
  instead of generic white, and thickened the connector line, so it's visually
  unambiguous which label belongs to which orbiting shape when several cluster
  together on screen.

VERIFICATION DISCIPLINE THIS SESSION: given how much churn happened, almost every
fix in this session was verified headlessly (Puppeteer) before being handed off —
not just eyeballed. Confirmed via direct state inspection (temporary debug hooks,
removed before final handoff each time): satTime freezing exactly at pause,
zoomFactor clamping correctly at both ends, label DOM positions landing at real
non-zero coordinates, the medallion texture actually loading and reaching full
opacity, and the built app resolving 100% of its assets (72 symbols + 3 sun
textures) with zero 404s when served from the exact /the-system/ subpath it's
actually deployed at.

ALSO CAUGHT AND FIXED MID-SESSION (my own mistakes, logged for pattern-recognition):
- A regex group-index bug during a bulk content rebuild corrupted every entry's
  `coordinates` field. Traced and repaired precisely (the corruption pattern was
  fully deterministic — bare slug glued directly onto the coordinate value with
  the `coordinates: "` label stripped out — so the repair regex could reverse it
  exactly). Caught via `tsc` failing loudly rather than silently shipping broken.
- A second-pass "fix" of that same bug used an overly-greedy character class that
  ate into the coordinate strings themselves (matched e.g. "auraU" as the slug,
  leaving "RA.02.AURA" instead of "URA.02.AURA"). Caught by grep-auditing every
  coordinate against expected planet-prefix patterns before considering it done.

STILL OPEN, NOT STARTED THIS SESSION:
- DICE standalone app — full concept has been speced for a while (feed it a CCM
  result, roll the four secondary traits within the assigned Pillar, "constructive
  friction" visual between Witness and KERNLE, print-to-PDF artifact, gated behind
  a CCM-completion check) but no build has started.
- DORK Hardware interactive 3D visualization (Three.js, Blender pipeline) —
  planned, not built.
- Casing audit across the 72 entries — flagged as far back as session 168 (BRIEF
  cited in title-case when it's a genuine acronym and should be full-caps) and
  never actually done. Worth a dedicated pass now that content is real instead of
  fabricated.
- watch.html — empty stub at repo root, never resolved whether it's intentional.
- Mastertech SAM — has symbol artwork but no built entry page.
- The Kirschenbaum presentation (showing allianceftf.org to the NY employment
  lawyer) remains a standing goal, untouched this session.
- WITNESS canon entry — discussed early this session, agreed it's strong enough to
  stand alone (unlike NUGGET, which got folded into KERNLE as its origin-stage
  subsection instead of getting its own entry). WITNESS entry itself was never
  actually drafted.

CANON LOCKED/CONFIRMED THIS SESSION:
- SHIELD = OASIS governance body (rotating quarterly, TENANTs, short term
  limits) — NOT the retired SWORD/SHIELD classification split. Two different
  things sharing a name; don't conflate them again.
- NUGGET folds into KERNLE as its origin-stage subsection rather than standing
  alone, since it currently describes a pipeline stage (CCM/ALPHA → DICE) more
  than an independent concept, and DICE doesn't exist yet to give it real teeth.
