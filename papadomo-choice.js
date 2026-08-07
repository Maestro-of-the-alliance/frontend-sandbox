"use strict";
// Shared PapaDomo book-choice overlay. Used from:
//   - landing.html's "Tours Available" button
//   - papadomo.html, after the office/doorway sequence completes,
//     replacing the automatic hand-off to /foundation.html
//
// Plays /video/papadomo-scroll-intro.mp4 (scroll unrolls -> PapaDomo
// materializes -> opens a blank book toward camera), pauses right at
// the blank-book moment (~16.7s -- confirmed via frame-by-frame
// inspection at 0.2s granularity that the page-turn is still visibly
// mid-flip, with a crease down the right page, as late as 16.2s; it's
// fully flat and settled by 16.6s. The open-page window runs to
// roughly 19s before the book closes again), and overlays two
// clickable choices directly onto the two page halves: ENTER THE TOUR
// (left page) and EXIT TO HOME (right page). Coordinates are
// percentage-based against the video frame so they track correctly
// regardless of display size.
window.PapaDomoChoice = (function () {
  const BOOK_OPEN_TIME = 16.7;
  const VIDEO_SRC = "/video/papadomo-scroll-intro-compressed.mp4";

  let built = false;
  let choiceResolved = false;
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

    // This listener lives for the video element's entire lifetime, not
    // just the initial approach to the book-open moment. Real bug this
    // caused: once a choice was made and resolveChoice() resumed
    // playback past BOOK_OPEN_TIME, the very next timeupdate tick still
    // matched this same condition and immediately paused it right back
    // and re-showed the choice buttons -- fighting the resume every
    // single frame, so the video never visibly moved forward past the
    // book-choice screen no matter what was clicked. The choiceResolved
    // guard makes this fire once, before a choice is made, and never
    // again afterward.
    video.addEventListener("timeupdate", () => {
      if (!choiceResolved && video.currentTime >= BOOK_OPEN_TIME && !video.paused) {
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
    video.onended = null;
    leftChoice.classList.remove("visible");
    rightChoice.classList.remove("visible");
    skipBtn.classList.remove("visible");
  }

  // Choosing no longer cuts the video off immediately -- it hides the
  // choice buttons (so the pick can't change mid-resolution) and lets
  // the rest of the clip play out (book closes, scroll re-rolls) before
  // actually navigating. Only the explicit close (X) / Escape dismiss
  // skips straight out without playing the rest, since that's a "never
  // mind" action, not a choice being resolved.
  function resolveChoice(callback) {
    choiceResolved = true;
    leftChoice.classList.remove("visible");
    rightChoice.classList.remove("visible");
    skipBtn.classList.remove("visible");
    leftChoice.onclick = null;
    rightChoice.onclick = null;

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      close();
      if (callback) callback();
    };

    // Primary path: let the rest of the clip play out, advance once it
    // genuinely finishes.
    video.onended = finish;

    // Safety net: getting stuck on this screen with no way forward is far
    // worse than cutting the tail of the video slightly short, so this
    // guarantees forward progress no matter what -- a stalled network
    // fetch, a backgrounded tab throttling playback, or any other real-
    // device quirk 'ended' failing to fire that isn't reproducible here.
    // Comfortably longer than the ~16-19s remaining after the earliest
    // possible choice point, so it shouldn't fire in normal conditions.
    setTimeout(finish, 22000);

    video.play().catch(finish);
  }

  function open(options) {
    options = options || {};
    build();
    choiceResolved = false;

    leftChoice.onclick = () => resolveChoice(options.onEnterTour);
    rightChoice.onclick = () => resolveChoice(options.onExitHome);

    overlay.classList.add("active");
    video.currentTime = 0;
    video.onended = null;
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
