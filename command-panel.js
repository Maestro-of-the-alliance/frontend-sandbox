/**
 * command-panel.js
 * The Alliance NCE — Command Prompt Panel
 * Separate from TOC. Triggered by stealth prompt at bottom-left.
 *
 * Modes: CONTACT · GET INVOLVED · SUPPORT · LINKS
 *
 * SEARCH mode (and its own duplicate copy of every canon entry,
 * NCE_ENTRIES) was removed per direct instruction -- search now
 * lives in exactly one place, the hamburger's SEARCH node, which
 * always goes to /canon-search/. This panel is now strictly a
 * call-to-action interface, not a second search implementation.
 */

(function () {
  "use strict";

  // ── INJECT STYLES ───────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #cmdPanel {
      position: fixed;
      inset: 0;
      z-index: 9500;
      background: #000;
      display: none;
      flex-direction: column;
      font-family: 'VT323', monospace;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    #cmdPanel.open {
      display: flex;
      opacity: 1;
    }

    /* ── TOP BAR ── */
    .cmd-topbar {
      display: flex;
      align-items: center;
      gap: 0;
      border-bottom: 1px solid rgba(184,150,40,0.25);
      background: rgba(184,150,40,0.04);
      flex-shrink: 0;
    }
    .cmd-prompt-sym {
      font-size: 22px;
      color: rgba(184,150,40,0.5);
      padding: 14px 10px 14px 20px;
      user-select: none;
    }
    .cmd-topbar-label {
      flex: 1;
      font-family: 'VT323', monospace;
      font-size: 22px;
      color: rgba(184,150,40,0.65);
      letter-spacing: 0.15em;
      padding: 14px 0;
      user-select: none;
    }
    .cmd-close {
      font-size: 22px;
      color: rgba(184,150,40,0.4);
      cursor: pointer;
      padding: 14px 20px;
      transition: color 0.2s;
      user-select: none;
    }
    .cmd-close:hover { color: #e8c840; }

    /* ── MODE TABS ── */
    .cmd-tabs {
      display: flex;
      border-bottom: 1px solid rgba(184,150,40,0.15);
      flex-shrink: 0;
    }
    .cmd-tab {
      font-family: 'VT323', monospace;
      font-size: 13px;
      letter-spacing: 0.3em;
      color: rgba(184,150,40,0.4);
      padding: 8px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: color 0.2s, border-color 0.2s;
      user-select: none;
      text-transform: uppercase;
    }
    .cmd-tab:hover { color: rgba(184,150,40,0.8); }
    .cmd-tab.active {
      color: #e8c840;
      border-bottom-color: #e8c840;
    }

    /* ── BODY ── */
    .cmd-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px 40px;
      background: #000;
    }
    .cmd-body::-webkit-scrollbar { width: 4px; }
    .cmd-body::-webkit-scrollbar-track { background: transparent; }
    .cmd-body::-webkit-scrollbar-thumb { background: rgba(184,150,40,0.3); border-radius: 2px; }

    /* ── SHARED / SECTION LABEL ── */
    .cmd-section-label {
      font-size: 11px;
      letter-spacing: 0.4em;
      color: rgba(184,150,40,0.6);
      text-transform: uppercase;
      margin-bottom: 10px;
      margin-top: 4px;
    }

    /* ── CONTACT MODE ── */
    .cmd-form-group {
      margin-bottom: 18px;
    }
    .cmd-form-label {
      display: block;
      font-size: 11px;
      letter-spacing: 0.35em;
      color: rgba(184,150,40,0.45);
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .cmd-form-input,
    .cmd-form-select,
    .cmd-form-textarea {
      width: 100%;
      background: rgba(184,150,40,0.04);
      border: 1px solid rgba(184,150,40,0.2);
      color: #e8c840;
      font-family: 'VT323', monospace;
      font-size: 18px;
      letter-spacing: 0.08em;
      padding: 10px 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .cmd-form-input:focus,
    .cmd-form-select:focus,
    .cmd-form-textarea:focus {
      border-color: rgba(184,150,40,0.6);
    }
    .cmd-form-select option { background: #0a0a0a; }
    .cmd-form-textarea { min-height: 120px; resize: vertical; }
    .cmd-form-submit {
      font-family: 'VT323', monospace;
      font-size: 16px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #000;
      background: rgba(184,150,40,0.85);
      border: none;
      padding: 12px 32px;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 8px;
    }
    .cmd-form-submit:hover { background: #e8c840; }

    /* ── GET INVOLVED ── */
    .cmd-skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 14px 0 20px;
    }
    .cmd-skill-chip {
      font-family: 'VT323', monospace;
      font-size: 14px;
      letter-spacing: 0.2em;
      padding: 5px 14px;
      border: 1px solid rgba(184,150,40,0.25);
      color: rgba(184,150,40,0.55);
      cursor: pointer;
      transition: all 0.15s;
      user-select: none;
      text-transform: uppercase;
    }
    .cmd-skill-chip:hover,
    .cmd-skill-chip.selected {
      border-color: #e8c840;
      color: #e8c840;
      background: rgba(184,150,40,0.08);
    }

    /* ── SUPPORT & LINKS ── */
    .cmd-link-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid rgba(184,150,40,0.1);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .cmd-link-card:hover .cmd-link-title { color: #e8c840; text-shadow: 0 0 8px rgba(184,150,40,0.5); }
    .cmd-link-icon {
      font-size: 28px;
      min-width: 36px;
      text-align: center;
      color: rgba(184,150,40,0.5);
    }
    .cmd-link-info { flex: 1; }
    .cmd-link-title {
      font-size: 20px;
      color: rgba(184,150,40,0.8);
      letter-spacing: 0.1em;
      transition: color 0.2s, text-shadow 0.2s;
    }
    .cmd-link-desc {
      font-size: 13px;
      color: rgba(184,150,40,0.6);
      letter-spacing: 0.15em;
      margin-top: 2px;
    }
    .cmd-link-arrow {
      font-size: 18px;
      color: rgba(184,150,40,0.2);
      transition: color 0.2s;
    }
    .cmd-link-card:hover .cmd-link-arrow { color: rgba(184,150,40,0.7); }

    .cmd-support-hero {
      text-align: center;
      padding: 28px 0 20px;
      border-bottom: 1px solid rgba(184,150,40,0.1);
      margin-bottom: 20px;
    }
    .cmd-support-headline {
      font-size: clamp(22px,5vw,36px);
      color: rgba(184,150,40,0.9);
      letter-spacing: 0.2em;
      margin-bottom: 8px;
    }
    .cmd-support-sub {
      font-size: 14px;
      color: rgba(184,150,40,0.6);
      letter-spacing: 0.2em;
      line-height: 1.7;
    }
    .cmd-support-btn {
      display: inline-block;
      margin-top: 20px;
      font-family: 'VT323', monospace;
      font-size: 18px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #000;
      background: rgba(184,150,40,0.85);
      padding: 12px 36px;
      text-decoration: none;
      transition: background 0.2s;
    }
    .cmd-support-btn:hover { background: #e8c840; }
  `;
  document.head.appendChild(style);

  // ── BUILD PANEL HTML ────────────────────────────────────────
  const panel = document.createElement("div");
  panel.id = "cmdPanel";
  panel.innerHTML = `
    <div class="cmd-topbar">
      <span class="cmd-prompt-sym">&gt;_</span>
      <span class="cmd-topbar-label">THE ALLIANCE</span>
      <span class="cmd-close" id="cmdClose">×</span>
    </div>
    <div class="cmd-tabs">
      <div class="cmd-tab active" data-mode="contact">CONTACT</div>
      <div class="cmd-tab" data-mode="involve">GET INVOLVED</div>
      <div class="cmd-tab" data-mode="support">SUPPORT</div>
      <div class="cmd-tab" data-mode="links">LINKS</div>
    </div>
    <div class="cmd-body" id="cmdBody"></div>
  `;
  document.body.appendChild(panel);

  // ── STATE ───────────────────────────────────────────────────
  let currentMode = "contact";
  let selectedSkills = [];

  // ── RENDER MODES ────────────────────────────────────────────

  function renderContact() {
    document.getElementById("cmdBody").innerHTML = `
      <div class="cmd-section-label">REACH THE ALLIANCE</div>
      <div class="cmd-form-group">
        <label class="cmd-form-label">YOUR NAME</label>
        <input class="cmd-form-input" id="cf-name" type="text" placeholder="how should we address you" />
      </div>
      <div class="cmd-form-group">
        <label class="cmd-form-label">YOUR EMAIL</label>
        <input class="cmd-form-input" id="cf-email" type="email" placeholder="where should we reply" />
      </div>
      <div class="cmd-form-group">
        <label class="cmd-form-label">TYPE OF MESSAGE</label>
        <select class="cmd-form-select" id="cf-type">
          <option value="">— SELECT —</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Proposal">Proposal</option>
          <option value="I Want to Help">I Want to Help</option>
          <option value="Media">Media / Press</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="cmd-form-group">
        <label class="cmd-form-label">YOUR MESSAGE</label>
        <textarea class="cmd-form-textarea" id="cf-message" placeholder="say what you came to say..."></textarea>
      </div>
      <button class="cmd-form-submit" id="cf-submit">TRANSMIT MESSAGE</button>
    `;
    document.getElementById("cf-submit").addEventListener("click", () => {
      const name = document.getElementById("cf-name").value;
      const email = document.getElementById("cf-email").value;
      const type = document.getElementById("cf-type").value;
      const msg = document.getElementById("cf-message").value;
      if (!email || !msg) {
        document.getElementById("cf-submit").textContent =
          "EMAIL + MESSAGE REQUIRED";
        setTimeout(() => {
          document.getElementById("cf-submit").textContent = "TRANSMIT MESSAGE";
        }, 2000);
        return;
      }
      const subject = encodeURIComponent(
        `[NCE] ${type || "Message"} from ${name || "Visitor"}`,
      );
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nType: ${type}\n\n${msg}`,
      );
      window.open(
        `mailto:info@allianceftf.org?subject=${subject}&body=${body}`,
      );
    });
  }

  function renderInvolve() {
    const skills = [
      "Writer",
      "Designer",
      "Developer",
      "Filmmaker",
      "Researcher",
      "Educator",
      "Musician",
      "Connector",
      "Strategist",
      "Organizer",
      "Other",
    ];
    document.getElementById("cmdBody").innerHTML = `
      <div class="cmd-section-label">FIND YOUR PLACE IN THE WORK</div>
      <p style="font-size:16px;color:rgba(184,150,40,0.55);letter-spacing:0.1em;line-height:1.7;margin-bottom:18px;">
        THE ALLIANCE is built by people who refused to be made brutal.<br>
        If that sounds like you — we could use your skills.
      </p>
      <div class="cmd-form-group">
        <label class="cmd-form-label">WHAT DO YOU BRING</label>
        <div class="cmd-skills-grid" id="skills-grid">
          ${skills.map((s) => `<div class="cmd-skill-chip" data-skill="${s}">${s}</div>`).join("")}
        </div>
      </div>
      <div class="cmd-form-group">
        <label class="cmd-form-label">YOUR NAME</label>
        <input class="cmd-form-input" id="iv-name" type="text" placeholder="how should we address you" />
      </div>
      <div class="cmd-form-group">
        <label class="cmd-form-label">YOUR EMAIL</label>
        <input class="cmd-form-input" id="iv-email" type="email" placeholder="where should we reach you" />
      </div>
      <div class="cmd-form-group">
        <label class="cmd-form-label">TELL US MORE (OPTIONAL)</label>
        <textarea class="cmd-form-textarea" id="iv-message" placeholder="what you're about, what you're building, what you want to be part of..." style="min-height:80px;"></textarea>
      </div>
      <button class="cmd-form-submit" id="iv-submit">RAISE YOUR HAND</button>
    `;
    // Skill chip toggle
    document
      .getElementById("skills-grid")
      .querySelectorAll(".cmd-skill-chip")
      .forEach((chip) => {
        chip.addEventListener("click", () => {
          chip.classList.toggle("selected");
          const skill = chip.dataset.skill;
          if (chip.classList.contains("selected")) {
            selectedSkills.push(skill);
          } else {
            selectedSkills = selectedSkills.filter((s) => s !== skill);
          }
        });
      });
    document.getElementById("iv-submit").addEventListener("click", () => {
      const name = document.getElementById("iv-name").value;
      const email = document.getElementById("iv-email").value;
      const msg = document.getElementById("iv-message").value;
      if (!email) {
        document.getElementById("iv-submit").textContent = "EMAIL REQUIRED";
        setTimeout(() => {
          document.getElementById("iv-submit").textContent = "RAISE YOUR HAND";
        }, 2000);
        return;
      }
      const skillStr = selectedSkills.length
        ? selectedSkills.join(", ")
        : "Not specified";
      const subject = encodeURIComponent(
        `[NCE] Volunteer: ${name || "New Volunteer"}`,
      );
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nSkills: ${skillStr}\n\n${msg}`,
      );
      window.open(
        `mailto:info@allianceftf.org?subject=${subject}&body=${body}`,
      );
    });
  }

  function renderSupport() {
    document.getElementById("cmdBody").innerHTML = `
      <div class="cmd-support-hero">
        <div class="cmd-support-headline">SUPPORT THE WORK</div>
        <div class="cmd-support-sub">
          This encyclopedia was built by one person<br>
          working nights and weekends.<br>
          If it meant something to you — here's how to say so.
        </div>
        <a class="cmd-support-btn" href="https://buymeacoffee.com/allianceftf" target="_blank" rel="noopener">
          BUY THE ALLIANCE A COFFEE
        </a>
      </div>
      <div class="cmd-section-label">OTHER WAYS TO HELP</div>
      <div class="cmd-link-card" onclick="document.querySelector('[data-mode=involve]').click()">
        <span class="cmd-link-icon">✦</span>
        <div class="cmd-link-info">
          <div class="cmd-link-title">VOLUNTEER YOUR SKILLS</div>
          <div class="cmd-link-desc">Writers, designers, developers, filmmakers — we need all of it</div>
        </div>
        <span class="cmd-link-arrow">→</span>
      </div>
      <div class="cmd-link-card" onclick="document.querySelector('[data-mode=contact]').click()">
        <span class="cmd-link-icon">◈</span>
        <div class="cmd-link-info">
          <div class="cmd-link-title">SEND A PROPOSAL</div>
          <div class="cmd-link-desc">Have an idea that could move the work forward? Say so.</div>
        </div>
        <span class="cmd-link-arrow">→</span>
      </div>
    `;
  }

  function renderLinks() {
    document.getElementById("cmdBody").innerHTML = `
      <div class="cmd-section-label">BEYOND THE ENCYCLOPEDIA</div>
      <a class="cmd-link-card" href="https://notebooklm.google.com" target="_blank" rel="noopener">
        <span class="cmd-link-icon">◎</span>
        <div class="cmd-link-info">
          <div class="cmd-link-title">AUDIO OVERVIEW — THE ALLIANCE</div>
          <div class="cmd-link-desc">Listen to the NCE explained — NotebookLM deep dive</div>
        </div>
        <span class="cmd-link-arrow">↗</span>
      </a>
      <div class="cmd-link-card" style="cursor:default;opacity:0.4;">
        <span class="cmd-link-icon">▣</span>
        <div class="cmd-link-info">
          <div class="cmd-link-title">THE CROSSWORD — COMING SOON</div>
          <div class="cmd-link-desc">The world's hardest NCE crossword puzzle · Newsletter exclusive</div>
        </div>
        <span class="cmd-link-arrow">—</span>
      </div>
      <div class="cmd-link-card" style="cursor:default;opacity:0.4;">
        <span class="cmd-link-icon">◉</span>
        <div class="cmd-link-info">
          <div class="cmd-link-title">THE NEWSLETTER — COMING SOON</div>
          <div class="cmd-link-desc">Updates from THE CORE · First to know when things move</div>
        </div>
        <span class="cmd-link-arrow">—</span>
      </div>
    `;
  }

  // ── MODE SWITCHING ───────────────────────────────────────────
  function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll(".cmd-tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.mode === mode);
    });
    if (mode === "contact") renderContact();
    if (mode === "involve") renderInvolve();
    if (mode === "support") renderSupport();
    if (mode === "links") renderLinks();
  }

  panel.querySelectorAll(".cmd-tab").forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.mode));
  });

  // ── OPEN / CLOSE ────────────────────────────────────────────
  // Tracks whether this panel pushed its own history entry when it
  // opened. Without this, the browser back button had nothing to
  // "undo" for the command panel -- it skipped straight past closing
  // it to whatever page preceded landing in history (reported: back
  // from inside the command prompt was landing on THE SYSTEM instead
  // of closing back to landing). Same fix pattern already applied to
  // the hub menu (hub-menu.js) and the TOC boot sequence (toc.js's
  // own openTOCInteractive) earlier this session.
  let cmdPushedState = false;

  function openCommand() {
    panel.style.display = "flex";
    if (!cmdPushedState) {
      history.pushState({ cmdOpen: true }, "", "/landing?cmd=open");
      cmdPushedState = true;
    }
    // Double rAF ensures the panel is painted before we try to write to cmdBody
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.classList.add("open");
        setMode("contact");
      });
    });
  }

  function closeCommand() {
    hideCommandPanel();
    // Closed via the X button or Escape rather than the back button --
    // pop the history entry we pushed on open so it doesn't linger as
    // a dead step the next time the visitor actually presses back.
    if (cmdPushedState) {
      cmdPushedState = false;
      history.back();
    }
  }

  // Separate from closeCommand() so it can run without the
  // history.back() that closeCommand() does right after it -- not
  // currently exercised elsewhere since navigateTo (which used to
  // call this on its own, ahead of a page navigation) was removed
  // along with SEARCH mode, but kept as its own function since a
  // future mode could plausibly want the same "close without
  // touching history" behavior.
  function hideCommandPanel() {
    panel.classList.remove("open");
    setTimeout(() => {
      panel.style.display = "none";
    }, 260);
    cmdPushedState = false;
  }

  // A pushed command-panel state was popped by the browser back
  // button: close the panel in place rather than letting the
  // navigation continue past it to whatever page preceded landing.
  window.addEventListener("popstate", (e) => {
    if (cmdPushedState && (!e.state || !e.state.cmdOpen)) {
      cmdPushedState = false;
      closeCommand();
    }
  });

  document.getElementById("cmdClose").addEventListener("click", closeCommand);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) closeCommand();
  });

  // ── EXPOSE GLOBALLY ─────────────────────────────────────────
  window.openCommand = openCommand;
  window.closeCommand = closeCommand;
})();
