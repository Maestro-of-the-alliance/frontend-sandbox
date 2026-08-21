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

Open questions for whenever this gets built:
- What counts as "100%" — every canon entry, every tour, MARKET/ART
  storefronts, DICE/CCM, THE SYSTEM navigation, all of the above?
- Device-only tracking (no account) vs. optional login — how do the
  two reconcile if someone finishes on one device unregistered, then
  logs in later on another?
- Backend/storage choice (Cloudflare KV? D1? something else) —
  Cloudflare Developer Platform tools are already available via MCP if
  this becomes a next-session build.
- VOIP provisioning is a real-world/telecom step, not code — flag as
  Maestro's own task, not something an instance can provision.
