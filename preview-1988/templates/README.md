# Category templates: what is fixed, what is free

Each of the eight categories owns a world. An entry inherits the world and may vary inside it.

## Fixed per category (this is what makes an entry feel like it belongs)
- **Typeface pair** and **palette family** (see `worlds.css`, one block per category)
- **Living background** (`data-world` on `<html>`, drawn in `t.js`)
- **Page order at the top:** nav, title, pronunciation, name expansion, one-line banner, video overview, then content
- **Video overview slot** directly under the hero (`.vid`, set `data-yt` to the YouTube id)
- **Interference** from THE GRID (rare brief bursts on every page; heavier on ADVERSARY)

## Free per entry (set on `<html>` in the entry's page)
| Knob | Values | Effect |
|---|---|---|
| `data-hero` | `center`, `left`, `split` | Title alignment and layout |
| `data-mood` | `calm`, `vivid` | Background intensity |
| `data-density` | `roomy`, `tight` | Space between sections |
| `style="--acc:…;--accl:…;--acc-ink:…"` | any shade near the category hue | Entry-level accent shift |
| name expansion | `acr=("Acronym", "…")` or `("Portmanteau", "…")` | Shown under the pronunciation only when the entry has one |
| centerpiece | any module that fits the category | The one interactive section; swap or drop it per entry |
| sections | add, remove, reorder `.sec` blocks | Entries differ in length and shape |

## Centerpiece modules already built (reuse or remix)
- DOCTRINE: ring dial with sliders
- BEINGS: tap-through scene (chat)
- PLACE: lit-district city map
- INFRASTRUCTURE: device explorer with open/closed toggle
- PROTOCOLS: stepper with particle canvas
- COVENANT: trust slider with orbiting lights; flip cards
- CULTURE: tuning dial with static
- ADVERSARY: THE GRID scanner
