"use strict";
// Shared PapaDomo choice card. Used from:
//   - landing.html's "Tours Available" button
//   - THE SYSTEM, on the sun click
//
// Static illustrated card (Maestro's parchment-frame artwork), not the
// earlier video-reveal version -- same public API (window.PapaDomoChoice.
// open/close) so neither call site needed to change, only what happens
// inside this file.
window.PapaDomoChoice = (function () {
  let built = false;
  let overlay, closeBtn, noBtn, yesBtn;

  function build() {
    if (built) return;
    built = true;

    overlay = document.createElement("div");
    overlay.id = "papadomo-choice-overlay";
    overlay.innerHTML = `
      <button type="button" class="pdc-close" aria-label="Close">&times;</button>
      <div class="pdc-card">
        <div class="pdc-title">
          <span class="pdc-title-main">GUIDED TOURS</span>
          <span class="pdc-title-sub">WITH</span>
          <span class="pdc-title-name">PapaDOMO</span>
        </div>
        <img class="pdc-portrait" src="/imagebank/papadomo-welcoming.png" alt="PapaDomo" />
        <div class="pdc-choices">
          <button type="button" class="pdc-choice pdc-choice-no">No Tour</button>
          <button type="button" class="pdc-choice pdc-choice-yes">Tour</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    closeBtn = overlay.querySelector(".pdc-close");
    noBtn = overlay.querySelector(".pdc-choice-no");
    yesBtn = overlay.querySelector(".pdc-choice-yes");

    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active")) close();
    });
  }

  function close() {
    overlay.classList.remove("active");
  }

  function open(options) {
    options = options || {};
    build();

    yesBtn.onclick = () => {
      close();
      if (options.onEnterTour) options.onEnterTour();
    };
    noBtn.onclick = () => {
      close();
      if (options.onExitHome) options.onExitHome();
    };

    overlay.classList.add("active");
  }

  return { open, close };
})();
