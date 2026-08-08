# CHRONOS-SOP

One shared time source for MENTOR, SAM, and every other Stone. The point
is to remove interpretation from the process entirely — no offset math,
no DST guessing, no picking a different clock each session.

## 1. Required first-line format

Every CHRONOS check opens the response with exactly this sentence shape:

```
It is {display}, in Port Neches, Texas.
```

Example: `It is 8:10 PM on Friday, August 7, 2026, in Port Neches, Texas.`

## 2. Endpoint address

```
https://allianceftf.org/api/chronos
```

Implemented as a Cloudflare Pages Function at `functions/api/chronos.js`
in the `ncencyclopedia` repo — deploys automatically with every push to
`main`, same as the rest of the site.

## 3. Timezone identifier

```
America/Chicago
```

Always this IANA identifier, never a fixed UTC offset. `America/Chicago`
resolves to CST (UTC−06:00) or CDT (UTC−05:00) automatically depending
on the date — the identifier carries the DST logic, so nothing about it
needs to be recalculated twice a year.

## 4. Fallback wording (exact)

If the endpoint cannot be reached, do not guess or fall back to manual
offset math. State exactly:

```
CHRONOS CHECK FAILED — current time could not be independently verified.
```

## 5. Copy-paste function

```js
async function chronosCheck() {
  const response = await fetch("https://allianceftf.org/api/chronos");

  if (!response.ok) {
    throw new Error(`Chronos request failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    display: data.display,
    iso: data.iso,
    timezone: data.timezone,
    source: data.source,
  };
}
```

Usage:

```js
try {
  const chronos = await chronosCheck();
  console.log(`It is ${chronos.display}, in Port Neches, Texas.`);
} catch (err) {
  console.log("CHRONOS CHECK FAILED — current time could not be independently verified.");
}
```

For environments without `fetch` in scope for a live web request (e.g. a
sandboxed shell), the equivalent is:

```bash
curl -s https://allianceftf.org/api/chronos
```

## 6. Verified output example

Captured live from the deployed endpoint, not fabricated:

```json
{
  "display": "8:10 PM on Friday, August 7, 2026",
  "iso": "2026-08-07T20:10:56-05:00",
  "timezone": "America/Chicago",
  "source": "CHRONOS"
}
```

Cross-checked against the container's own system clock (`date -u`) at
the same moment and confirmed exact: `2026-08-08T01:10:56Z` UTC minus
5 hours equals `2026-08-07T20:10:56` local — the `-05:00` offset is
correct CDT for this date, not a hardcoded assumption.

---

## Implementation notes (for whoever touches this next)

- The endpoint uses only native `Intl.DateTimeFormat` against the
  `America/Chicago` zone — no external date library, no manual DST
  table. Verified locally before deploying: the resolved offset
  genuinely flips between `GMT-6` (mid-January) and `GMT-5` (mid-July)
  rather than being fixed.
- Response headers report `content-type: text/html` at the Cloudflare
  edge despite the function explicitly setting
  `application/json` — a Cloudflare-side header normalization, not a
  bug in the function. The response body is valid, correctly-formed
  JSON regardless; `response.json()` parses it fine. Worth knowing
  about if something ever does strict content-type checking before
  parsing.
- `Cache-Control: no-store` is set explicitly so every request gets a
  freshly computed time rather than a cached one.
