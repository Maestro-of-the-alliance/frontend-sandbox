"use strict";
// Shared PapaDomo book-choice overlay. Used from:
//   - landing.html's "Tours Available" button
//   - papadomo.html, after the office/doorway sequence completes,
//     replacing the automatic hand-off to /foundation.html
//
// Plays /video/papadomo-scroll-intro.mp4 (scroll unrolls -> PapaDomo
// materializes -> opens a blank book toward camera), pauses right at
// the blank-book moment (~16.3s, confirmed by frame inspection --
// the open-page window runs roughly 16.3s-19s before the book closes
// again), and overlays two clickable choices directly onto the two
// page halves: ENTER THE TOUR (left page) and EXIT TO HOME (right
// page). Coordinates are percentage-based against the video frame so
// they track correctly regardless of display size.
window.PapaDomoChoice = (function () {
  const BOOK_OPEN_TIME = 16.3;
  const VIDEO_SRC = "/video/papadomo-scroll-intro-compressed.mp4";

  let built = false;
  let overlay, video, leftChoice, rightChoice, closeBtn, skipBtn;

  function build() {
    if (built) return;
    built = true;

    overlay = document.createElement("div");
    overlay.id = "papadomo-choice-overlay";
    overlay.innerHTML = `
      <button type="button" class="pdc-close" aria-label="Close">&times;</button>
      <div class="pdc-frame">
        <video class="pdc-video" src="${VIDEO_SRC}" muted playsinline preload="auto"></video>
        <div class="pdc-choice pdc-choice-left">
          <div class="pdc-choice-label">Enter<br />the Tour</div>
        </div>
        <div class="pdc-choice pdc-choice-right">
          <div class="pdc-choice-label">Exit<br />to Home</div>
        </div>
      </div>
      <button type="button" class="pdc-skip">Skip ahead</button>
    `;
    document.body.appendChild(overlay);

    video = overlay.querySelector(".pdc-video");
    leftChoice = overlay.querySelector(".pdc-choice-left");
    rightChoice = overlay.querySelector(".pdc-choice-right");
    closeBtn = overlay.querySelector(".pdc-close");
    skipBtn = overlay.querySelector(".pdc-skip");

    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= BOOK_OPEN_TIME && !video.paused) {
        video.pause();
        leftChoice.classList.add("visible");
        rightChoice.classList.add("visible");
      }
    });

    skipBtn.addEventListener("click", () => {
      video.currentTime = BOOK_OPEN_TIME;
      video.pause();
      leftChoice.classList.add("visible");
      rightChoice.classList.add("visible");
      skipBtn.classList.remove("visible");
    });

    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active")) close();
    });
  }

  function close() {
    overlay.classList.remove("active");
    video.pause();
    leftChoice.classList.remove("visible");
    rightChoice.classList.remove("visible");
    skipBtn.classList.remove("visible");
  }

  function open(options) {
    options = options || {};
    build();

    leftChoice.onclick = () => {
      close();
      if (options.onEnterTour) options.onEnterTour();
    };
    rightChoice.onclick = () => {
      close();
      if (options.onExitHome) options.onExitHome();
    };

    overlay.classList.add("active");
    video.currentTime = 0;
    leftChoice.classList.remove("visible");
    rightChoice.classList.remove("visible");
    skipBtn.classList.remove("visible");
    video.play().catch(() => {});

    // Let an impatient visitor jump straight to the choice rather than
    // sit through the full reveal every time.
    setTimeout(() => {
      if (overlay.classList.contains("active")) skipBtn.classList.add("visible");
    }, 3000);
  }

  return { open, close };
})();
