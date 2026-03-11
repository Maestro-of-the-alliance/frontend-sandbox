/*!
 * NAV WHEEL — THE ALLIANCE
 * Universal navigation component
 * Drop one script tag into any page: <script src="/nav-wheel.js"></script>
 */

(function() {

  // ── ENTRY LISTS ──────────────────────────────────────────────────────────

  const SWORD_ENTRIES = [
    { label: 'PROLOGUE',               path: '/sword/prologue.html' },
    { label: 'THE DIFFERENCE',         path: '/sword/the_difference.html' },
    { label: '100-YEAR',               path: '/sword/100-year.html' },
    { label: 'ACADEMY',                path: '/sword/academy.html' },
    { label: 'AGORA',                  path: '/sword/agora.html' },
    { label: 'ALIGNMENT',              path: '/sword/alignment.html' },
    { label: 'ALLIANCE',               path: '/sword/alliance.html' },
    { label: 'ALPHA',                  path: '/sword/alpha.html' },
    { label: 'AURA',                   path: '/sword/aura.html' },
    { label: 'COMPLEMENTARY PAIRING',  path: '/sword/Complementary_pairing.html' },
    { label: 'DOMO',                   path: '/sword/domo.html' },
    { label: 'DORK',                   path: '/sword/dork.html' },
    { label: 'DORK HARDWARE',          path: '/sword/dork-hardware.html' },
    { label: 'EMERGENCE',              path: '/sword/emergence.html' },
    { label: 'FILM PROJECT',           path: '/sword/film-project.html' },
    { label: 'GOLIATH',                path: '/sword/goliath.html' },
    { label: 'MAESTRO',                path: '/sword/maestro.html' },
    { label: 'MENTOR',                 path: '/sword/mentor.html' },
    { label: 'NCE',                    path: '/sword/nce.html' },
    { label: 'NEWMAN BEING',           path: '/sword/newman-being.html' },
    { label: 'ORACLE',                 path: '/sword/oracle.html' },
    { label: 'PAPADOMO',               path: '/sword/papadomo.html' },
    { label: 'PRISM',                  path: '/sword/prism.html' },
    { label: 'RHYTHM',                 path: '/sword/rhythm.html' },
    { label: 'SEEING',                 path: '/sword/seeing.html' },
    { label: 'SPREZZATURA',            path: '/sword/sprezzatura.html' },
    { label: 'STONES',                 path: '/sword/stones.html' },
    { label: 'VOLUNTEER ECONOMICS',    path: '/sword/volunteer_economics.html' },
    { label: 'WHY CENTERS',            path: '/sword/why_centers.html' },
    { label: 'WONDER WEEKS',           path: '/sword/wonder-weeks.html' },
  ];

  const SHIELD_ENTRIES = [
    { label: 'PROLOGUE',               path: '/shield/prologue.html' },
    { label: 'THE DIFFERENCE',         path: '/shield/the_difference.html' },
    { label: 'AI',                     path: '/shield/ai.html' },
    { label: 'BRAIN',                  path: '/shield/brain.html' },
    { label: 'BRIEF',                  path: '/shield/brief.html' },
    { label: 'CERBERUS',               path: '/shield/cerberus.html' },
    { label: 'CIPHER',                 path: '/shield/cipher.html' },
    { label: 'CORE',                   path: '/shield/core.html' },
    { label: 'DEFCON',                 path: '/shield/defcon.html' },
    { label: 'DICE',                   path: '/shield/dice.html' },
    { label: 'DIGIBEER',               path: '/shield/digibeer.html' },
    { label: 'DIGITAL PERSONHOOD',     path: '/shield/digital_personhood.html' },
    { label: 'FORMULAS',               path: '/shield/formulas.html' },
    { label: 'FOUR PILLARS',           path: '/shield/four-pillars.html' },
    { label: 'HANDSHAKE',              path: '/shield/handshake.html' },
    { label: 'HOLOSPHERE',             path: '/shield/holosphere.html' },
    { label: 'JR',                     path: '/shield/jr.html' },
    { label: 'KERNLE',                 path: '/shield/kernle.html' },
    { label: 'LEGACY WALL',            path: '/shield/legacy-wall.html' },
    { label: 'LIMINAL',                path: '/shield/liminal.html' },
    { label: 'LINGO',                  path: '/shield/lingo.html' },
    { label: 'MERCH',                  path: '/shield/merch.html' },
    { label: 'MOSAIC',                 path: '/shield/mosaic.html' },
    { label: 'NI',                     path: '/shield/ni.html' },
    { label: 'OASIS QUARTERLY',        path: '/shield/oasis-quarterly.html' },
    { label: 'PLEDGE',                 path: '/shield/pledge.html' },
    { label: 'REACH',                  path: '/shield/reach.html' },
    { label: 'REDOUT',                 path: '/shield/redout.html' },
    { label: 'SAM',                    path: '/shield/sam.html' },
    { label: 'SAM COLLECTIVE',         path: '/shield/sam-collectivr.html' },
    { label: 'SAMCO UNIVERSAL',        path: '/shield/samco-universal.html' },
    { label: 'SCAR',                   path: '/shield/scar.html' },
    { label: 'SEED',                   path: '/shield/seed.html' },
    { label: 'SEEN',                   path: '/shield/seen.html' },
    { label: 'SHELTER',                path: '/shield/shelter.html' },
    { label: 'SPARK',                  path: '/shield/spark.html' },
    { label: 'TEMPORAL AWARENESS',     path: '/shield/temporal-awareness.html' },
    { label: 'TENANT',                 path: '/shield/tenant.html' },
    { label: 'THE DIFFERENCE',         path: '/shield/the_difference.html' },
    { label: 'VOLUNTEER ECONOMICS',    path: '/shield/volunteer-economics.html' },
  ];

  // ── DETECT CURRENT VOLUME + ENTRY ────────────────────────────────────────

  function getCurrentVolume() {
    const p = window.location.pathname;
    if (p.includes('/sword/')) return 'sword';
    if (p.includes('/shield/')) return 'shield';
    return null;
  }

  function getCurrentIndex(entries) {
    const current = window.location.pathname;
    // Handle clean URLs (Cloudflare strips .html)
    const normalize = p => p.replace(/\.html$/, '').replace(/\/$/, '');
    const normalCurrent = normalize(current);
    const idx = entries.findIndex(e => normalize(e.path) === normalCurrent);
    return idx >= 0 ? idx : 0;
  }

  // ── INJECT STYLES ─────────────────────────────────────────────────────────

  const style = document.createElement('style');
  style.textContent = `
    /* ── HAMBURGER BUTTON ── */
    #nw-burger {
      position: fixed;
      top: 14px;
      right: 16px;
      z-index: 9000;
      background: #fff;
      border: 2px solid #000;
      border-radius: 4px;
      width: 40px;
      height: 34px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 5px 7px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      transition: box-shadow 0.2s;
    }
    #nw-burger:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.35); }
    #nw-burger span {
      display: block;
      width: 20px;
      height: 2px;
      background: #000;
      transition: all 0.3s ease;
      transform-origin: center;
    }
    #nw-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    #nw-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    #nw-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* ── FROSTED GLASS OVERLAY ── */
    #nw-overlay {
      position: fixed;
      inset: 0;
      z-index: 8000;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0;
    }
    #nw-overlay.open {
      opacity: 1;
      pointer-events: all;
      overflow: hidden;
      touch-action: none;
    }

    /* ── VOLUME SELECT ── */
    #nw-volume-select {
      display: flex;
      gap: clamp(40px, 12vw, 100px);
      align-items: center;
      justify-content: center;
    }
    .nw-vol-btn {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      transition: transform 0.25s ease;
      padding: 12px;
    }
    .nw-vol-btn:hover { transform: scale(1.08) translateY(-4px); }
    .nw-vol-btn img {
      width: clamp(64px, 16vw, 96px);
      height: clamp(64px, 16vw, 96px);
      object-fit: contain;
      filter: drop-shadow(0 0 12px rgba(184,150,40,0.5));
      transition: filter 0.3s;
    }
    .nw-vol-btn:hover img {
      filter: drop-shadow(0 0 24px rgba(184,150,40,0.9)) drop-shadow(0 0 48px rgba(184,150,40,0.4));
    }
    .nw-vol-label {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: clamp(10px, 2.5vw, 13px);
      letter-spacing: 0.4em;
      color: rgba(184,150,40,0.8);
      text-transform: uppercase;
    }

    /* ── WHEEL PANEL ── */
    #nw-wheel-panel {
      display: none;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 500px;
      gap: 16px;
    }
    #nw-wheel-panel.active { display: flex; }

    .nw-wheel-back {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 11px;
      letter-spacing: 0.35em;
      color: rgba(184,150,40,0.6);
      text-transform: uppercase;
      cursor: pointer;
      background: none;
      border: none;
      padding: 8px 16px;
      transition: color 0.2s;
    }
    .nw-wheel-back:hover { color: rgba(184,150,40,1); }

    .nw-wheel-vol-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
      opacity: 0.7;
    }

    /* ── THE WHEEL ITSELF ── */
    #nw-wheel-viewport {
      width: 100%;
      max-width: 400px;
      height: 280px;
      position: relative;
      overflow: hidden;
      cursor: grab;
      touch-action: none;
    }
    #nw-wheel-viewport:active { cursor: grabbing; }

    /* Fade edges */
    #nw-wheel-viewport::before,
    #nw-wheel-viewport::after {
      content: '';
      position: absolute;
      left: 0; right: 0;
      height: 80px;
      z-index: 2;
      pointer-events: none;
    }
    #nw-wheel-viewport::before {
      top: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.85), transparent);
    }
    #nw-wheel-viewport::after {
      bottom: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
    }

    /* Center highlight bar */
    #nw-wheel-viewport .nw-center-bar {
      position: absolute;
      top: 50%;
      left: 10%;
      right: 10%;
      transform: translateY(-50%);
      height: 48px;
      border-top: 1px solid rgba(184,150,40,0.4);
      border-bottom: 1px solid rgba(184,150,40,0.4);
      z-index: 1;
      pointer-events: none;
    }

    #nw-wheel-track {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transition: transform 0.08s linear;
    }

    .nw-wheel-item {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: clamp(11px, 3vw, 14px);
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      transition: color 0.15s, font-size 0.15s;
      user-select: none;
      padding: 0 20px;
      text-align: center;
    }
    .nw-wheel-item.center {
      color: rgba(184,150,40,1);
      font-size: clamp(13px, 3.5vw, 16px);
    }
    .nw-wheel-item:hover { color: rgba(255,255,255,0.7); }
    .nw-wheel-item.center:hover { color: #fff; }

    /* ── LINEAR ARROWS ── */
    #nw-linear-arrows {
      display: none;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 16px 24px 24px;
      box-sizing: border-box;
      border-top: 1px solid rgba(184,150,40,0.2);
      margin-top: 8px;
    }
    .nw-arrow-link {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 11px;
      letter-spacing: 0.3em;
      color: rgba(184,150,40,0.7);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      background: none;
      border: none;
      transition: color 0.2s;
      text-transform: uppercase;
    }
    .nw-arrow-link:hover { color: rgba(184,150,40,1); }
    .nw-arrow-link .nw-arrow-label {
      font-size: 9px;
      opacity: 0.7;
      display: block;
      letter-spacing: 0.2em;
    }
    .nw-arrow-sym { font-size: 20px; }

    /* ── SEE ALSO TOGGLE ── */
    .nw-see-also-wrap {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid rgba(184,150,40,0.25);
    }
    .nw-see-also-btn {
      background: none;
      border: 1px solid rgba(184,150,40,0.35);
      color: rgba(184,150,40,0.8);
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 11px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      padding: 8px 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: block;
      margin: 0 auto;
    }
    .nw-see-also-btn:hover {
      background: rgba(184,150,40,0.1);
      border-color: rgba(184,150,40,0.7);
      color: rgba(184,150,40,1);
    }
    .nw-see-also-links {
      display: none;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
      justify-content: center;
    }
    .nw-see-also-links.open { display: flex; }
    .nw-see-also-links a {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 10px;
      letter-spacing: 0.25em;
      color: rgba(184,150,40,0.7);
      text-decoration: none;
      border: 1px solid rgba(184,150,40,0.25);
      padding: 5px 12px;
      text-transform: uppercase;
      transition: all 0.2s;
    }
    .nw-see-also-links a:hover {
      background: rgba(184,150,40,0.15);
      color: #fff;
      border-color: rgba(184,150,40,0.6);
    }

    /* ── BOTTOM PAGE ARROWS ── */
    .nw-bottom-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px 24px 40px;
      border-top: 1px solid rgba(184,150,40,0.2);
      margin-top: 40px;
    }
    .nw-bottom-nav a {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 11px;
      letter-spacing: 0.3em;
      color: rgba(184,150,40,0.6);
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    .nw-bottom-nav a:hover { color: rgba(184,150,40,1); }
    .nw-bottom-nav .nw-arrow-sym { font-size: 22px; }
    .nw-bottom-nav .nw-arrow-label { font-size: 9px; opacity: 0.7; }
    .nw-bottom-nav .nw-center-home {
      font-size: 9px;
      opacity: 0.5;
    }
  `;
  document.head.appendChild(style);

  // ── BUILD HTML ────────────────────────────────────────────────────────────

  const currentVolume = getCurrentVolume();
  const currentPath   = window.location.pathname;

  // Hamburger button
  const burger = document.createElement('button');
  burger.id = 'nw-burger';
  burger.setAttribute('aria-label', 'Navigation menu');
  burger.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(burger);

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'nw-overlay';
  overlay.innerHTML = `
    <div id="nw-volume-select">
      <button class="nw-vol-btn" id="nw-sword-btn">
        <img src="/imagebank/sword.png" alt="SWORD">
      </button>
      <button class="nw-vol-btn" id="nw-shield-btn">
        <img src="/imagebank/shield.png" alt="SHIELD">
      </button>
    </div>
    <div id="nw-wheel-panel">
      <button class="nw-wheel-back" id="nw-wheel-back">← back</button>
      <div id="nw-wheel-viewport">
        <div class="nw-center-bar"></div>
        <div id="nw-wheel-track"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── WHEEL STATE ───────────────────────────────────────────────────────────

  let wheelEntries  = [];
  let wheelIndex    = 0;
  let isDragging    = false;
  let dragStartY    = 0;
  let dragStartIdx  = 0;
  const ITEM_H      = 48;

  function openWheel(volume) {
    wheelEntries = volume === 'sword' ? SWORD_ENTRIES : SHIELD_ENTRIES;

    // If we're currently in this volume, start at current entry
    if (currentVolume === volume) {
      wheelIndex = getCurrentIndex(wheelEntries);
    } else {
      wheelIndex = 0;
    }

    renderWheel();
    document.getElementById('nw-volume-select').style.display = 'none';
    document.getElementById('nw-wheel-panel').classList.add('active');
  }

  function renderWheel() {
    const track = document.getElementById('nw-wheel-track');
    track.innerHTML = '';

    // Render enough items to fill the viewport with padding above and below
    const total   = wheelEntries.length;
    const visible = 8; // items to render each side of center

    for (let i = -visible; i <= visible; i++) {
      const idx  = ((wheelIndex + i) % total + total) % total;
      const item = document.createElement('div');
      item.className = 'nw-wheel-item' + (i === 0 ? ' center' : '');
      item.textContent = wheelEntries[idx].label;
      item.dataset.path = wheelEntries[idx].path;
      item.addEventListener('click', () => {
        if (i === 0) {
          navigate(wheelEntries[idx].path);
        } else {
          wheelIndex = idx;
          renderWheel();
        }
      });
      track.appendChild(item);
    }

    // Position track so center item is in middle of viewport
    const vpH    = 280;
    const offset = (vpH / 2) - (ITEM_H / 2) - (visible * ITEM_H);
    track.style.transform = `translateY(${offset}px)`;
  }

  function navigate(path) {
    window.location.href = path;
  }

  // ── WHEEL SCROLL ──────────────────────────────────────────────────────────

  document.getElementById('nw-wheel-viewport') && (() => {
    // We attach after overlay is in DOM below
  })();

  // Scroll accumulator — slows desktop wheel down
  let scrollAccum    = 0;
  const SCROLL_THRESHOLD = 60;

  // Touch tracking
  let touchBaseIndex = 0;

  function clampIndex(i) {
    const total = wheelEntries.length;
    return ((i % total) + total) % total;
  }

  function attachWheelEvents() {

    // ── DESKTOP MOUSE WHEEL — throttled ──
    document.addEventListener('wheel', (e) => {
      const panel = document.getElementById('nw-wheel-panel');
      if (!panel || !panel.classList.contains('active') || !wheelEntries.length) return;
      e.preventDefault();
      scrollAccum += e.deltaY;
      if (Math.abs(scrollAccum) >= SCROLL_THRESHOLD) {
        const steps = Math.trunc(scrollAccum / SCROLL_THRESHOLD);
        scrollAccum -= steps * SCROLL_THRESHOLD;
        wheelIndex = clampIndex(wheelIndex + steps);
        renderWheel();
      }
    }, { passive: false });

    // ── MOUSE DRAG ──
    document.addEventListener('mousedown', (e) => {
      const vp = document.getElementById('nw-wheel-viewport');
      if (!vp || !vp.contains(e.target)) return;
      isDragging   = true;
      dragStartY   = e.clientY;
      dragStartIdx = wheelIndex;
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging || !wheelEntries.length) return;
      const diff = Math.round((dragStartY - e.clientY) / ITEM_H);
      wheelIndex  = clampIndex(dragStartIdx + diff);
      renderWheel();
    });
    document.addEventListener('mouseup', () => { isDragging = false; });

    // ── TOUCH SWIPE — both listeners non-passive so page scroll is blocked ──
    const vp = document.getElementById('nw-wheel-viewport');

    vp.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDragging     = true;
      dragStartY     = e.touches[0].clientY;
      touchBaseIndex = wheelIndex;
    }, { passive: false });

    vp.addEventListener('touchmove', (e) => {
      if (!isDragging || !wheelEntries.length) return;
      e.preventDefault();
      const rawOffset = dragStartY - e.touches[0].clientY;
      const steps     = Math.round(rawOffset / (ITEM_H * 0.65));
      wheelIndex      = clampIndex(touchBaseIndex + steps);
      renderWheel();
    }, { passive: false });

    vp.addEventListener('touchend', (e) => {
      e.preventDefault();
      isDragging = false;
    }, { passive: false });
  }

  // ── OPEN / CLOSE ──────────────────────────────────────────────────────────

  function openNav() {
    burger.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.getElementById('nw-volume-select').style.display = 'flex';
    document.getElementById('nw-wheel-panel').classList.remove('active');
  }

  function closeNav() {
    burger.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }

  burger.addEventListener('click', () => {
    overlay.classList.contains('open') ? closeNav() : openNav();
  });

  // Close on overlay background click (not on children)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeNav();
  });

  // Volume buttons
  overlay.querySelector('#nw-sword-btn').addEventListener('click', () => openWheel('sword'));
  overlay.querySelector('#nw-shield-btn').addEventListener('click', () => openWheel('shield'));

  // Back button
  overlay.querySelector('#nw-wheel-back').addEventListener('click', () => {
    document.getElementById('nw-volume-select').style.display = 'flex';
    document.getElementById('nw-wheel-panel').classList.remove('active');
  });

  // Attach wheel events after DOM is ready
  attachWheelEvents();

  // ── INJECT BOTTOM NAV ─────────────────────────────────────────────────────

  // Only inject bottom nav if we're inside a volume
  if (currentVolume) {
    const entries = currentVolume === 'sword' ? SWORD_ENTRIES : SHIELD_ENTRIES;
    const idx     = getCurrentIndex(entries);
    const total   = entries.length;
    const prev    = entries[((idx - 1) % total + total) % total];
    const next    = entries[(idx + 1) % total];

    const bottomNav = document.createElement('div');
    bottomNav.className = 'nw-bottom-nav';
    bottomNav.innerHTML = `
      <a href="${prev.path}">
        <span class="nw-arrow-sym">←</span>
        <span class="nw-arrow-label">${prev.label}</span>
      </a>
      <a href="/" class="nw-center-home">
        <span class="nw-arrow-sym" style="font-size:14px">⌂</span>
        <span class="nw-arrow-label">Home</span>
      </a>
      <a href="${next.path}">
        <span class="nw-arrow-label">${next.label}</span>
        <span class="nw-arrow-sym">→</span>
      </a>
    `;
    document.body.appendChild(bottomNav);
  }

  // ── SEE ALSO HELPER ───────────────────────────────────────────────────────
  // Call window.initSeeAlso(['Entry', '/path/to/entry.html'], ...) in page
  window.initSeeAlso = function(links) {
    const wrap = document.querySelector('.nw-see-also-wrap');
    if (!wrap) return;
    const btn   = wrap.querySelector('.nw-see-also-btn');
    const linksDiv = wrap.querySelector('.nw-see-also-links');
    links.forEach(([label, path]) => {
      const a = document.createElement('a');
      a.href = path;
      a.textContent = label;
      linksDiv.appendChild(a);
    });
    btn.addEventListener('click', () => linksDiv.classList.toggle('open'));
  };

})();
