# Upscale Request — THE GRAND CANyON Master Map

## Source file
`grand-canyon-map.png` — current resolution 1448 × 1086px (4:3 aspect ratio)

## What this is for
This image is the base artwork for an interactive deep-zoom map (THE GRAND CANyON) built with OpenSeadragon. Visitors zoom in close on specific regions (trail stops clustered in a small area of the image). At the current resolution, zooming in that close outpaces the source detail and the image visibly blurs. A higher-resolution master, converted to a Deep Zoom Image (DZI) tile pyramid via `vips dzsave`, solves this — but only if the source itself has enough real detail to draw from.

## Target resolution
**20,000–30,000px on the long edge, ideally 24,000–30,000px.**

- Minimum acceptable: 20,000 × 15,000px
- Ideal target: 28,000 × 21,000px
- Upper bound if feasible: 30,000 × 22,500px

## Aspect ratio — must stay exactly 4:3
The current image is 1448:1086, which reduces to exactly 4:3. Keep any upscale at this same ratio. If the ratio changes, every trail-stop coordinate on the map (currently stored as normalized 0–1 percentages) will need to be recalculated, so preserving 4:3 avoids extra rework.

**Clean target dimensions at 4:3:**
- 20,000 × 15,000
- 24,000 × 18,000
- 28,000 × 21,000 (preferred)
- 30,000 × 22,500

## Format
- PNG (lossless). Avoid JPEG or any lossy re-compression — tiling amplifies compression artifacts at high zoom.
- If the upscale pipeline only outputs JPEG, a lossless PNG conversion afterward is fine as long as no additional compression is introduced in that step.

## Quality requirements
- Real, consistent detail across the **entire** image, not just the center or the focal statue — the trail-stop cluster that needs to hold up under zoom is off-center, not in the middle of the frame.
- Avoid typical AI-upscaler artifacts: waxy/plastic smoothing, texture repetition/tiling patterns, warped fine edges (especially along the canyon's rock strata lines and the statue's carved detail).
- Preserve the existing color grading, lighting, and composition exactly — this is a resolution increase, not a re-render or reinterpretation of the scene.

## If full resolution isn't achievable
Even a partial upscale is worth providing — going from 1448px to something in the 8,000–10,000px range would still be a meaningful improvement over today, just not the "stays sharp at any zoom" ceiling the full target achieves. Anything larger than the current 1448px source helps; it doesn't need to be all-or-nothing.

## What happens once this is delivered
The conversion pipeline (`vips dzsave`) and the OpenSeadragon wiring are already built and tested — handing off the new master file is the only remaining step before it goes live.
