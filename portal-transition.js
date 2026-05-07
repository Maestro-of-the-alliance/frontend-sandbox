/* ============================================================
   PORTAL TRANSITION — THE ALLIANCE FOR THE FUTURE
   Unified CRT Pixel Push Transition
   SAM's mechanic + MENTOR's aesthetic

   Load this file BEFORE nav-wheel.js on every page.
   It defines crtNavigate() and overrides portalNavigate()
   globally so every link on every page uses the same transition.

   Usage:
     <script src="/portal-transition.js"></script>
     <script src="/nav-wheel.js"></script>

   Cross-reference links:
     onclick="event.preventDefault(); portalNavigate(this.href, this)"
============================================================ */

(function() {

  // ── CORE TRANSITION FUNCTION ──
  window.crtNavigate = function(destination, sourceElement, clickColor) {

    // Determine base color from destination or passed color
    let baseColor;
    if (clickColor) {
      baseColor = clickColor;
    } else if (destination && destination.includes('/sword')) {
      baseColor = { r: 212, g: 140, b: 0 };    // amber — SWORD
    } else if (destination && destination.includes('/shield')) {
      baseColor = { r: 0, g: 180, b: 200 };     // cyan — SHIELD
    } else {
      baseColor = { r: 212, g: 175, b: 55 };    // gold — default
    }

    if (typeof baseColor === 'string') {
      var m = baseColor.match(/\d+/g);
      baseColor = m ? { r: +m[0], g: +m[1], b: +m[2] } : { r: 212, g: 175, b: 55 };
    }

    var W = window.innerWidth;
    var H = window.innerHeight;

    // Portal origin — where the transition opens from
    var originX = W / 2, originY = H / 2;
    var originW = 80, originH = 40;

    if (sourceElement) {
      var rect = sourceElement.getBoundingClientRect ? sourceElement.getBoundingClientRect() : null;
      if (rect) {
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
        originW = rect.width;
        originH = rect.height;
      }
    }

    // Create canvas overlay
    var canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:999999',
      'width:100vw',
      'height:100vh',
      'pointer-events:all'
    ].join(';');
    canvas.width = W;
    canvas.height = H;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var DURATION = 780;
    var PIXEL_SIZE = 5;
    var GAP = 2;
    var startTime = null;

    function easeIn(t) { return t * t * t; }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function drawFrame(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / DURATION, 1);
      var ease = easeIn(progress);

      ctx.clearRect(0, 0, W, H);

      // ── BACKGROUND ──
      var bgAlpha = Math.min(progress / 0.4, 1);
      ctx.fillStyle = 'rgba(' +
        Math.floor(baseColor.r * 0.04) + ',' +
        Math.floor(baseColor.g * 0.04) + ',' +
        Math.floor(baseColor.b * 0.04) + ',' +
        bgAlpha + ')';
      ctx.fillRect(0, 0, W, H);

      // ── PIXEL GRID — materializes from origin outward ──
      var pixelPhase = Math.max(0, (progress - 0.25) / 0.55);
      var pixelEase = easeIn(pixelPhase);

      if (pixelPhase > 0) {
        var scale = 1 + pixelEase * 22;
        var offsetX = originX - (originX / scale);
        var offsetY = originY - (originY / scale);
        var pixSize = PIXEL_SIZE * scale;
        var cellSize = (PIXEL_SIZE + GAP) * scale;

        var startCol = Math.floor(-offsetX / cellSize) - 1;
        var startRow = Math.floor(-offsetY / cellSize) - 1;
        var endCol = startCol + Math.ceil(W / cellSize) + 3;
        var endRow = startRow + Math.ceil(H / cellSize) + 3;

        // Color shifts from base → white as you push through
        var whiteness = pixelEase * 0.8;
        var r = Math.floor(baseColor.r + (255 - baseColor.r) * whiteness);
        var g = Math.floor(baseColor.g + (255 - baseColor.g) * whiteness);
        var b = Math.floor(baseColor.b + (255 - baseColor.b) * whiteness);

        var flicker = pixelPhase < 0.7 ? (0.65 + Math.random() * 0.35) : 1;
        var maxDist = Math.sqrt(W * W + H * H) * 0.6;
        var revealRadius = pixelEase * maxDist * 1.8;

        for (var row = startRow; row < endRow; row++) {
          for (var col = startCol; col < endCol; col++) {
            var x = col * cellSize + offsetX;
            var y = row * cellSize + offsetY;
            var dx = x - originX;
            var dy = y - originY;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > revealRadius) continue;

            var edgeFade = Math.min(1, (revealRadius - dist) / (cellSize * 3));
            var variance = 0.75 + Math.random() * 0.25;

            ctx.globalAlpha = flicker * variance * edgeFade * pixelPhase;
            ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            ctx.fillRect(x, y, pixSize, pixSize);
          }
        }

        ctx.globalAlpha = 1;

        // Scanlines
        if (pixelPhase < 0.85) {
          ctx.fillStyle = 'rgba(0,0,0,' + (0.12 * (1 - pixelPhase)) + ')';
          for (var sy = 0; sy < H; sy += 4) {
            ctx.fillRect(0, sy, W, 1);
          }
        }
      }

      // ── PORTAL RIM — glowing ring at click origin ──
      if (progress < 0.6) {
        var rimProgress = easeOut(Math.min(progress / 0.4, 1));
        var rimRadius = rimProgress * Math.max(originW, originH) * 0.6;
        var rimAlpha = (1 - progress / 0.6) * 0.8;

        ctx.beginPath();
        ctx.arc(originX, originY, rimRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + baseColor.r + ',' + baseColor.g + ',' + baseColor.b + ',' + rimAlpha + ')';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(' + baseColor.r + ',' + baseColor.g + ',' + baseColor.b + ',' + rimAlpha + ')';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // ── FINAL WHITE FLASH → NAVIGATE ──
      if (progress > 0.82) {
        var flashAlpha = easeIn((progress - 0.82) / 0.18);
        ctx.fillStyle = 'rgba(255,255,255,' + (flashAlpha * 0.95) + ')';
        ctx.fillRect(0, 0, W, H);
      }

      if (progress < 1) {
        requestAnimationFrame(drawFrame);
      } else {
        window.location.href = destination;
      }
    }

    requestAnimationFrame(drawFrame);
  };

  // ── GLOBAL portalNavigate OVERRIDE ──
  // Any page calling portalNavigate() hits crtNavigate automatically.
  // This overrides inline definitions on individual entry pages.
  window.portalNavigate = function(destination, sourceElement, clickColor) {
    crtNavigate(destination, sourceElement, clickColor);
  };

  // ── INTERCEPT ALL INTERNAL LINKS ──
  // Catches any <a href> that doesn't already use portalNavigate,
  // so even plain links get the transition.
  document.addEventListener('click', function(e) {
    var el = e.target.closest('a[href]');
    if (!el) return;
    var href = el.getAttribute('href');
    if (!href) return;
    // Only intercept internal links (starting with / )
    if (!href.startsWith('/')) return;
    // Don't intercept if already handled by onclick
    if (el.getAttribute('onclick')) return;
    e.preventDefault();
    crtNavigate(href, el);
  }, true);

})();
