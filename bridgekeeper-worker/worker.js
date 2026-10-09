// BRIDGEKEEPER SCOREBOARD
// Running list of everyone who crossed the bridge, plus optional emails.
// KV binding: SCORES -> namespace "bridgekeeper-scores"
// Served at: https://allianceftf.org/api/bridgekeeper/* (Workers Route)
//
//   GET  /scores  -> { scores: [{tag, at}] }            (latest 100)
//   POST /score   -> {tag} -> { ok:true, scores }       (1-3 chars, anything)
//   POST /email   -> {email, tag?} -> { ok:true }
//
// CORS: allianceftf.org only. Light per-IP rate limiting; this is a
// low-traffic page, not Fort Knox.

const ALLOWED_ORIGINS = [
  "https://allianceftf.org",
  "https://www.allianceftf.org",
];
const MAX_SCORES = 500;   // kept in KV
const RETURN_SCORES = 100; // sent to the page
const RATE_LIMIT_N = 12;  // posts per window per IP
const RATE_LIMIT_WINDOW_S = 60;

function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign(
      { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
      cors(origin)
    ),
  });
}

function cleanTag(raw) {
  if (typeof raw !== "string") return null;
  // arcade rules: any 3 characters, but strip control chars and markup
  let t = raw.replace(/[\x00-\x1f\x7f<>\"'&]/g, "").trim().slice(0, 3);
  return t.length >= 1 ? t : null;
}

function cleanEmail(raw) {
  if (typeof raw !== "string") return null;
  const e = raw.trim().slice(0, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : null;
}

async function checkRate(env, ip) {
  const key = "rl:" + ip;
  const now = Date.now();
  let rec = await env.SCORES.get(key, "json");
  if (!rec || now - rec.start > RATE_LIMIT_WINDOW_S * 1000) {
    rec = { n: 1, start: now };
  } else {
    rec.n += 1;
  }
  await env.SCORES.put(key, JSON.stringify(rec), { expirationTtl: RATE_LIMIT_WINDOW_S + 10 });
  return rec.n <= RATE_LIMIT_N;
}

async function getScores(env) {
  return (await env.SCORES.get("scores", "json")) || [];
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin") || "";
    // served behind allianceftf.org/api/bridgekeeper/* — strip the prefix
    const path = url.pathname.replace(/^\/api\/bridgekeeper/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method === "GET" && path === "/scores") {
      const scores = await getScores(env);
      return json({ scores: scores.slice(-RETURN_SCORES).reverse() }, 200, origin);
    }

    if (request.method === "POST" && (path === "/score" || path === "/email")) {
      const ip = request.headers.get("cf-connecting-ip") || "unknown";
      if (!(await checkRate(env, ip))) {
        return json({ ok: false, error: "slow down" }, 429, origin);
      }
      let body = {};
      try { body = await request.json(); } catch (e) { /* fall through */ }

      if (path === "/score") {
        const tag = cleanTag(body.tag);
        if (!tag) return json({ ok: false, error: "need 1-3 characters" }, 400, origin);
        const scores = await getScores(env);
        scores.push({ tag, at: new Date().toISOString() });
        await env.SCORES.put("scores", JSON.stringify(scores.slice(-MAX_SCORES)));
        return json({ ok: true, scores: scores.slice(-RETURN_SCORES).reverse() }, 200, origin);
      }

      // /email — optional, stored for Dave to export later
      const email = cleanEmail(body.email);
      if (!email) return json({ ok: false, error: "that email doesn't look right" }, 400, origin);
      const emails = (await env.SCORES.get("emails", "json")) || [];
      emails.push({ email, tag: cleanTag(body.tag) || null, at: new Date().toISOString() });
      await env.SCORES.put("emails", JSON.stringify(emails.slice(-MAX_SCORES)));
      return json({ ok: true }, 200, origin);
    }

    return json({ ok: false, error: "not found" }, 404, origin);
  },
};
