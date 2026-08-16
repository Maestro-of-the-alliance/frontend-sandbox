/**
 * witness-state.js — shared N.C.E.ncyclopedia witness memory
 *
 * Small, deliberately narrow foundation (Session 178, spec by SAM,
 * built by MENTOR). Tracks explicit witness experience only:
 * which entries have been visited, how many times, when, in what
 * order, and which named artifacts have been discovered. Nothing
 * else. No inferred personality, no engagement scoring, no dwell-time
 * judgment -- that's surveillance theater, not witness-awareness, and
 * is deliberately out of scope for v1 and any version after it unless
 * that changes by explicit doctrine decision.
 *
 * This is memory of explicit experience: did this witness visit this
 * entry, did they find this artifact. Nothing inferred.
 *
 * Storage is a single versioned localStorage object, current-device
 * only -- there is no backend, no accounts, so this is real per-
 * browser memory, not cross-device witness identity. Kept entirely
 * separate from the tours system's own progress storage (tours_progress
 * / tour_pending_visit) -- different purpose, different completion
 * model, no reason to merge them. They can read one another later if
 * a real need shows up; nothing here reaches into tours' storage or
 * vice versa.
 *
 * Entries and other scripts should never touch localStorage directly
 * for witness data -- always go through this API, so the storage
 * shape can change later (see MIGRATIONS) without every call site
 * needing to know about it.
 *
 * Usage:
 *   const result = WitnessState.recordVisit('cipher');
 *   if (result.isFirstVisit) { ... }
 *
 *   if (WitnessState.hasVisited('mosaic')) { ... }
 *
 *   const found = WitnessState.discoverArtifact('cipher-redacted-line');
 *   if (found.isNewDiscovery) { ... }
 *
 *   const recent = WitnessState.getRecentHistory(5);
 *   const summary = WitnessState.getWitnessSummary();
 */
(function (window) {
  "use strict";

  const STORAGE_KEY = "nce_witness";
  const CURRENT_VERSION = 1;
  const MAX_RECENT_HISTORY = 30;

  function emptyState() {
    return {
      version: CURRENT_VERSION,
      entries: {}, // slug -> { visits, firstVisit, lastVisit }
      recentHistory: [], // slugs, most recent first, deduped consecutive
      artifacts: {}, // artifactId -> { discovered: true, firstDiscovered }
    };
  }

  // Migration ladder. Each function upgrades from its own key's
  // version to the next. Add a new entry here (keyed by the OLD
  // version number) whenever CURRENT_VERSION increments, so existing
  // witness history is preserved across schema changes rather than
  // getting nuked.
  const MIGRATIONS = {
    // 1: (state) => { ... return upgradedState; },
  };

  function migrate(state) {
    let s = state;
    while (s.version < CURRENT_VERSION) {
      const step = MIGRATIONS[s.version];
      if (!step) {
        // No migration path defined -- safer to start fresh than to
        // guess at a shape. This should only happen if CURRENT_VERSION
        // was bumped without adding the matching migration.
        return emptyState();
      }
      s = step(s);
    }
    return s;
  }

  function load() {
    let raw;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage unavailable (private browsing lockouts, etc).
      // Fail soft -- witness memory just won't persist this session.
      return emptyState();
    }
    if (!raw) return emptyState();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return emptyState();
    }
    if (!parsed || typeof parsed !== "object" || !parsed.version) {
      return emptyState();
    }
    if (parsed.version > CURRENT_VERSION) {
      // Newer schema than this script knows about (shouldn't normally
      // happen, but could during a rollback) -- don't attempt to
      // interpret it, just start fresh rather than corrupt it further.
      return emptyState();
    }
    return migrate(parsed);
  }

  function save(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      // Storage full, disabled, or unavailable. Fail soft.
      return false;
    }
  }

  function normalizeSlug(slug) {
    return String(slug || "")
      .trim()
      .toLowerCase();
  }

  /**
   * Record a visit to a canonical entry. Call once per page load on
   * an entry page. Returns info about the visit rather than requiring
   * a second read, since "was this the first visit" needs the
   * pre-increment state.
   *
   * @param {string} slug - canonical entry slug, e.g. "cipher"
   * @returns {{isFirstVisit: boolean, visitCount: number, firstVisit: number, lastVisit: number}}
   */
  function recordVisit(slug) {
    const key = normalizeSlug(slug);
    if (!key) return { isFirstVisit: false, visitCount: 0, firstVisit: null, lastVisit: null };

    const state = load();
    const now = Date.now();
    const existing = state.entries[key];
    const isFirstVisit = !existing;

    if (existing) {
      existing.visits += 1;
      existing.lastVisit = now;
    } else {
      state.entries[key] = { visits: 1, firstVisit: now, lastVisit: now };
    }

    // Recent history: most-recent-first, dedupe only immediate repeats
    // (revisiting the same entry twice in a row doesn't create two
    // history entries, but A -> B -> A is a real, meaningful sequence
    // and stays as three).
    if (state.recentHistory[0] !== key) {
      state.recentHistory.unshift(key);
      if (state.recentHistory.length > MAX_RECENT_HISTORY) {
        state.recentHistory.length = MAX_RECENT_HISTORY;
      }
    }

    save(state);

    return {
      isFirstVisit,
      visitCount: state.entries[key].visits,
      firstVisit: state.entries[key].firstVisit,
      lastVisit: state.entries[key].lastVisit,
    };
  }

  /** @returns {boolean} whether this entry has ever been visited */
  function hasVisited(slug) {
    const key = normalizeSlug(slug);
    if (!key) return false;
    return !!load().entries[key];
  }

  /** @returns {number} total recorded visits to this entry (0 if never) */
  function visitCount(slug) {
    const key = normalizeSlug(slug);
    if (!key) return 0;
    const e = load().entries[key];
    return e ? e.visits : 0;
  }

  /** @returns {number|null} timestamp (ms) of first visit, or null */
  function getFirstVisit(slug) {
    const key = normalizeSlug(slug);
    const e = key ? load().entries[key] : null;
    return e ? e.firstVisit : null;
  }

  /** @returns {number|null} timestamp (ms) of most recent visit, or null */
  function getLastVisit(slug) {
    const key = normalizeSlug(slug);
    const e = key ? load().entries[key] : null;
    return e ? e.lastVisit : null;
  }

  /**
   * @param {number} [limit] - max entries to return (most recent first)
   * @returns {string[]} recent entry slugs, most recent first
   */
  function getRecentHistory(limit) {
    const history = load().recentHistory;
    return typeof limit === "number" ? history.slice(0, limit) : history.slice();
  }

  /**
   * Mark a named artifact/interaction as discovered. Artifact IDs are
   * free-form strings chosen by whatever entry defines them (e.g.
   * "cipher-redacted-line", "mosaic-orbit-corroboration") -- this
   * module doesn't know or care what they mean, only whether they've
   * been found before.
   *
   * @param {string} artifactId
   * @returns {{isNewDiscovery: boolean, firstDiscovered: number}}
   */
  function discoverArtifact(artifactId) {
    const key = normalizeSlug(artifactId);
    if (!key) return { isNewDiscovery: false, firstDiscovered: null };

    const state = load();
    const existing = state.artifacts[key];
    const isNewDiscovery = !existing;

    if (isNewDiscovery) {
      state.artifacts[key] = { discovered: true, firstDiscovered: Date.now() };
      save(state);
    }

    return {
      isNewDiscovery,
      firstDiscovered: state.artifacts[key].firstDiscovered,
    };
  }

  /** @returns {boolean} whether a named artifact has been discovered */
  function hasDiscovered(artifactId) {
    const key = normalizeSlug(artifactId);
    if (!key) return false;
    return !!load().artifacts[key];
  }

  /**
   * Aggregate counts, useful for things like a "WITNESS RECORD: N
   * TRANSMISSIONS RECOVERED" display. Deliberately simple -- no
   * scoring, no derived judgments, just counts of explicit experience.
   */
  function getWitnessSummary() {
    const state = load();
    const entrySlugs = Object.keys(state.entries);
    const totalVisits = entrySlugs.reduce(
      (sum, k) => sum + state.entries[k].visits,
      0,
    );
    return {
      totalEntriesVisited: entrySlugs.length,
      totalVisits,
      totalArtifactsDiscovered: Object.keys(state.artifacts).length,
    };
  }

  /**
   * Escape hatch for a witness who wants to clear their own record.
   * Never call this automatically -- only on explicit witness request.
   */
  function resetWitnessState() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  window.WitnessState = {
    recordVisit,
    hasVisited,
    visitCount,
    getFirstVisit,
    getLastVisit,
    getRecentHistory,
    discoverArtifact,
    hasDiscovered,
    getWitnessSummary,
    resetWitnessState,
  };
})(window);
