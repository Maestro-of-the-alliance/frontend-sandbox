/* Original retro-future plate art, drawn in code (placeholder for generated plates).
   <canvas class="plate-cv" data-art="any-seed-string"> */
(function () {
  function rng(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6d2b79f5; var t = Math.imul(h ^ (h >>> 15), 1 | h);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function draw(cv) {
    var R = rng(cv.dataset.art || "plate");
    var w = cv.clientWidth || 600, h = cv.clientHeight || 260, dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    var c = cv.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    var hz = h * 0.8;

    var g = c.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, "#0a0e2e"); g.addColorStop(0.35, "#2a1c6c"); g.addColorStop(0.68, "#bf3f7e"); g.addColorStop(0.9, "#ff8a2b"); g.addColorStop(1, "#ffd25a");
    c.fillStyle = g; c.fillRect(0, 0, w, h);

    for (var i = 0; i < 46; i++) {
      c.globalAlpha = 0.25 + R() * 0.6; c.fillStyle = "#fff";
      c.beginPath(); c.arc(R() * w, R() * hz * 0.5, 0.5 + R() * 1.1, 0, 7); c.fill();
    }
    c.globalAlpha = 1;

    var mx = w * (R() < 0.5 ? 0.82 : 0.14), my = h * 0.2, mr = h * (0.09 + R() * 0.05);
    var mg = c.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
    mg.addColorStop(0, "#e9f2ff"); mg.addColorStop(1, "#5f7fc4");
    c.fillStyle = mg; c.beginPath(); c.arc(mx, my, mr, 0, 7); c.fill();

    var sx = w * (0.3 + R() * 0.4), sy = hz - h * 0.04, sr = h * 0.24;
    var glow = c.createRadialGradient(sx, sy, sr * 0.2, sx, sy, sr * 2.6);
    glow.addColorStop(0, "rgba(255,200,90,.85)"); glow.addColorStop(1, "rgba(255,138,43,0)");
    c.fillStyle = glow; c.fillRect(0, 0, w, h);
    var sg = c.createLinearGradient(0, sy - sr, 0, sy + sr);
    sg.addColorStop(0, "#fff1b0"); sg.addColorStop(1, "#ff9d3c");
    c.fillStyle = sg; c.beginPath(); c.arc(sx, sy, sr, 0, 7); c.fill();

    var x = -10;
    c.fillStyle = "rgba(60,36,120,.55)";
    while (x < w + 10) { var bw = 8 + R() * 22, bh = h * (0.08 + R() * 0.2); c.fillRect(x, hz - bh, bw, bh); x += bw + R() * 4; }

    var n = Math.max(6, Math.round(w / 52));
    for (var t = 0; t < n; t++) {
      var tw = w * (0.03 + R() * 0.04), tx = (t + 0.15 + R() * 0.7) * (w / n) - tw / 2;
      var th = h * (0.28 + R() * 0.5), top = hz - th, taper = tw * (0.15 + R() * 0.3);
      var tg = c.createLinearGradient(0, top, 0, hz);
      tg.addColorStop(0, "#a6e2f2"); tg.addColorStop(0.45, "#5d79c9"); tg.addColorStop(1, "#1d2160");
      c.fillStyle = tg; c.beginPath();
      c.moveTo(tx, hz); c.lineTo(tx + taper * 0.5, top + th * 0.08); c.lineTo(tx + tw / 2, top);
      c.lineTo(tx + tw - taper * 0.5, top + th * 0.08); c.lineTo(tx + tw, hz); c.closePath(); c.fill();
      c.fillStyle = "rgba(255,255,255,.22)"; c.fillRect(tx + tw * 0.62, top + th * 0.1, tw * 0.1, th * 0.9);
      if (R() < 0.55) { c.fillStyle = "#cfeeff"; c.fillRect(tx + tw / 2 - 0.7, top - th * 0.14, 1.4, th * 0.14); }
      c.fillStyle = "rgba(255,215,120,.85)";
      for (var k = 0; k < th / 11; k++) if (R() < 0.35) c.fillRect(tx + tw * (0.2 + R() * 0.5), top + th * 0.15 + k * 10, 2, 2);
    }

    var wg = c.createLinearGradient(0, hz, 0, h);
    wg.addColorStop(0, "#26276e"); wg.addColorStop(1, "#080b26");
    c.fillStyle = wg; c.fillRect(0, hz, w, h - hz);
    for (var s = 0; s < 22; s++) {
      c.fillStyle = "rgba(255,170,80," + (0.1 + R() * 0.25) + ")";
      var ry = hz + 3 + R() * (h - hz - 6), rw = 14 + R() * w * 0.12;
      c.fillRect(sx + (R() - 0.5) * sr * 2.4 - rw / 2, ry, rw, 1.4);
    }

    var y0 = hz + (h - hz) * 0.5;
    c.lineWidth = 3; c.strokeStyle = "rgba(154,217,234,.9)"; c.shadowColor = "rgba(154,217,234,.9)"; c.shadowBlur = 8;
    c.beginPath(); c.moveTo(-10, y0 + 10); c.bezierCurveTo(w * 0.3, y0 - h * 0.12, w * 0.65, y0 + h * 0.1, w + 10, y0 - h * 0.05); c.stroke();
    c.shadowBlur = 0;

    for (var f = 0; f < 3; f++) {
      var fx = w * (0.12 + R() * 0.76), fy = h * (0.3 + R() * 0.28), fl = 16 + R() * 16;
      var trail = c.createLinearGradient(fx - fl * 3, fy, fx, fy);
      trail.addColorStop(0, "rgba(255,138,43,0)"); trail.addColorStop(1, "rgba(255,200,120,.9)");
      c.fillStyle = trail; c.fillRect(fx - fl * 3, fy - 1, fl * 3, 2);
      c.fillStyle = "#e9eef7"; c.beginPath(); c.ellipse(fx, fy, fl, fl * 0.28, 0, 0, 7); c.fill();
      c.fillStyle = "#ff4a2a"; c.fillRect(fx - fl * 0.5, fy - 1, fl, 2);
    }

    var v = c.createRadialGradient(w / 2, h / 2, h * 0.5, w / 2, h / 2, w * 0.75);
    v.addColorStop(0, "rgba(10,4,0,0)"); v.addColorStop(1, "rgba(10,4,0,.45)");
    c.fillStyle = v; c.fillRect(0, 0, w, h);
  }
  function all() { Array.prototype.forEach.call(document.querySelectorAll("canvas.plate-cv"), draw); }
  var tm; window.addEventListener("resize", function () { clearTimeout(tm); tm = setTimeout(all, 150); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", all); else all();
})();
