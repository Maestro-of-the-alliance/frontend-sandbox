# THE SYSTEM — deploy notes

This folder is the real, editable source (React + Three.js + Vite).

**This is NOT what's served live.** The live site reads from `/the-system/` at
the repo root, which is the *built output* of this source — same pattern as
`/ccm-assessment/`. Cloudflare Pages serves the whole repo as static files
with no build step of its own, so every time this source changes, the build
has to be run manually and the output copied over.

## To make a change and redeploy

```bash
cd the-system-src
npm install
npx vite build --base=/the-system/
# copy the build output over the live folder:
cp -r dist/* ../the-system/
cd ..
git add the-system/ the-system-src/
git commit -m "update THE SYSTEM"
git push
```

The `--base=/the-system/` flag is required — without it, asset paths break
once deployed (they resolve to domain root instead of `/the-system/`).

Two spots in the code intentionally read the base path at runtime instead of
hardcoding it, so they work whether this is served from `/` (local dev) or
`/the-system/` (deployed): the medallion texture load in
`SolarSystemCanvas.tsx` and the entry symbol image in `EntryViewer.tsx`. Both
use `import.meta.env.BASE_URL`. If either gets changed back to a hardcoded
`/avpi.png`-style path, the medallion or symbol badges will silently 404 in
production while still working fine in local dev — that mismatch is exactly
what happened before this was documented.
