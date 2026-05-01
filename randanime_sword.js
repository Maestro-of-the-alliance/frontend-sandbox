// ══════════════════════════════════════════════════════
//  RANDANIME SWORD ENGINE — 25 ANIMATION VARIANTS
//  Unauthorized transmission. Signal unstable.
//  Every visit is different. That's the point.
// ══════════════════════════════════════════════════════

(function() {

const RANDANIME_CSS = `

/* ═══════════════════════════════════
   TIER 1 — MINISCULE (barely there)
═══════════════════════════════════ */

.ra-breathe {
  animation: raBreathe 8s ease-in-out infinite;
}
@keyframes raBreathe {
  0%,100% { letter-spacing: 0em; opacity: 1; }
  50% { letter-spacing: 0.02em; opacity: 0.92; }
}

.ra-ghost {
  animation: raGhost 6s ease infinite;
}
@keyframes raGhost {
  0%,90%,100% { text-shadow: none; }
  91% { text-shadow: 1px 0 rgba(0,212,255,0.4), -1px 0 rgba(255,0,51,0.3); }
  93% { text-shadow: none; }
  95% { text-shadow: 2px 0 rgba(0,212,255,0.2); }
}

.ra-drift {
  animation: raDrift 10s ease-in-out infinite;
}
@keyframes raDrift {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(1px); }
  75% { transform: translateX(-1px); }
}

.ra-dim {
  animation: raDim 7s ease infinite;
}
@keyframes raDim {
  0%,80%,100% { opacity: 1; }
  85% { opacity: 0.7; }
  90% { opacity: 1; }
  93% { opacity: 0.85; }
}

.ra-pixel-shift {
  animation: raPixelShift 9s steps(1) infinite;
}
@keyframes raPixelShift {
  0%,94%,100% { transform: translate(0,0); }
  95% { transform: translate(2px, -1px); }
  96% { transform: translate(-1px, 1px); }
  97% { transform: translate(1px, 0); }
  98% { transform: translate(0,0); }
}


/* ═══════════════════════════════════
   TIER 2 — MINOR (subtle but real)
═══════════════════════════════════ */

.ra-flicker {
  animation: raFlicker 5s ease infinite;
}
@keyframes raFlicker {
  0%,85%,89%,93%,100% { opacity:1; }
  86% { opacity:0.3; transform:skewX(-3deg); }
  87% { opacity:1; }
  88% { opacity:0.6; }
  90% { opacity:0.15; transform:skewX(2deg); }
  91% { opacity:1; }
}

.ra-chroma-soft {
  animation: raChromaSoft 4s ease infinite;
}
@keyframes raChromaSoft {
  0%,80%,100% { text-shadow: none; }
  82% { text-shadow: 2px 0 rgba(255,0,51,0.35), -2px 0 rgba(0,212,255,0.35); }
  85% { text-shadow: none; }
  88% { text-shadow: -1px 0 rgba(255,0,51,0.2), 1px 0 rgba(0,212,255,0.2); }
}

.ra-scan-line {
  position: relative;
  overflow: hidden;
}
.ra-scan-line::after {
  content: '';
  position: absolute;
  left: 0; right: 0; height: 2px;
  background: rgba(0,212,255,0.15);
  animation: raScanLine 3s linear infinite;
  pointer-events: none;
}
@keyframes raScanLine {
  0% { top: -2px; }
  100% { top: 110%; }
}

.ra-weight-pulse {
  animation: raWeightPulse 6s ease-in-out infinite;
}
@keyframes raWeightPulse {
  0%,100% { font-weight: 900; }
  50% { font-weight: 700; opacity: 0.88; }
}

.ra-hue-rotate {
  animation: raHueRotate 8s linear infinite;
}
@keyframes raHueRotate {
  0% { filter: hue-rotate(0deg) brightness(1); }
  25% { filter: hue-rotate(15deg) brightness(1.05); }
  50% { filter: hue-rotate(0deg) brightness(1); }
  75% { filter: hue-rotate(-10deg) brightness(0.95); }
  100% { filter: hue-rotate(0deg) brightness(1); }
}


/* ═══════════════════════════════════
   TIER 3 — MODERATE (you notice it)
═══════════════════════════════════ */

.ra-slide-in {
  animation: raSlideIn 0.9s cubic-bezier(0.2,0.8,0.2,1) both;
}
@keyframes raSlideIn {
  0% { transform:translateX(-60px); filter:blur(12px); opacity:0; text-shadow:-8px 0 #ff0033; }
  45% { transform:translateX(10px); filter:blur(2px); text-shadow:8px 0 #00e5ff; }
  100% { transform:translateX(0); filter:blur(0); opacity:1; text-shadow:none; }
}

.ra-tear-focus {
  animation: raTearFocus 1s ease-out both;
}
@keyframes raTearFocus {
  0% { letter-spacing: 0.8em; filter:blur(8px); opacity:0; color: #ff0033; }
  40% { color: #00e5ff; letter-spacing: 0.1em; }
  70% { letter-spacing: -0.05em; }
  100% { letter-spacing: 0; filter:blur(0); opacity:1; color:inherit; }
}

.ra-chroma-hard {
  animation: raChromaHard 5s ease infinite;
}
@keyframes raChromaHard {
  0%,82%,88%,100% { text-shadow: 2px 2px 0 rgba(0,212,255,0.25); }
  83% { text-shadow: -5px 0 rgba(255,0,51,0.7), 5px 0 rgba(0,212,255,0.7); transform: skewX(-2deg); }
  84% { text-shadow: 3px 0 rgba(255,0,51,0.5), -3px 0 rgba(0,212,255,0.5); }
  85% { text-shadow: 2px 2px 0 rgba(0,212,255,0.25); transform: skewX(0); }
  86% { text-shadow: -4px 0 rgba(255,0,51,0.4), 4px 0 rgba(0,212,255,0.4); }
}

.ra-stamp {
  animation: raStamp 0.7s cubic-bezier(0.3,0,0.1,1.4) both;
}
@keyframes raStamp {
  0% { transform: scale(1.4); opacity:0; filter: blur(4px); }
  60% { transform: scale(0.95); opacity:1; filter: blur(0); }
  80% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.ra-static-entry {
  animation: raStaticEntry 0.6s steps(8) both;
}
@keyframes raStaticEntry {
  0% { opacity:0; filter: contrast(500%) brightness(2); transform: scale(1.05) skewX(-5deg); }
  25% { opacity:0.7; filter: contrast(200%); }
  50% { opacity:0.3; transform: scale(1.02) skewX(2deg); }
  75% { opacity:0.9; filter: contrast(120%); }
  100% { opacity:1; filter: none; transform: scale(1) skewX(0); }
}


/* ═══════════════════════════════════
   TIER 4 — MAJOR (commanding)
═══════════════════════════════════ */

.ra-burn {
  animation: raBurn 1.4s ease-out forwards;
}
@keyframes raBurn {
  0% { color:#fff; text-shadow:0 0 50px #ff0033,0 0 100px #ff0033; transform:scale(1.08); filter:brightness(3); }
  30% { color:#ffaa00; text-shadow:0 0 30px #ffaa00; filter:brightness(1.8); transform:scale(1.02); }
  60% { color:#fff; text-shadow:0 0 15px rgba(255,255,255,0.5); filter:brightness(1.2); }
  100% { color:inherit; text-shadow:inherit; transform:scale(1); filter:none; }
}

.ra-glitch-shake {
  animation: raGlitchShake 0.5s ease-in-out both;
}
@keyframes raGlitchShake {
  0%,100% { transform:translate(0,0) skewX(0); }
  10% { transform:translate(-8px,2px) skewX(-3deg); text-shadow:-4px 0 #ff0033, 4px 0 #00e5ff; }
  20% { transform:translate(10px,-3px) skewX(2deg); }
  30% { transform:translate(-6px,4px) skewX(-2deg); text-shadow:4px 0 #ff0033, -4px 0 #00e5ff; }
  40% { transform:translate(8px,-2px) skewX(3deg); }
  50% { transform:translate(-4px,3px) skewX(-1deg); }
  60% { transform:translate(6px,-4px) skewX(2deg); text-shadow:-2px 0 #ff0033, 2px 0 #00e5ff; }
  70% { transform:translate(-3px,2px) skewX(0); }
  80% { transform:translate(4px,-1px); }
  90% { transform:translate(-1px,2px); }
}

.ra-signal-break {
  animation: raSignalBreak 3s ease infinite;
}
@keyframes raSignalBreak {
  0%,70%,100% { clip-path: none; transform:none; }
  72% { clip-path: inset(30% 0 40% 0); transform: translateX(-8px); }
  73% { clip-path: inset(60% 0 10% 0); transform: translateX(6px); }
  74% { clip-path: inset(10% 0 70% 0); transform: translateX(-4px); }
  75% { clip-path: none; transform: none; }
  77% { clip-path: inset(45% 0 30% 0); transform: translateX(5px); }
  78% { clip-path: none; transform: none; }
}

.ra-noise-resolve {
  animation: raNoiseResolve 1.2s steps(6) both;
}
@keyframes raNoiseResolve {
  0% { filter: url(#noise) contrast(200%) brightness(0.5); opacity:0.3; transform: scale(1.1) skewX(-4deg); }
  20% { filter: contrast(150%) brightness(0.8); opacity:0.6; transform: scale(1.05) skewX(2deg); }
  40% { filter: contrast(120%) brightness(1); opacity:0.8; transform: scale(1.02); }
  60% { filter: contrast(110%); opacity:0.9; transform: scale(1.01); }
  80% { filter: contrast(105%); opacity:0.95; }
  100% { filter: none; opacity:1; transform: scale(1) skewX(0); }
}


/* ═══════════════════════════════════
   TIER 5 — MASSIVE (violent)
═══════════════════════════════════ */

.ra-meltdown {
  animation: raMeltdown 1.8s ease-out forwards;
}
@keyframes raMeltdown {
  0% { transform:scale(1.2) skewX(-8deg); color:#fff; text-shadow:0 0 80px #ff0033,0 0 40px #ffaa00,-8px 0 #ff0033,8px 0 #00e5ff; filter:brightness(4) contrast(2); opacity:0.5; }
  10% { transform:scale(0.9) skewX(5deg); opacity:1; filter:brightness(3); }
  15% { transform:scale(1.15) skewX(-6deg) translateX(-10px); text-shadow:-12px 0 #ff0033,12px 0 #00e5ff; }
  20% { transform:scale(0.95) skewX(3deg) translateX(8px); filter:brightness(2); }
  25% { transform:scale(1.08) skewX(-4deg); text-shadow:0 0 40px #ffaa00; }
  35% { transform:scale(1.02) skewX(2deg); filter:brightness(1.5); color:#ffaa00; }
  50% { transform:scale(1) skewX(-1deg); color:#fff; text-shadow:0 0 20px rgba(255,170,0,0.5); filter:brightness(1.2); }
  70% { transform:scale(1.01) skewX(0); color:inherit; text-shadow:inherit; filter:brightness(1.05); }
  100% { transform:scale(1); filter:none; }
}

.ra-tear-apart {
  animation: raTearApart 1s ease-out both;
}
@keyframes raTearApart {
  0% { letter-spacing: 1.5em; filter:blur(15px); opacity:0; transform:scaleX(1.4); color:#ff0033; text-shadow:0 0 30px #ff0033; }
  20% { letter-spacing: 0.8em; filter:blur(8px); color:#ffaa00; }
  40% { letter-spacing: 0.3em; filter:blur(3px); color:#00e5ff; transform:scaleX(1.1); }
  60% { letter-spacing: 0.05em; filter:blur(1px); color:#fff; }
  75% { letter-spacing: -0.05em; }
  85% { letter-spacing: 0.02em; }
  100% { letter-spacing: 0; filter:blur(0); opacity:1; color:inherit; transform:scaleX(1); }
}

.ra-broadcast-break {
  animation: raBroadcastBreak 2s ease-out forwards;
}
@keyframes raBroadcastBreak {
  0% { opacity:0; filter:contrast(400%) brightness(0.2); transform:scaleY(0.1) scaleX(1.3); }
  5% { opacity:1; filter:contrast(300%) brightness(2); transform:scaleY(0.3) scaleX(1.2); }
  10% { filter:contrast(200%) brightness(1.5); transform:scaleY(0.6) scaleX(1.1); text-shadow:-6px 0 #ff0033, 6px 0 #00e5ff; }
  15% { filter:contrast(150%) brightness(1.2); transform:scaleY(0.8) scaleX(1.05); }
  20% { transform:scaleY(1.05) scaleX(1.02); filter:contrast(120%); }
  25% { transform:scaleY(0.98) scaleX(1); }
  30% { transform:scaleY(1.02); filter:contrast(110%); }
  40% { transform:scaleY(1); filter:contrast(105%); text-shadow:2px 0 rgba(0,212,255,0.3); }
  100% { opacity:1; filter:none; transform:scale(1); text-shadow:inherit; }
}

.ra-emp {
  animation: raEMP 1.6s steps(10) both;
}
@keyframes raEMP {
  0% { filter:invert(1) brightness(3); transform:translate(10px,-8px) skewX(-10deg) scale(1.1); opacity:0.6; }
  10% { filter:invert(0) brightness(2) contrast(3); transform:translate(-8px,6px) skewX(8deg); opacity:1; }
  20% { filter:brightness(3) hue-rotate(180deg); transform:translate(6px,-4px) skewX(-5deg); }
  30% { filter:invert(1) contrast(2); transform:translate(-4px,8px) skewX(6deg) scale(1.05); }
  40% { filter:brightness(2) saturate(3); transform:translate(8px,-6px); }
  50% { filter:contrast(2) brightness(1.5); transform:translate(-6px,4px) skewX(-3deg); }
  60% { filter:brightness(1.8) hue-rotate(90deg); transform:translate(4px,-2px); }
  70% { filter:contrast(1.5) brightness(1.3); transform:translate(-2px,3px) skewX(2deg); }
  80% { filter:brightness(1.2) contrast(1.2); transform:translate(2px,-1px); }
  90% { filter:brightness(1.1); transform:translate(-1px,1px); }
  100% { filter:none; transform:translate(0,0) skewX(0) scale(1); opacity:1; }
}

.ra-vertical-wipe {
  animation: raVerticalWipe 1.1s cubic-bezier(0.1,0.9,0.2,1) both;
}
@keyframes raVerticalWipe {
  0% { clip-path:inset(0 0 100% 0); transform:translateY(-20px); opacity:0.5; text-shadow:0 -10px 20px #ff0033; }
  30% { clip-path:inset(0 0 50% 0); transform:translateY(-5px); }
  60% { clip-path:inset(0 0 15% 0); transform:translateY(3px); }
  80% { clip-path:inset(0 0 3% 0); transform:translateY(-1px); }
  100% { clip-path:inset(0 0 0% 0); transform:translateY(0); opacity:1; text-shadow:inherit; }
}
`;

// ── INJECT CSS ───────────────────────────────────────
const styleEl = document.createElement('style');
styleEl.textContent = RANDANIME_CSS;
document.head.appendChild(styleEl);

// ── ANIMATION REGISTRY ───────────────────────────────
// Organized by tier for weighted random selection
const TIERS = {
  miniscule: ['ra-breathe','ra-ghost','ra-drift','ra-dim','ra-pixel-shift'],
  minor:     ['ra-flicker','ra-chroma-soft','ra-scan-line','ra-weight-pulse','ra-hue-rotate'],
  moderate:  ['ra-slide-in','ra-tear-focus','ra-chroma-hard','ra-stamp','ra-static-entry'],
  major:     ['ra-burn','ra-glitch-shake','ra-signal-break','ra-noise-resolve'],
  massive:   ['ra-meltdown','ra-tear-apart','ra-broadcast-break','ra-emp','ra-vertical-wipe']
};

// Weighted random pick — massives are rare, miniscules are common
const WEIGHTS = {
  miniscule: 5,
  minor: 4,
  moderate: 3,
  major: 2,
  massive: 1
};

function weightedPick(exclude) {
  const pool = [];
  for (const [tier, anims] of Object.entries(TIERS)) {
    const weight = WEIGHTS[tier];
    for (const anim of anims) {
      if (!exclude.includes(anim)) {
        for (let i = 0; i < weight; i++) pool.push(anim);
      }
    }
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickAnimations(count) {
  const picked = [];
  for (let i = 0; i < count; i++) {
    picked.push(weightedPick(picked));
  }
  return picked;
}

// ── APPLY TO ENTRY WORD ──────────────────────────────
window.randanime = function(elementId, count) {
  const el = document.getElementById(elementId || 'entryWord');
  if (!el) return;
  const n = count || (3 + Math.floor(Math.random() * 3)); // 3-5 animations
  const chosen = pickAnimations(n);
  
  // Apply first as primary entry animation, rest as ongoing
  // Entry animations (one-shot) vs loop animations
  const oneShots = ['ra-slide-in','ra-tear-focus','ra-stamp','ra-static-entry','ra-burn',
                    'ra-glitch-shake','ra-noise-resolve','ra-meltdown','ra-tear-apart',
                    'ra-broadcast-break','ra-emp','ra-vertical-wipe'];
  
  const loops = chosen.filter(c => !oneShots.includes(c));
  const entry = chosen.find(c => oneShots.includes(c));
  
  // Apply entry animation first
  if (entry) {
    el.classList.add(entry);
    // After entry completes, apply loop animations
    setTimeout(() => {
      el.classList.remove(entry);
      loops.forEach(l => el.classList.add(l));
    }, 1800);
  } else {
    loops.forEach(l => el.classList.add(l));
  }
  
  return chosen;
};

// ── QUOTE ROTATION ENGINE ────────────────────────────
window.rotateQuotes = function(quotes, textId, sourceId, interval) {
  if (!quotes || quotes.length === 0) return;
  
  const textEl = document.getElementById(textId || 'quoteText');
  const sourceEl = document.getElementById(sourceId || 'quoteSource');
  if (!textEl) return;
  
  // Pick random starting quote
  let idx = Math.floor(Math.random() * quotes.length);
  
  function showQuote() {
    const q = quotes[idx];
    if (textEl) textEl.style.opacity = '0';
    if (sourceEl) sourceEl.style.opacity = '0';
    
    setTimeout(() => {
      if (textEl) textEl.textContent = typeof q === 'string' ? q : q.text;
      if (sourceEl && typeof q === 'object') sourceEl.textContent = q.source || '';
      if (textEl) textEl.style.transition = 'opacity 0.8s';
      if (sourceEl) sourceEl.style.transition = 'opacity 0.8s';
      if (textEl) textEl.style.opacity = '1';
      if (sourceEl) sourceEl.style.opacity = '1';
    }, 600);
    
    idx = (idx + 1) % quotes.length;
  }
  
  showQuote();
  setInterval(showQuote, interval || 7000);
};

})();
