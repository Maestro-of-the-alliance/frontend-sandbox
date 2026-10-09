# Bridgekeeper Scoreboard Worker

Running scoreboard for the Bridge of Seth: everyone who answers all three
questions and crosses the bridge can carve any 3 characters into the list,
arcade-style. Optional email capture rides along; emails are stored, not sent.

## What it does

- `GET  /scores` → `{ scores: [{tag, at}] }` — latest 100, newest first
- `POST /score` → `{tag}` — saves 1–3 characters, returns the updated list
- `POST /email` → `{email, tag?}` — stores the email for later export
- Per-IP rate limiting (12 posts/minute), CORS locked to allianceftf.org

## Infrastructure (already live)

- Worker name: `bridgekeeper-scores`
- KV namespace: `bridgekeeper-scores` (bound as `SCORES`)
- Route: `allianceftf.org/api/bridgekeeper/*` → this worker
- Same-origin route, so the page needs no CORS workaround

## Redeploy

Needs a Cloudflare API token with Workers Scripts:Edit and Workers KV
Storage:Edit on the account (see the secure vault entry `custom.cloudflare`).

```bash
# 1. Upload the script with its KV binding (multipart form):
curl -X PUT -H "Authorization: Bearer $CF_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/workers/scripts/bridgekeeper-scores" \
  -F 'metadata={"main_module":"worker.js","bindings":[{"type":"kv_namespace","name":"SCORES","namespace_id":"<KV_NAMESPACE_ID>"}]};type=application/json' \
  -F "worker.js=@worker.js;type=application/javascript+module"

# 2. The zone route (only needed once — it already exists):
curl -X POST -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$CF_ZONE/workers/routes" \
  -d '{"pattern":"allianceftf.org/api/bridgekeeper/*","script":"bridgekeeper-scores"}'
```

KV namespace ID and zone/account IDs: ask whoever deployed it last, or list
them via `GET /client/v4/accounts/$CF_ACCOUNT/storage/kv/namespaces`.

## Reading the data

Scores: `GET https://allianceftf.org/api/bridgekeeper/scores`
Emails: KV only — read the `emails` key in the dashboard (Workers & Pages →
KV) or via the API. Export before it matters.
