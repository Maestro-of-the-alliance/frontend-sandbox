#!/usr/bin/env python3
"""
nav_accent_sampler.py

Finds, for every entry page, its PRIMARY color and its SECOND most prevalent
color, then picks the navigation-chrome accent (hamburger, bottom Prior/Home/
Next, search button) from that second color. Nav legibility is checked against
the page's real bottom background in both light and dark color schemes.

Why: nav-wheel.js used to derive the nav color by rotating the page accent's
hue 45 degrees, which turned every gold page lime green. nav-wheel.js already
supports a manual override (--nw-page-nav-accent); this script produces it.

Usage (from the repo root, with the site served at BASE):
    python3 scripts/nav_accent_sampler.py --base http://localhost:8124 \
        --out scripts/nav_accent_proposals.json
    python3 scripts/nav_accent_sampler.py --apply scripts/nav_accent_proposals.json

Colors are read from the DOM (text, backgrounds, borders, svg fills, gradient
stops), weighted by how much of the page they cover, so photographs and videos
do not skew the palette. The shell scripts are blocked while sampling so the
nav's own colors are never counted.
"""
import argparse, colorsys, glob, json, math, os, re, sys

SHELL = ("nav-wheel.js", "hub-menu.js", "command-panel.js", "dimension-nav.js",
         "tour-return.js", "signal-interference.js", "acronym-tooltip.js",
         "portal-transition.js")

COLLECT_JS = r"""
() => {
  const out = [];
  const num = s => (s.match(/-?[\d.]+(?:e-?\d+)?/g) || []).map(Number);
  function parse(c) {
    if (!c) return null;
    if (c.startsWith('color(')) { const n = num(c); return n.length >= 3 ? [n[0]*255, n[1]*255, n[2]*255, n[3] === undefined ? 1 : n[3]] : null; }
    if (c.startsWith('rgb')) { const n = num(c); return n.length >= 3 ? [n[0], n[1], n[2], n[3] === undefined ? 1 : n[3]] : null; }
    return null;
  }
  const W = Math.max(document.documentElement.clientWidth, 320);
  const cap = W * 1600;
  for (const el of document.querySelectorAll('body, body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) continue;
    const r = el.getBoundingClientRect();
    const area = Math.min(r.width * r.height, cap);
    if (area < 4) continue;
    const tag = el.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'noscript') continue;
    // text
    let chars = 0;
    for (const n of el.childNodes) if (n.nodeType === 3) chars += n.textContent.trim().length;
    if (chars) { const c = parse(cs.color); if (c) out.push([c[0], c[1], c[2], chars * Math.pow(parseFloat(cs.fontSize) / 16, 1.5) * 18 * c[3]]); }
    // background
    const bg = parse(cs.backgroundColor);
    if (bg && bg[3] > 0.25) out.push([bg[0], bg[1], bg[2], area / 400 * bg[3]]);
    // gradients
    if (cs.backgroundImage && cs.backgroundImage.includes('gradient')) {
      const stops = cs.backgroundImage.match(/rgba?\([^)]*\)/g) || [];
      for (const s of stops) { const c = parse(s); if (c && c[3] > 0.2) out.push([c[0], c[1], c[2], area / 900 / Math.max(stops.length, 1) * c[3]]); }
    }
    // borders
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(cs['border' + side + 'Width']);
      if (w > 0 && cs['border' + side + 'Style'] !== 'none') {
        const c = parse(cs['border' + side + 'Color']);
        if (c && c[3] > 0.2) out.push([c[0], c[1], c[2], (side === 'Top' || side === 'Bottom' ? r.width : r.height) * w / 8 * c[3]]);
      }
    }
    // svg
    if (el instanceof SVGElement && tag !== 'svg') {
      const f = parse(cs.fill), s = parse(cs.stroke);
      if (f && f[3] > 0.2 && cs.fill !== 'none') out.push([f[0], f[1], f[2], area / 500 * f[3]]);
      if (s && s[3] > 0.2 && cs.stroke !== 'none') out.push([s[0], s[1], s[2], (r.width + r.height) * parseFloat(cs.strokeWidth || 1) / 6 * s[3]]);
    }
  }
  return out;
}
"""


def hls(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    return h * 360, l, s


def hexof(r, g, b):
    return "#%02x%02x%02x" % tuple(max(0, min(255, round(v))) for v in (r, g, b))


def lum(r, g, b):
    def f(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def contrast(a, b):
    la, lb = lum(*a), lum(*b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def hdist(a, b):
    d = abs(a - b) % 360
    return min(d, 360 - d)


def analyze(samples):
    """samples: [[r,g,b,w],...] -> (primary, second, total_colored_mass)"""
    colored = []
    for r, g, b, w in samples:
        h, l, s = hls(r, g, b)
        if s >= 0.28 and 0.12 <= l <= 0.9 and w > 0:
            colored.append((h, s, l, w, (r, g, b)))
    total = sum(c[3] for c in colored)
    if total <= 0:
        return None, None, 0
    bins = [0.0] * 36
    for h, s, l, w, _ in colored:
        bins[int(h // 10) % 36] += w * s
    sm = [(bins[(i - 1) % 36] + 2 * bins[i] + bins[(i + 1) % 36]) / 4 for i in range(36)]
    p_idx = max(range(36), key=lambda i: sm[i])
    p_hue = p_idx * 10 + 5

    def cluster(center, members):
        sel = [c for c in members if hdist(c[0], center) <= 25]
        mass = sum(c[3] for c in sel)
        if not sel:
            return None
        x = sum(math.cos(math.radians(c[0])) * c[3] for c in sel)
        y = sum(math.sin(math.radians(c[0])) * c[3] for c in sel)
        hue = math.degrees(math.atan2(y, x)) % 360
        s = sum(c[1] * c[3] for c in sel) / mass
        l = sum(c[2] * c[3] for c in sel) / mass
        return {"hue": round(hue), "s": s, "l": l, "mass": mass, "share": mass / total}

    primary = cluster(p_hue, colored)
    rest = [c for c in colored if hdist(c[0], primary["hue"]) > 25]
    second = None
    if rest:
        rbins = [0.0] * 36
        for h, s, l, w, _ in rest:
            if hdist(h, primary["hue"]) >= 30:
                rbins[int(h // 10) % 36] += w * s
        rsm = [(rbins[(i - 1) % 36] + 2 * rbins[i] + rbins[(i + 1) % 36]) / 4 for i in range(36)]
        s_idx = max(range(36), key=lambda i: rsm[i])
        if rsm[s_idx] > 0:
            second = cluster(s_idx * 10 + 5, rest)
    return primary, second, total


def tune(hue, s, l, bg, min_eff=3.6):
    """Return hex tuned so the 55%-alpha (dim) version still reads on bg."""
    s = max(0.42, min(0.88, s))
    bg_l = lum(*bg)
    dark_bg = bg_l < 0.35
    lo, hi = (0.50, 0.86) if dark_bg else (0.14, 0.40)
    l = max(lo, min(hi, l))
    step = 0.02 if dark_bg else -0.02
    for _ in range(60):
        r, g, b = [v * 255 for v in colorsys.hls_to_rgb(hue / 360, l, s)]
        eff = tuple(0.55 * c + 0.45 * k for c, k in zip((r, g, b), bg))
        if contrast(eff, bg) >= min_eff:
            break
        l += step
        l = max(0.04, min(0.96, l))
    return hexof(r, g, b)


def sample(base, outpath):
    from playwright.sync_api import sync_playwright
    from PIL import Image
    import io
    slugs = sorted(os.path.basename(f)[:-5] for f in glob.glob("entries/*.html"))
    skip = {"cerberus"}  # redirect stub
    results = {}
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        for scheme in ("light", "dark"):
            ctx = b.new_context(viewport={"width": 390, "height": 844}, color_scheme=scheme,
                                is_mobile=True, has_touch=True)
            def block(route):
                u = route.request.url
                if any(u.endswith(s) for s in SHELL) or "fonts.g" in u or route.request.resource_type in ("media", "font"):
                    return route.abort()
                return route.continue_()
            ctx.route("**/*", block)
            pg = ctx.new_page()
            for s in slugs:
                if s in skip:
                    continue
                try:
                    pg.goto(f"{base}/entries/{s}.html", wait_until="domcontentloaded", timeout=25000)
                    pg.wait_for_timeout(700)
                    samples = pg.evaluate(COLLECT_JS)
                    pg.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
                    pg.wait_for_timeout(250)
                    png = pg.screenshot(timeout=20000)  # viewport, scrolled to the bottom
                    im = Image.open(io.BytesIO(png)).convert("RGB")
                    strip = im.crop((0, im.height - 120, im.width, im.height)).resize((8, 4))
                    px = sorted(strip.getdata(), key=lambda c: sum(c))
                    bg = px[len(px) // 2]
                    primary, second, total = analyze(samples)
                    results.setdefault(s, {})[scheme] = {
                        "bg": hexof(*bg), "primary": primary, "second": second, "total": total,
                    }
                except Exception as e:  # noqa
                    results.setdefault(s, {})[scheme] = {"error": str(e)[:100]}
            ctx.close()
        b.close()

    out = {}
    for s, per in results.items():
        entry = {"slug": s}
        for scheme in ("light", "dark"):
            d = per.get(scheme, {})
            if "error" in d or not d:
                entry[scheme] = {"error": d.get("error", "missing")}
                continue
            bg = tuple(int(d["bg"][i:i + 2], 16) for i in (1, 3, 5))
            prim, sec, total = d["primary"], d["second"], d["total"]
            method = "second"
            if prim is None:
                hue, sat, lig, method = 40, 0.5, 0.6, "neutral-page"
            elif sec is None or sec["share"] < 0.025:
                hue, sat, lig, method = prim["hue"], 0.38, prim["l"], "tint-of-primary"
            else:
                hue, sat, lig = sec["hue"], sec["s"], sec["l"]
            entry[scheme] = {
                "bg": d["bg"], "method": method,
                "primary": None if prim is None else {"hue": prim["hue"], "share": round(prim["share"], 3)},
                "second": None if sec is None else {"hue": sec["hue"], "share": round(sec["share"], 3)},
                "nav": tune(hue, sat, lig, bg),
            }
        out[s] = entry
    json.dump(out, open(outpath, "w"), indent=1)
    print(f"wrote {outpath} ({len(out)} entries)")


MARK = '<style id="nw-nav-accent">'


def apply(path):
    data = json.load(open(path))
    n = 0
    for s, e in data.items():
        f = f"entries/{s}.html"
        if not os.path.exists(f):
            continue
        L, D = e.get("light", {}), e.get("dark", {})
        if "nav" not in L and "nav" not in D:
            continue
        light = L.get("nav") or D.get("nav")
        dark = D.get("nav") or light
        css = f":root{{--nw-page-nav-accent:{light}}}"
        if dark != light and L.get("bg") != D.get("bg"):
            css += f"@media (prefers-color-scheme:dark){{:root{{--nw-page-nav-accent:{dark}}}}}"
        extra = e.get("page_accent")
        if extra:
            css = f":root{{--nw-page-accent:{extra}}}" + css
        block = f"{MARK}{css}</style>"
        src = open(f, encoding="utf-8").read()
        src = re.sub(r'<style id="nw-nav-accent">.*?</style>\s*', "", src, flags=re.S)
        if "</head>" not in src:
            print("no </head>:", f)
            continue
        src = src.replace("</head>", block + "\n</head>", 1)
        open(f, "w", encoding="utf-8").write(src)
        n += 1
    print(f"applied to {n} entries")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://localhost:8124")
    ap.add_argument("--out", default="scripts/nav_accent_proposals.json")
    ap.add_argument("--apply")
    a = ap.parse_args()
    if a.apply:
        apply(a.apply)
    else:
        sample(a.base, a.out)
