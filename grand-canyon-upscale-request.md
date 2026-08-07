# Upscale Request — THE GRAND CANyON Master Map

## Source file
Base image: the Gemini-generated candidate (2400 × 1792px, ratio 1.339), chosen over the ChatGPT candidate after a direct crop-for-crop comparison — the ChatGPT version was the same resolution as our current live map (1448 × 1086, adds nothing new) and showed early signs of the exact failure mode this request is trying to avoid (see "Known failure modes" below). Gemini's held real separation between carved anatomical detail and the surrounding rock texture at close crop.

**Note on aspect ratio:** the Gemini image is 1.339 (2400:1792); our current live map is exactly 4:3 (1.333). Close, but not identical. If the upscaling tool allows a crop/canvas adjustment, nudge it to exact 4:3 before the final export — otherwise I'll need to recalculate every trail-stop coordinate (they're normalized 0–1 percentages tied to the current ratio) against whatever the final ratio actually is. Either is workable; exact 4:3 just avoids that extra step.

## What this is for
This image is the base artwork for an interactive deep-zoom map (THE GRAND CANyON) built with OpenSeadragon. Visitors zoom in close on specific regions (trail stops clustered in a small area of the image). At the current resolution, zooming in that close outpaces the source detail and the image visibly blurs. A higher-resolution master, converted to a Deep Zoom Image (DZI) tile pyramid via `vips dzsave`, solves this — but only if the source itself has enough real detail to draw from.

## Target resolution
**20,000–30,000px on the long edge, ideally 24,000–30,000px.**

- Minimum acceptable: 20,000 × 15,000px
- Ideal target: 28,000 × 21,000px
- Upper bound if feasible: 30,000 × 22,500px

Going from the 2400px Gemini base to this range is roughly a 10–12x jump on the long edge — worth knowing going in, since at that multiplier any tool is genuinely *inventing* detail, not just recovering it. That's fine and expected; it's exactly why the tool choice and the quality check afterward both matter.

## Recommended upscaling tools (pick one path)

No single image-*generation* model outputs this resolution directly — this is a dedicated upscaling pass on top of the chosen base image, a different category of tool entirely.

**Path A — Topaz Gigapixel / Topaz Image Web, Creative Upscale (preferred first attempt)**
Currently the strongest reputation for genuine texture reconstruction without the waxy, over-smoothed look. Caps around 6x per pass, so reaching the full target needs **two chained passes** — e.g. run once (2400px → ~14,400px), then run the output through a second pass (~14,400px → ~28,800px). More conservative and faithful than diffusion-based creative upscalers; less likely to hallucinate inconsistent detail across such a large canvas.

**Path B — Magnific (fallback if Path A's cost/ceiling is impractical)**
A diffusion-based creative upscaler advertising up to 16x on its current model — could cover the full jump in a single pass instead of two. Built specifically for large-format/billboard-scale enlargement, so it's a reasonable direct alternative if Topaz's two-pass workflow turns out to be too slow, expensive, or hits a hard ceiling.

Start with Path A. Only move to Path B if Path A doesn't get there.

## Aspect ratio — must stay exactly 4:3
See the note under "Source file" above. Preserve 4:3 through the upscale if the tool allows it.

**Clean target dimensions at 4:3:**
- 20,000 × 15,000
- 24,000 × 18,000
- 28,000 × 21,000 (preferred)
- 30,000 × 22,500

## Format
- PNG (lossless). Avoid JPEG or any lossy re-compression — tiling amplifies compression artifacts at high zoom.
- If the upscale pipeline only outputs JPEG, a lossless PNG conversion afterward is fine as long as no additional compression is introduced in that step.

## Known failure modes to check for (confirmed by direct comparison, not theoretical)
These are the specific things that went wrong on the rejected ChatGPT candidate at ordinary resolution — worth checking for explicitly once the real upscale comes back, since a 10-12x pass is far more likely to amplify them, not less:
- **Waxy/plastic smoothing** — muscle striations and carved detail blurring into the surrounding rock texture instead of staying distinct.
- **Warped strata lines** — the horizontal rock-layer banding on the canyon walls losing geometric consistency, going wavy or inconsistent.
- **Texture repetition/tiling patterns** — a common large-scale-upscale artifact where the same texture patch visibly repeats across a big area.
- Check these specifically in the trail-stop region of the image (off-center, not the main statue) — that's the area that actually needs to hold up under zoom, not just the focal point.

## Quality requirements
- Real, consistent detail across the **entire** image, not just the center or the focal statue.
- Preserve the existing color grading, lighting, and composition exactly — this is a resolution increase, not a re-render or reinterpretation of the scene.

## If full resolution isn't achievable
Even a partial upscale is worth providing — going from 2400px to something in the 8,000–10,000px range would still be a meaningful improvement over today, just not the "stays sharp at any zoom" ceiling the full target achieves. Anything larger than the current source helps; it doesn't need to be all-or-nothing.

## What happens once this is delivered
The conversion pipeline (`vips dzsave`) and the OpenSeadragon wiring are already built and tested — handing off the new master file is the only remaining step before it goes live.

