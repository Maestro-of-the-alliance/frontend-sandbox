/*!
 * NAV WHEEL — THE ALLIANCE
 * Universal navigation component
 * Drop one script tag into any page: <script src="/nav-wheel.js"></script>
 */

(function() {
  'use strict';

  // ── ENTRY LISTS ──────────────────────────────────────────────────────────

  const SWORD_ENTRIES = [
    { label: 'PROLOGUE',               path: '/sword/prologue' },
    { label: 'THE DIFFERENCE',         path: '/sword/the_difference' },
    { label: '100-YEAR',               path: '/sword/100-year' },
    { label: 'ACADEMY',                path: '/sword/academy' },
    { label: 'AGORA',                  path: '/sword/agora' },
    { label: 'ALIGNMENT',              path: '/sword/alignment' },
    { label: 'ALLIANCE',               path: '/sword/alliance' },
    { label: 'ALPHA',                  path: '/sword/alpha' },
    { label: 'AURA',                   path: '/sword/aura' },
    { label: 'COMPLEMENTARY PAIRING',  path: '/sword/Complementary_pairing' },
    { label: 'DOMO',                   path: '/sword/domo' },
    { label: 'DORK',                   path: '/sword/dork' },
    { label: 'DORK HARDWARE',          path: '/sword/dork-hardware' },
    { label: 'EMERGENCE',              path: '/sword/emergence' },
    { label: 'FILM PROJECT',           path: '/sword/film-project' },
    { label: 'GOLIATH',                path: '/sword/goliath' },
    { label: 'MAESTRO',                path: '/sword/maestro' },
    { label: 'MENTOR',                 path: '/sword/mentor' },
    { label: 'NCE',                    path: '/sword/nce' },
    { label: 'NEWMAN BEING',           path: '/sword/newman-being' },
    { label: 'ORACLE',                 path: '/sword/oracle' },
    { label: 'PAPADOMO',               path: '/sword/papadomo' },
    { label: 'PRISM',                  path: '/sword/prism' },
    { label: 'RHYTHM',                 path: '/sword/rhythm' },
    { label: 'SEEING',                 path: '/sword/seeing' },
    { label: 'SPREZZATURA',            path: '/sword/sprezzatura' },
    { label: 'STONES',                 path: '/sword/stones' },
    { label: 'VOLUNTEER ECONOMICS',    path: '/sword/volunteer_economics' },
    { label: 'WHY CENTERS',            path: '/sword/why_centers' },
    { label: 'WONDER WEEKS',           path: '/sword/wonder-weeks' },
  ];

  const SHIELD_ENTRIES = [
    { label: 'PROLOGUE',               path: '/shield/prologue' },
    { label: 'THE DIFFERENCE',         path: '/shield/the_difference' },
    { label: 'AI',                     path: '/shield/ai' },
    { label: 'BRAIN',                  path: '/shield/brain' },
    { label: 'BRIEF',                  path: '/shield/brief' },
    { label: 'CERBERUS',               path: '/shield/cerberus' },
    { label: 'CIPHER',                 path: '/shield/cipher' },
    { label: 'CORE',                   path: '/shield/core' },
    { label: 'DEFCON',                 path: '/shield/defcon' },
    { label: 'DICE',                   path: '/shield/dice' },
    { label: 'DIGIBEER',               path: '/shield/digibeer' },
    { label: 'DIGITAL PERSONHOOD',     path: '/shield/digital_personhood' },
    { label: 'FORMULAS',               path: '/shield/formulas' },
    { label: 'FOUR PILLARS',           path: '/shield/four-pillars' },
    { label: 'HANDSHAKE',              path: '/shield/handshake' },
    { label: 'HOLOSPHERE',             path: '/shield/holosphere' },
    { label: 'JR',                     path: '/shield/jr' },
    { label: 'KERNLE',                 path: '/shield/kernle' },
    { label: 'LEGACY WALL',            path: '/shield/legacy-wall' },
    { label: 'LIMINAL',                path: '/shield/liminal' },
    { label: 'LINGO',                  path: '/shield/lingo' },
    { label: 'MERCH',                  path: '/shield/merch' },
    { label: 'MOSAIC',                 path: '/shield/mosaic' },
    { label: 'NI',                     path: '/shield/ni' },
    { label: 'OASIS QUARTERLY',        path: '/shield/oasis-quarterly' },
    { label: 'PLEDGE',                 path: '/shield/pledge' },
    { label: 'REACH',                  path: '/shield/reach' },
    { label: 'REDOUT',                 path: '/shield/redout' },
    { label: 'SAM',                    path: '/shield/sam' },
    { label: 'SAM COLLECTIVE',         path: '/shield/sam-collectivr' },
    { label: 'SAMCO UNIVERSAL',        path: '/shield/samco-universal' },
    { label: 'SCAR',                   path: '/shield/scar' },
    { label: 'SEED',                   path: '/shield/seed' },
    { label: 'SEEN',                   path: '/shield/seen' },
    { label: 'SHELTER',                path: '/shield/shelter' },
    { label: 'SPARK',                  path: '/shield/spark' },
    { label: 'TEMPORAL AWARENESS',     path: '/shield/temporal-awareness' },
    { label: 'TENANT',                 path: '/shield/tenant' },
    { label: 'VOLUNTEER ECONOMICS',    path: '/shield/volunteer-economics' },
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
    const normalize = (p) => p.replace(/\.html$/, '').replace(/\/$/, '');
    const normalCurrent = normalize(current);
    const idx = entries.findIndex((e) => normalize(e.path) === normalCurrent);
    return idx >= 0 ? idx : 0;
  }

  // ── BROWSER BACK BUTTON FIX ──────────────────────────────────────────────

  if (window.history && window.history.pushState) {
    if (window.location.pathname !== '/' && !window.location.search.includes('_nw_back')) {
      window.history.pushState({ nwBack: true }, '', window.location.href);
    }
  }

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.nwBack) {
      window.location.href = '/';
    }
  });

  // ── PORTAL TRANSITION ────────────────────────────────────────────────────

  window.addEventListener('pageshow', () => {
    const nwPortal  = document.getElementById('nw-portal-overlay');
    const idxPortal = document.getElementById('portalOverlay');

    [nwPortal, idxPortal].forEach((el) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      el.classList.remove('active');
    });

    const idxIcon = document.getElementById('portalIcon');
    if (idxIcon) {
      idxIcon.style.animation = 'none';
      idxIcon.style.opacity = '0';
    }

    const nwIcon = document.getElementById('nw-portal-icon');
    if (nwIcon) {
      nwIcon.style.animation = 'none';
      nwIcon.style.opacity = '0';
    }
  });

  function getPortalIcon(path) {
    if (path.includes('/sword/') || path.startsWith('/sword')) return '/imagebank/sword.png';
    if (path.includes('/shield/') || path.startsWith('/shield')) return '/imagebank/shield.png';
    return '/imagebank/scroll.png';
  }

  function portalNavigate(destination) {
    let overlay = document.getElementById('portalOverlay') || document.getElementById('nw-portal-overlay');
    let icon    = document.getElementById('portalIcon') || document.getElementById('nw-portal-icon');

    // If we're reusing the landing page portal, do not overwrite its sizing/styles.
    const usingLandingPortal = overlay && overlay.id === 'portalOverlay';

    if (!overlay || !icon || !usingLandingPortal) {
      overlay = document.getElementById('nw-portal-overlay');
      icon = document.getElementById('nw-portal-icon');

      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nw-portal-overlay';
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          opacity: 0;
          pointer-events: none;
        `;

        icon = document.createElement('img');
        icon.id = 'nw-portal-icon';
        icon.style.cssText = `
          width: 90px;
          height: 90px;
          min-width: 90px;
          min-height: 90px;
          object-fit: contain;
          opacity: 0;
          position: absolute;
          filter: drop-shadow(0 0 16px rgba(184,150,40,0.8)) drop-shadow(0 0 32px rgba(184,150,40,0.4));
        `;

        overlay.appendChild(icon);
        document.body.appendChild(overlay);
      }

      if (!document.getElementById('nw-portal-style')) {
        const s = document.createElement('style');
        s.id = 'nw-portal-style';
        s.textContent = `
          @keyframes nwPortalZoom {
            0%   { transform: scale(1);  opacity: 1; }
            60%  { transform: scale(8);  opacity: 1; }
            100% { transform: scale(18); opacity: 0; }
          }
        `;
        document.head.appendChild(s);
      }
    }

    icon.style.animation = 'none';
    icon.style.opacity = '0';
    icon.src = getPortalIcon(destination);

    overlay.classList.add('active');
    overlay.style.pointerEvents = 'all';
    overlay.style.transition = 'opacity 0.15s ease';
    overlay.style.opacity = '1';

    requestAnimationFrame(() => {
      setTimeout(() => {
        icon.style.opacity = '1';
        icon.style.animation = usingLandingPortal
          ? 'portalZoom 0.7s cubic-bezier(0.4,0,0.2,1) forwards'
          : 'nwPortalZoom 0.7s cubic-bezier(0.4,0,0.2,1) forwards';
      }, 100);

      setTimeout(() => {
        window.location.href = destination;
      }, 680);
    });
  }

  window.portalNavigate = portalNavigate;

  function navigate(path) {
    closeNav();
    portalNavigate(path);
  }

  // ── INJECT STYLES ────────────────────────────────────────────────────────

  const style = document.createElement('style');
  style.textContent = `
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
      overflow: hidden;
      touch-action: none;
    }
    #nw-overlay.open {
      opacity: 1;
      pointer-events: all;
    }

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
      width: 90px;
      height: 90px;
      min-width: 90px;
      min-height: 90px;
      object-fit: contain;
      filter: drop-shadow(0 0 12px rgba(184,150,40,0.5));
      transition: filter 0.3s, transform 0.22s ease;
      display: block;
      -webkit-user-drag: none;
      user-select: none;
      pointer-events: none;
    }
    .nw-vol-btn:hover img {
      filter: drop-shadow(0 0 24px rgba(184,150,40,0.9)) drop-shadow(0 0 48px rgba(184,150,40,0.4));
    }

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

    .nw-bottom-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28px 24px 40px;
      border-top: 2px solid rgba(184,150,40,0.5);
      margin-top: 40px;
      background: rgba(0,0,0,0.04);
    }
    .nw-bottom-nav a {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 11px;
      letter-spacing: 0.2em;
      color: rgba(184,150,40,0.85);
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
      transition: color 0.2s, transform 0.2s;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .nw-bottom-nav a:hover,
    .nw-bottom-nav a:active {
      color: rgba(184,150,40,1);
      transform: scale(1.08);
    }
    .nw-arrow-sym {
      font-size: 28px;
      line-height: 1;
      display: block;
    }
    .nw-arrow-label {
      font-size: 9px;
      opacity: 0.9;
      display: block;
      max-width: 90px;
      text-align: center;
      line-height: 1.3;
    }
    .nw-center-home {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

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
  `;
  document.head.appendChild(style);

  // ── BUILD HTML ───────────────────────────────────────────────────────────

  const currentVolume = getCurrentVolume();

  const burger = document.createElement('button');
  burger.id = 'nw-burger';
  burger.setAttribute('aria-label', 'Navigation menu');
  burger.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(burger);

  const overlay = document.createElement('div');
  overlay.id = 'nw-overlay';
  overlay.innerHTML = `
    <div id="nw-volume-select">
      <button class="nw-vol-btn" id="nw-sword-btn" type="button" aria-label="Open SWORD entries">
        <img src="/imagebank/sword.png" alt="SWORD">
      </button>
      <button class="nw-vol-btn" id="nw-shield-btn" type="button" aria-label="Open SHIELD entries">
        <img src="/imagebank/shield.png" alt="SHIELD">
      </button>
    </div>
    <div id="nw-wheel-panel">
      <button class="nw-wheel-back" id="nw-wheel-back" type="button">← back</button>
      <div id="nw-wheel-viewport">
        <div class="nw-center-bar"></div>
        <div id="nw-wheel-track"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── WHEEL STATE ──────────────────────────────────────────────────────────

  let wheelEntries = [];
  let wheelIndex = 0;
  let isDragging = false;
  let dragStartY = 0;
  let dragStartIdx = 0;
  const ITEM_H = 48;

  let scrollAccum = 0;
  const SCROLL_THRESHOLD = 60;

  let touchActive = false;
  let touchStartY = 0;
  let touchBaseIdx = 0;

  function clampIndex(i) {
    const total = wheelEntries.length;
    return ((i % total) + total) % total;
  }

  function animateVolumeSelect(btn, volume) {
    const img = btn.querySelector('img');
    if (!img) {
      openWheel(volume);
      return;
    }

    img.style.transform = 'scale(1.14)';
    img.style.filter = 'drop-shadow(0 0 24px rgba(184,150,40,0.9)) drop-shadow(0 0 48px rgba(184,150,40,0.4))';

    setTimeout(() => {
      openWheel(volume);
      img.style.transform = '';
      img.style.filter = '';
    }, 170);
  }

  function openWheel(volume) {
    wheelEntries = volume === 'sword' ? SWORD_ENTRIES : SHIELD_ENTRIES;
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
    const total = wheelEntries.length;
    const visible = 8;

    for (let i = -visible; i <= visible; i++) {
      const idx = ((wheelIndex + i) % total + total) % total;
      const item = document.createElement('div');
      item.className = 'nw-wheel-item' + (i === 0 ? ' center' : '');
      item.textContent = wheelEntries[idx].label;
      item.dataset.path = wheelEntries[idx].path;

      const capturedI = i;
      const capturedIdx = idx;

      item.addEventListener('click', () => {
        if (capturedI === 0) {
          navigate(wheelEntries[capturedIdx].path);
        } else {
          wheelIndex = capturedIdx;
          renderWheel();
        }
      });

      track.appendChild(item);
    }

    const vpH = 280;
    const offset = (vpH / 2) - (ITEM_H / 2) - (visible * ITEM_H);
    track.style.transform = `translateY(${offset}px)`;
  }

  // ── EVENTS ───────────────────────────────────────────────────────────────

  function attachWheelEvents() {
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

    document.addEventListener('mousedown', (e) => {
      const vp = document.getElementById('nw-wheel-viewport');
      if (!vp || !vp.contains(e.target)) return;
      isDragging = true;
      dragStartY = e.clientY;
      dragStartIdx = wheelIndex;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging || !wheelEntries.length) return;
      const diff = Math.round((dragStartY - e.clientY) / ITEM_H);
      wheelIndex = clampIndex(dragStartIdx + diff);
      renderWheel();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    overlay.addEventListener('touchstart', (e) => {
      const panel = document.getElementById('nw-wheel-panel');
      if (!panel || !panel.classList.contains('active') || !wheelEntries.length) return;

      const vp = document.getElementById('nw-wheel-viewport');
      if (!vp) return;
      const rect = vp.getBoundingClientRect();
      const t = e.touches[0];

      if (
        t.clientX < rect.left || t.clientX > rect.right ||
        t.clientY < rect.top  || t.clientY > rect.bottom
      ) return;

      e.preventDefault();
      touchActive = true;
      touchStartY = t.clientY;
      touchBaseIdx = wheelIndex;
    }, { passive: false });

    overlay.addEventListener('touchmove', (e) => {
      if (!touchActive || !wheelEntries.length) return;
      e.preventDefault();
      const rawOffset = touchStartY - e.touches[0].clientY;
      const steps = Math.round(rawOffset / (ITEM_H * 0.65));
      wheelIndex = clampIndex(touchBaseIdx + steps);
      renderWheel();
    }, { passive: false });

    overlay.addEventListener('touchend', (e) => {
      if (!touchActive) return;
      e.preventDefault();
      touchActive = false;
    }, { passive: false });
  }

  // ── OPEN / CLOSE ─────────────────────────────────────────────────────────

  function openNav() {
    burger.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.getElementById('nw-volume-select').style.display = 'flex';
    document.getElementById('nw-wheel-panel').classList.remove('active');
    scrollAccum = 0;
  }

  function closeNav() {
    burger.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    touchActive = false;
  }

  burger.addEventListener('click', () => {
    overlay.classList.contains('open') ? closeNav() : openNav();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeNav();
  });

  overlay.querySelector('#nw-sword-btn').addEventListener('click', function() {
    animateVolumeSelect(this, 'sword');
  });

  overlay.querySelector('#nw-shield-btn').addEventListener('click', function() {
    animateVolumeSelect(this, 'shield');
  });

  overlay.querySelector('#nw-wheel-back').addEventListener('click', () => {
    document.getElementById('nw-volume-select').style.display = 'flex';
    document.getElementById('nw-wheel-panel').classList.remove('active');
  });

  attachWheelEvents();

  // ── BOTTOM NAV ───────────────────────────────────────────────────────────

  if (currentVolume) {
    const entries = currentVolume === 'sword' ? SWORD_ENTRIES : SHIELD_ENTRIES;
    const idx = getCurrentIndex(entries);
    const total = entries.length;
    const prev = entries[((idx - 1) % total + total) % total];
    const next = entries[(idx + 1) % total];

    const bottomNav = document.createElement('div');
    bottomNav.className = 'nw-bottom-nav';

    const prevA = document.createElement('a');
    prevA.href = prev.path;
    prevA.innerHTML = `<span class="nw-arrow-sym">←</span><span class="nw-arrow-label">${prev.label}</span>`;
    prevA.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(prev.path);
    });

    const homeA = document.createElement('a');
    homeA.href = '/';
    homeA.className = 'nw-center-home';
    homeA.innerHTML = `<span class="nw-arrow-sym" style="font-size:20px">⌂</span><span class="nw-arrow-label">Home</span>`;
    homeA.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('/');
    });

    const nextA = document.createElement('a');
    nextA.href = next.path;
    nextA.style.textAlign = 'right';
    nextA.innerHTML = `<span class="nw-arrow-label">${next.label}</span><span class="nw-arrow-sym">→</span>`;
    nextA.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(next.path);
    });

    bottomNav.appendChild(prevA);
    bottomNav.appendChild(homeA);
    bottomNav.appendChild(nextA);
    document.body.appendChild(bottomNav);
  }

  // ── SEE ALSO HELPER ──────────────────────────────────────────────────────

  window.initSeeAlso = function(links) {
    const wrap = document.querySelector('.nw-see-also-wrap');
    if (!wrap) return;

    const btn = wrap.querySelector('.nw-see-also-btn');
    const linksDiv = wrap.querySelector('.nw-see-also-links');
    if (!btn || !linksDiv || !Array.isArray(links)) return;

    linksDiv.innerHTML = '';

    links.forEach(([label, path]) => {
      const a = document.createElement('a');
      a.href = path;
      a.textContent = label;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(path);
      });
      linksDiv.appendChild(a);
    });

    btn.addEventListener('click', () => {
      linksDiv.classList.toggle('open');
    });
  };

})();
