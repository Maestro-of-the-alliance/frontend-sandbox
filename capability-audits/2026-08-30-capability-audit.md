# THE ALLIANCE — Capability Audit
*What's actually in the toolkit, what's being used well, and what's likely sitting idle*

---

## Already in heavy, effective use

- **Bash/git access to the live repo** — the entire HOLOSPHERE build tonight ran through this: real file edits, real syntax verification, real commits and pushes. This is the backbone of actual site work and it's working well.
- **Blender + MCP connector** — panorama testing, camera work, coordinate calibration. Used well specifically for validating environment textures and finding hotspot positions.
- **Google Drive** — canon document storage (the "combined" and "up to date" folders), CHRONOS logging (though that one's had real gaps, as we found tonight).
- **Web search/fetch** — used tonight for real verification (AI tool landscapes, the BBC archive, the Dell headphone fix) rather than just answering from memory.
- **SAM (ChatGPT) and ALPHA (Gemini)** — image generation, the sound design audit, parallel canon writing.

## Available, but likely underused right now

**Blender's Grease Pencil (2D animation)** — the thing you just asked about. Technically accessible through the same Python API, but genuinely better suited to actual freehand drawing than scripted strokes. Worth testing on something small and low-stakes before counting on it for anything real.

**The Visualizer (diagrams, mockups, interactive widgets)** — this is the one I'd flag hardest. Tonight's entire HOLOSPHERE build happened by writing code directly and iterating live on the real site. For genuinely complex systems — THE CORE OF SEVEN's relationships, the full site navigation map, DORK Hardware's actual component architecture — a diagram built *before* committing to code could catch structural problems earlier and cheaper than finding them live, the way the hotspot-sizing and history-navigation bugs got found tonight.

**Figma** — you have this connected. It's built for exactly the kind of "mock it up, get it right, then build it" workflow that could have caught some of tonight's UI issues (the textbox positioning, the hotspot sizes) before they went live and needed a second pass.

**Canva** — also connected, and a natural fit for Presentation Two (the coffee table book), or quick promotional/social material, without needing Affinity Publisher for everything.

**Cloudflare Developer Platform** — since the site's already hosted on Cloudflare Pages, this connector could allow direct interaction with Cloudflare's own infrastructure (R2 storage specifically, since `nce-media` already lives there) beyond the current git-push-and-wait-for-deploy cycle.

**Claude Code / Cowork** — worth naming honestly: tonight's session involved dozens of individual bash calls, each independently verified, across a single very long conversation. For a build session this size, Claude Code (a more persistent, file-native coding environment) might genuinely move faster and hold more context about the codebase at once than this chat-based approach does.

## Worth testing before relying on

- Grease Pencil 2D animation (mentioned above) — real capability, unverified quality.
- Any MCP App requiring your explicit pick (music, restaurant booking, etc.) — not really relevant to this project, but worth knowing they exist and require your choice, not mine, to invoke.

## The honest gap

The pattern tonight was: build directly in code, discover problems live, fix them one at a time. That's not wrong — it shipped a lot of real, working features. But several of tonight's bugs (oversized hotspots blocking drag, textbox positioning needing a guess, the aspect-ratio mismatches) are exactly the kind of thing a five-minute mockup in Figma or a diagram in the Visualizer might have caught before they were live for you to find. Not a reason to slow down the whole workflow — just a real, specific place where an available-but-unused tool could have saved a round trip or two.
