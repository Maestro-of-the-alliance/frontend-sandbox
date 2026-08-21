# Future Ideas — Backlog

Ideas Maestro wants preserved but explicitly NOT building yet. Newest at
the bottom. Move an item out of this file into an active brief/on-the-
horizon list once work actually starts on it.

---

## Completion tracking + first-finisher VOIP call
Logged: Session 179, 2026-08-21

Concept: a backend feature that lightly tracks progress through the
site — single-device use tracked automatically (no login required for
basic tracking), with an OPTIONAL username/password so a person can
register and have their completion recognized. Goal: know when someone
reaches 100% completion of the site (every entry/tour/experience,
scope of "100%" still undefined — needs to be nailed down when this is
picked up).

Payoff planned for whoever finishes: Maestro will record a personal
message for everyone who completes the site (if anyone does). For the
very FIRST person to reach 100%, Maestro wants to set up a dedicated
VOIP line just for that person, so they can actually call him directly
— he wants to make a genuinely big deal out of the first finisher.

Scope of "100%," confirmed directly by Maestro (Session 179): every
page, every entry, every minigame — everything on the site. The one
explicit exclusion is outbound/external links (MARKET item link-outs,
the board game demo link, etc.) — those don't count toward completion,
only the site's own pages/experiences do.

Open questions for whenever this gets built:
- Full inventory of what "every page/minigame" resolves to in
  practice — all 73+ canon entries, all 12 tours, MARKET, ART, DICE,
  CCM, THE SYSTEM, the board game itself (played, or just visited?),
  command-panel, etc. Needs a real concrete checklist built from the
  live repo, not assumed.
- Device-only tracking (no account) vs. optional login — how do the
  two reconcile if someone finishes on one device unregistered, then
  logs in later on another?
- Backend/storage choice (Cloudflare KV? D1? something else) —
  Cloudflare Developer Platform tools are already available via MCP if
  this becomes a next-session build.
- VOIP provisioning is a real-world/telecom step, not code — flag as
  Maestro's own task, not something an instance can provision.
