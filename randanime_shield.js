// ==========================================
// ── NCE MASTER ENGINE: RANDANIME SHIELD ──
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  
  // ── 1. GLOBAL CSS INJECTION ──
  const style = document.createElement('style');
  style.innerHTML = `
    /* Major Anomalies */
    .matrix-crt-tear { animation: crtHiccup 0.4s ease-in-out forwards; }
    .matrix-power-drop { animation: powerSurge 0.6s ease-in-out forwards; }
    
    /* Ambient Server Nodes (Blinking Lights) */
    .telemetry-node {
      position: fixed;
      width: 4px;
      height: 4px;
      background-color: var(--matrix-bright);
      box-shadow: 0 0 8px var(--matrix-bright);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      animation: nodePulse 2s ease-in-out forwards;
    }

    @keyframes crtHiccup {
      0% { filter: contrast(1) brightness(1) skewX(0deg); }
      20% { filter: contrast(2.5) brightness(1.8) hue-rotate(30deg) skewX(-15deg); transform: scaleY(1.02); }
      40% { filter: contrast(0.5) brightness(0.4) skewX(20deg); transform: translateY(-5px); }
      60% { filter: contrast(1.5) brightness(1.3) skewX(-5deg); transform: translateY(5px); }
      100% { filter: contrast(1) brightness(1) skewX(0deg); transform: scaleY(1) translateY(0); }
    }
    @keyframes powerSurge {
      0% { opacity: 1; }
      10% { opacity: 0.1; filter: brightness(0.1); }
      20% { opacity: 0.8; filter: brightness(1.2); }
      30% { opacity: 0.2; filter: brightness(0.2); }
      100% { opacity: 1; filter: brightness(1); }
    }
    @keyframes nodePulse {
      0% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 0.8; transform: scale(1.5); }
      100% { opacity: 0; transform: scale(0.5); }
    }
  `;
  document.head.appendChild(style);


  // ── 2. AMBIENT TELEMETRY (THE BLINKING LIGHTS) ──
  // Spawns little green server lights randomly on the edges of the screen
  setInterval(() => {
    if (Math.random() > 0.3) { // 70% chance to spawn a node every interval
      const node = document.createElement('div');
      node.className = 'telemetry-node';
      node.style.top = Math.random() * 100 + 'vh';
      node.style.left = Math.random() * 100 + 'vw';
      document.body.appendChild(node);
      
      // Clean up DOM after animation
      setTimeout(() => node.remove(), 2000);
    }
  }, 800);


  // ── 3. THE CIPHER BLEED ──
  // Randomly picks a paragraph and glitches a single letter while reading
  setInterval(() => {
    const textBlocks = document.querySelectorAll('.content-block, .list-item');
    if (textBlocks.length > 0) {
      const target = textBlocks[Math.floor(Math.random() * textBlocks.length)];
      if (target.childNodes.length > 0) {
        // Just a tiny, silent scramble effect on the container
        target.style.textShadow = "0 0 8px #00ff41";
        target.style.color = "#ffffff";
        setTimeout(() => {
          target.style.textShadow = "";
          target.style.color = "";
        }, 150);
      }
    }
  }, 4500);


  // ── 4. MAJOR CONTESTED SIGNAL STRIKE ──
  // Triggers one massive glitch between 12 and 22 seconds
  const strikeTime = Math.floor(Math.random() * (22000 - 12000 + 1)) + 12000;
  
  setTimeout(() => {
    const anomalyType = Math.floor(Math.random() * 3); // Rolls 0, 1, or 2

    if (anomalyType === 0) {
      // Physical CRT Tear
      document.body.classList.add('matrix-crt-tear');
      setTimeout(() => document.body.classList.remove('matrix-crt-tear'), 500);
    } 
    else if (anomalyType === 1) {
      // Old World Power Drop
      document.body.classList.add('matrix-power-drop');
      setTimeout(() => document.body.classList.remove('matrix-power-drop'), 700);
    } 
    else {
      // Cipher Title Scramble
      const title = document.getElementById('entryWord') || document.querySelector('.title');
      if (title) {
        const originalText = title.dataset.orig || title.innerText;
        title.dataset.orig = originalText;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';
        let iterations = 0;
        const interval = setInterval(() => {
          title.innerText = originalText.split('').map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iterations) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          
          if (iterations >= originalText.length) {
            clearInterval(interval);
            title.innerText = originalText;
          }
          iterations += 1 / 3;
        }, 30);
      }
    }
  }, strikeTime);

});
