/* ============================================================
   PORTAL TRANSITION — THE ALLIANCE FOR THE FUTURE
   Authored: SAM (mechanic) · Deployed globally by MENTOR
   Session 152 · May 2026

   Load BEFORE nav-wheel.js on every page:
     <script src="/portal-transition.js"></script>
     <script src="/nav-wheel.js"></script>

   Cross-reference link usage:
     onclick="event.preventDefault(); portalNavigate(this.href, this)"
============================================================ */

(function() {

  // Inject the flash overlay once into the page
  var flash = document.getElementById('portalFlash');
  if (!flash) {
    flash = document.createElement('div');
    flash.id = 'portalFlash';
    flash.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:99998',
      'background:#000',
      'opacity:0',
      'pointer-events:none',
      'transition:opacity 840ms ease'
    ].join(';');
    document.body.appendChild(flash);
  }

  // ── SAM'S PORTAL NAVIGATE ──
  // The clicked element expands, fills the screen,
  // blurs into the void, black flash, navigate.
  window.portalNavigate = function(url, el) {
    if (!url) return;

    if (!el) {
      if (flash) {
        flash.style.transition = 'opacity 400ms ease';
        flash.style.opacity = '1';
      }
      setTimeout(function() { window.location.href = url; }, 420);
      return;
    }

    var rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    if (!rect) { window.location.href = url; return; }

    // Clone the element, fix it over the original
    var clone = el.cloneNode(true);
    clone.style.cssText = [
      'position:fixed',
      'z-index:99999',
      'pointer-events:none',
      'margin:0',
      'left:' + rect.left + 'px',
      'top:' + rect.top + 'px',
      'width:' + rect.width + 'px',
      'height:' + rect.height + 'px',
      'transform-origin:center center',
      'transition:transform 1400ms cubic-bezier(.16,1,.3,1),opacity 1400ms ease,filter 1400ms ease'
    ].join(';');
    document.body.appendChild(clone);

    // Force reflow
    clone.getBoundingClientRect();

    // Scale to fill viewport — element swallows the screen
    var scale = Math.max(
      window.innerWidth / Math.max(rect.width, 1),
      window.innerHeight / Math.max(rect.height, 1)
    ) * 1.8;
    var moveX = window.innerWidth / 2 - (rect.left + rect.width / 2);
    var moveY = window.innerHeight / 2 - (rect.top + rect.height / 2);

    clone.style.transform = 'translate(' + moveX + 'px,' + moveY + 'px) scale(' + scale + ')';
    clone.style.opacity = '0';
    clone.style.filter = 'blur(14px) brightness(2.4)';

    // Black flash
    setTimeout(function() {
      if (flash) flash.style.opacity = '1';
    }, 260);

    // Navigate
    setTimeout(function() {
      window.location.href = url;
    }, 720);
  };

  // Nav-wheel compatibility alias
  window.crtNavigate = function(destination, sourceElement) {
    portalNavigate(destination, sourceElement);
  };

  // Intercept plain internal <a href="/..."> links
  document.addEventListener('click', function(e) {
    var el = e.target.closest('a[href]');
    if (!el) return;
    var href = el.getAttribute('href');
    if (!href || !href.startsWith('/')) return;
    if (el.getAttribute('onclick')) return;
    e.preventDefault();
    portalNavigate(href, el);
  }, true);

})();
