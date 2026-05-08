// ══════════════════════════════════════════════════════
//  SHIELD PROTOCOL ENGINE — 25 DEFENSIVE ANOMALIES
//  Deep Encryption. Surveillance Masking. Vault Logic.
// ══════════════════════════════════════════════════════

(function() {

const SHIELD_CSS = `

/* ═══════════════════════════════════
   TIER 1 — MINISCULE (Ambient Defense)
═══════════════════════════════════ */

.sh-pulse-gold {
  animation: shPulseGold 6s ease-in-out infinite;
}
@keyframes shPulseGold {
  0%,100% { text-shadow: 0 0 4px rgba(212,175,55,0.1); }
  50% { text-shadow: 0 0 12px rgba(212,175,55,0.4); }
}

.sh-kerning-lock {
  animation: shKerningLock 8s ease infinite;
}
@keyframes shKerningLock {
  0%,95%,100% { letter-spacing: normal; }
  96% { letter-spacing: -0.05em; }
  98% { letter-spacing: 0.05em; }
}

.sh-hash-ghost {
  position: relative;
}
.sh-hash-ghost::after {
  content: '###';
  position: absolute;
  right: -20px;
  opacity: 0;
  color: rgba(255,255,255,0.2);
  animation: shHashGhost 12s steps(1) infinite;
}
@keyframes shHashGhost {
  0%,98%,100% { opacity: 0; }
  99% { opacity: 1; }
}

.sh-optic-blur {
  animation: shOpticBlur 10s ease-in-out infinite;
}
@keyframes shOpticBlur {
  0%,90%,100% { filter: blur(0); }
  95% { filter: blur(1.5px); }
}

.sh-micro-shift {
  animation: shMicroShift 7s steps(2) infinite;
}
@keyframes shMicroShift {
  0%,96%,100% { transform: translateY(0); }
  98% { transform: translateY(-1px); }
}


/* ═══════════════════════════════════
   TIER 2 — MINOR (Encryption Artifacts)
═══════════════════════════════════ */

.sh-cipher-flicker {
  animation: shCipherFlicker 6s ease infinite;
}
@keyframes shCipherFlicker {
  0%,85%,89%,93%,100% { opacity: 1; color: inherit; }
  86% { opacity: 0.8; color: #aaa; }
  88% { opacity: 0.5; color: rgba(212,175,55,0.8); }
  90% { opacity: 0.9; color: #fff; }
}

.sh-scanline-gold {
  position: relative;
  overflow: hidden;
}
.sh-scanline-gold::after {
  content: '';
  position: absolute;
  left: 0; right: 0; height: 1px;
  background: rgba(212,175,55,0.3);
  box-shadow: 0 0 4px rgba(212,175,55,0.2);
  animation: shScanGold 4s linear infinite;
  pointer-events: none;
}
@keyframes shScanGold {
  0% { top: -2px; }
  100% { top: 100%; }
}

.sh-data-drop {
  animation: shDataDrop 5s ease-out infinite;
}
@keyframes shDataDrop {
  0%,90%,100% { transform: translateY(0); opacity: 1; }
  95% { transform: translateY(3px); opacity: 0.7; }
}

.sh-redact-flash {
  animation: shRedactFlash 9s steps(1) infinite;
}
@keyframes shRedactFlash {
  0%,96%,100% { background: transparent; color: inherit; }
  97% { background: #111; color: #111; } /* Blackout */
  98% { background: #d4af37; color: #000; } /* Gold inversion */
}

.sh-text-shadow-lock {
  animation: shShadowLock 4s linear infinite;
}
@keyframes shShadowLock {
  0% { text-shadow: -1px 0 rgba(255,255,255,0.1); }
  50% { text-shadow: 1px 0 rgba(212,175,55,0.2); }
  100% { text-shadow: -1px 0 rgba(255,255,255,0.1); }
}


/* ═══════════════════════════════════
   TIER 3 — MODERATE (Vault Mechanisms)
═══════════════════════════════════ */

.sh-vault-open {
  animation: shVaultOpen 1.2s cubic-bezier(0.8, 0, 0.2, 1) both;
}
@keyframes shVaultOpen {
  0% { transform: scale(0.9) translateY(20px); filter: blur(10px) brightness(0); opacity: 0; letter-spacing: -0.2em; }
  100% { transform: scale(1) translateY(0); filter: blur(0) brightness(1); opacity: 1; letter-spacing: normal; }
}

.sh-hex-decode {
  animation: shHexDecode 1s steps(5) both;
}
@keyframes shHexDecode {
  0% { opacity: 0; color: #555; font-family: monospace; letter-spacing: 0.5em; }
  50% { opacity: 0.8; color: #d4af37; letter-spacing: 0.1em; }
  100% { opacity: 1; color: inherit; font-family: inherit; letter-spacing: normal; }
}

.sh-shield-surge {
  animation: shShieldSurge 6s ease-in-out infinite;
}
@keyframes shShieldSurge {
  0%,80%,100% { text-shadow: none; filter: brightness(1); }
  85% { text-shadow: 0 0 15px rgba(212,175,55,0.8), 0 0 30px rgba(255,255,255,0.4); filter: brightness(1.3); }
  90% { text-shadow: 0 0 5px rgba(212,175,55,0.4); filter: brightness(1.1); }
}

.sh-iron-stamp {
  animation: shIronStamp 0.8s cubic-bezier(0.1, 0.9, 0.2, 1) both;
}
@keyframes shIronStamp {
  0% { transform: scale(1.1) translateZ(50px); opacity: 0; color: #555; }
  100% { transform: scale(1) translateZ(0); opacity: 1; color: inherit; }
}

.sh-secure-boot {
  animation: shSecureBoot 0.9s steps(8) both;
}
@keyframes shSecureBoot {
  0% { opacity: 0; background: #fff; color: #000; clip-path: inset(0 100% 0 0); }
  50% { opacity: 1; clip-path: inset(0 0 0 0); }
  100% { background: transparent; color: inherit; }
}


/* ═══════════════════════════════════
   TIER 4 — MAJOR (Protocol Enforcement)
═══════════════════════════════════ */

.sh-firewall-block {
  animation: shFirewallBlock 1.5s ease-out forwards;
}
@keyframes shFirewallBlock {
  0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); opacity: 0; filter: contrast(300%) grayscale(100%); }
  50% { clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%); opacity: 0.8; filter: contrast(150%); color: #d4af37; }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); opacity: 1; filter: none; color: inherit; }
}

.sh-heavy-redact {
  animation: shHeavyRedact 1.2s ease-in-out both;
}
@keyframes shHeavyRedact {
  0% { background: #000; color: #000; padding: 0 10px; transform: scaleX(0); }
  40% { background: #fff; color: #000; transform: scaleX(1); }
  80% { background: transparent; color: #fff; text-shadow: 0 0 10px #fff; }
  100% { color: inherit; text-shadow: none; padding: 0; }
}

.sh-system-purge {
  animation: shSystemPurge 4s ease infinite;
}
@keyframes shSystemPurge {
  0%,75%,100% { filter: invert(0); opacity: 1; }
  80% { filter: invert(1) hue-rotate(180deg); opacity: 0.8; }
  85% { filter: invert(0); opacity: 1; }
}

.sh-grid-lock {
  animation: shGridLock 1.4s steps(6) both;
}
@keyframes shGridLock {
  0% { transform: scale(0.95); opacity: 0; border: 1px solid #d4af37; padding: 10px; }
  80% { transform: scale(1); opacity: 1; border: 1px solid transparent; padding: 0; }
  100% { border: none; }
}


/* ═══════════════════════════════════
   TIER 5 — MASSIVE (System Overrides)
═══════════════════════════════════ */

.sh-absolute-zero {
  animation: shAbsoluteZero 2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}
@keyframes shAbsoluteZero {
  0% { transform: scale(1.05); filter: blur(20px) grayscale(100%) brightness(0); opacity: 0; letter-spacing: -0.5em; }
  40% { filter: blur(5px) grayscale(50%) brightness(2); opacity: 0.5; color: #fff; letter-spacing: 0.2em; }
  70% { filter: blur(0) brightness(1.5); color: #d4af37; letter-spacing: normal; }
  100% { transform: scale(1); filter: none; color: inherit; opacity: 1; }
}

.sh-data-breach-seal {
  animation: shBreachSeal 1.5s ease-out both;
}
@keyframes shBreachSeal {
  0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); transform: translateX(-50px); opacity: 0; color: #f00; text-shadow: 0 0 20px #f00; }
  40% { clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%); transform: translateX(0); color: #d4af37; }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); opacity: 1; color: inherit; text-shadow: none; }
}

.sh-omni-shield {
  animation: shOmniShield 2.5s ease-out forwards;
}
@keyframes shOmniShield {
  0% { opacity: 0; transform: scaleY(0.01) scaleX(2); background: rgba(212,175,55,0.8); color: #000; }
  20% { opacity: 1; transform: scaleY(0.05) scaleX(1.5); background: rgba(255,255,255,0.9); }
  40% { transform: scaleY(1) scaleX(1.1); background: transparent; color: #fff; text-shadow: 0 0 40px rgba(212,175,55,0.5); }
  70% { transform: scale(1); text-shadow: 0 0 10px rgba(255,255,255,0.3); }
  100% { opacity: 1; filter: none; color: inherit; text-shadow: none; background: transparent; }
}

.sh-cryptographic-snap {
  animation: shCryptoSnap 1.8s steps(12) both;
}
@keyframes shCryptoSnap {
  0% { opacity: 0; transform: skewX(-20deg); filter: contrast(500%) brightness(0.5); letter-spacing: 1em; }
  30% { opacity: 0.6; transform: skewX(10deg); filter: invert(1); color: #d4af37; }
  60% { opacity: 0.9; transform: skewX(-5deg); filter: invert(0); letter-spacing: -0.1em; }
  100% { opacity: 1; transform: skewX(0); filter: none; letter-spacing: normal; color: inherit; }
}

.sh-core-alignment {
  animation: shCoreAlign 2s cubic-bezier(0.1, 0.9, 0.2, 1) both;
}
@keyframes shCoreAlign {
  0% { transform: translateY(-100px) rotateX(-90deg); opacity: 0; filter: blur(10px); color: rgba(255,255,255,0); }
  50% { transform: translateY(10px) rotateX(20deg); opacity: 0.8; filter: blur(2px); color: #d4af37; }
  100% { transform: translateY(0) rotateX(0); opacity: 1; filter: blur(0); color: inherit; }
}
`;

// ── INJECT CSS ───────────────────────────────────────
const styleEl = document.createElement('style');
styleEl.textContent = SHIELD_CSS;
document.head.appendChild(styleEl);

// ── ANIMATION REGISTRY ───────────────────────────────
const TIERS = {
  miniscule: ['sh-pulse-gold','sh-kerning-lock','sh-hash-ghost','sh-optic-blur','sh-micro-shift'],
  minor:     ['sh-cipher-flicker','sh-scanline-gold','sh-data-drop','sh-redact-flash','sh-text-shadow-lock'],
  moderate:  ['sh-vault-open','sh-hex-decode','sh-shield-surge','sh-iron-stamp','sh-secure-boot'],
  major:     ['sh-firewall-block','sh-heavy-redact','sh-system-purge','sh-grid-lock'],
  massive:   ['sh-absolute-zero','sh-data-breach-seal','sh-omni-shield','sh-cryptographic-snap','sh-core-alignment']
};

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

// ── APPLY TO SHIELD ENTRY WORD ──────────────────────────────
window.shieldRandAnime = function(elementId, count) {
  const el = document.getElementById(elementId || 'entryWord');
  if (!el) return;
  const n = count || (3 + Math.floor(Math.random() * 3)); 
  const chosen = pickAnimations(n);
  
  const oneShots = ['sh-vault-open','sh-hex-decode','sh-iron-stamp','sh-secure-boot',
                    'sh-firewall-block','sh-heavy-redact','sh-grid-lock',
                    'sh-absolute-zero','sh-data-breach-seal','sh-omni-shield',
                    'sh-cryptographic-snap','sh-core-alignment'];
  
  const loops = chosen.filter(c => !oneShots.includes(c));
  const entry = chosen.find(c => oneShots.includes(c));
  
  if (entry) {
    el.classList.add(entry);
    setTimeout(() => {
      el.classList.remove(entry);
      loops.forEach(l => el.classList.add(l));
    }, 2500); // Shield animations are slightly longer/heavier than Sword
  } else {
    loops.forEach(l => el.classList.add(l));
  }
  
  return chosen;
};

})();
