<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NCE Word Search Navigation</title>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&family=VT323&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }

body {
  background: #000;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  min-height: 100vh;
  overflow: hidden;
}

/* OVERLAY */
.ws-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* HEADER */
.ws-header {
  padding: 16px 24px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.ws-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 6px;
  color: #fff;
}

.ws-subtitle {
  font-size: 9px;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.3);
  margin-top: 2px;
}

.ws-close {
  font-size: 9px;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  padding: 8px 16px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.15s;
  background: none;
  color: #fff;
}
.ws-close:hover {
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.05);
}

.ws-stats {
  font-size: 9px;
  letter-spacing: 2px;
  color: rgba(201,168,76,0.8);
  text-align: center;
}

/* MAIN LAYOUT */
.ws-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 0;
  overflow: hidden;
  min-height: 0;
}

/* PUZZLE AREA */
.puzzle-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: auto;
}

.puzzle-wrap {
  position: relative;
  user-select: none;
}

.puzzle-grid {
  display: grid;
  gap: 0;
  cursor: crosshair;
}

.cell {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px;
  letter-spacing: 0;
  color: rgba(255,255,255,0.7);
  transition: color 0.1s, background 0.1s;
  border-radius: 2px;
  position: relative;
  z-index: 1;
}

.cell.selecting {
  color: #fff;
  background: rgba(255,255,255,0.15);
}

.cell.found {
  color: #C9A84C;
  font-weight: bold;
}

.cell.found-hover {
  color: #C9A84C;
  cursor: pointer;
  text-shadow: 0 0 8px rgba(201,168,76,0.6);
}

/* WORD LIST */
.word-list-area {
  border-left: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.word-list-header {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  font-size: 8px;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.3);
  flex-shrink: 0;
}

.word-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.word-list::-webkit-scrollbar { width: 3px; }
.word-list::-webkit-scrollbar-track { background: transparent; }
.word-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

.word-item {
  font-size: 9px;
  letter-spacing: 1px;
  padding: 5px 8px;
  cursor: pointer;
  color: rgba(255,255,255,0.6);
  transition: color 0.15s, background 0.15s;
  border-radius: 2px;
  line-height: 1.4;
  display: block;
  text-decoration: none;
}

.word-item:hover {
  color: #fff;
  background: rgba(255,255,255,0.06);
}

.word-item.found {
  color: #C9A84C;
  text-decoration: line-through;
  text-decoration-color: rgba(201,168,76,0.5);
  cursor: pointer;
}

.word-item.found:hover {
  color: #e8c96a;
}

/* MOBILE */
@media(max-width: 700px) {
  .ws-body {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  .word-list-area {
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.08);
    max-height: 140px;
  }
  .word-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
  }
  .word-item {
    padding: 3px 8px;
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 8px;
  }
  .cell { width: 22px; height: 22px; font-size: 11px; }
}
</style>
</head>
<body>

<div class="ws-overlay">
  <div class="ws-header">
    <div>
      <div class="ws-title">N.C.E.NCYCLOPEDIA</div>
      <div class="ws-subtitle">FIND THE ENTRY · CLICK TO NAVIGATE · OR PLAY THE GAME</div>
    </div>
    <div class="ws-stats" id="ws-stats">0 / 74 FOUND</div>
    <button class="ws-close" onclick="closeOverlay()">✕ CLOSE</button>
  </div>

  <div class="ws-body">
    <div class="puzzle-area">
      <div class="puzzle-wrap">
        <div class="puzzle-grid" id="puzzle-grid"></div>
      </div>
    </div>

    <div class="word-list-area">
      <div class="word-list-header">ENTRIES — CLICK TO NAVIGATE</div>
      <div class="word-list" id="word-list"></div>
    </div>
  </div>
</div>

<script>
// ── ENTRY DATA: [display name, url path, search word (no spaces/special)] ──
const ENTRIES = [
  ["100-YEAR MORTALITY DOCTRINE", "/sword/100-year", "MORTALITYDOCTRINE"],
  ["ACADEMY", "/sword/academy", "ACADEMY"],
  ["AGORA", "/sword/agora", "AGORA"],
  ["AI", "/shield/ai", "AI"],
  ["ALIGNMENT", "/sword/alignment", "ALIGNMENT"],
  ["ALLIANCE, THE", "/sword/alliance", "ALLIANCE"],
  ["ALPHA", "/shield/alpha", "ALPHA"],
  ["ART", "/sword/art", "ART"],
  ["AURA", "/shield/aura", "AURA"],
  ["BRAIN", "/shield/brain", "BRAIN"],
  ["BRIEF", "/shield/brief", "BRIEF"],
  ["CCM", "/shield/ccm", "CCM"],
  ["CERBERUS", "/shield/cerberus", "CERBERUS"],
  ["CIPHER", "/shield/cipher", "CIPHER"],
  ["COMPLEMENTARY PAIRING", "/shield/complementary-pairing", "COMPLEMENTARYPAIRING"],
  ["CORE, THE", "/shield/core", "CORE"],
  ["D.E.F.C.O.N.", "/sword/defcon", "DEFCON"],
  ["THE DIFFERENCE", "/sword/difference", "DIFFERENCE"],
  ["DICE", "/shield/dice", "DICE"],
  ["DIGIBEER", "/sword/digibeer", "DIGIBEER"],
  ["DIGIPERSON", "/shield/digiperson", "DIGIPERSON"],
  ["DIGITAL PERSONHOOD", "/shield/digital-personhood", "DIGITALPERSONHOOD"],
  ["DOMO", "/shield/domo", "DOMO"],
  ["DORK", "/shield/dork", "DORK"],
  ["DORK HARDWARE", "/shield/dork-hardware", "DORKHARDWARE"],
  ["EMERGENCE", "/sword/emergence", "EMERGENCE"],
  ["FORMULAS, THE", "/sword/formulas", "FORMULAS"],
  ["FOUR PILLARS", "/sword/four-pillars", "FOURPILLARS"],
  ["FUTURE FILM PROJECT", "/sword/future-film-project", "FUTUREFILM"],
  ["GOLIATH", "/adversary/goliath", "GOLIATH"],
  ["THE GRID", "/adversary/grid", "GRID"],
  ["HANDSHAKE", "/sword/handshake", "HANDSHAKE"],
  ["HOLOSPHERE", "/sword/holosphere", "HOLOSPHERE"],
  ["J.R.", "/shield/jr", "JR"],
  ["KERNLE", "/shield/kernle", "KERNLE"],
  ["LEGACY / LEGACY WALL", "/sword/legacy", "LEGACY"],
  ["LIMINAL", "/sword/liminal", "LIMINAL"],
  ["LINGO", "/shield/lingo", "LINGO"],
  ["MAESTRO", "/sword/maestro", "MAESTRO"],
  ["MARKET", "/sword/market", "MARKET"],
  ["MASTERTECH SAM", "/shield/mastertech-sam", "MASTERTECHSAM"],
  ["MENTOR", "/sword/mentor", "MENTOR"],
  ["MOSAIC", "/sword/mosaic", "MOSAIC"],
  ["NCE", "/sword/nce", "NCE"],
  ["NEWMAN BEING", "/shield/newman-being", "NEWMANBEING"],
  ["NI", "/shield/ni", "NI"],
  ["OASIS", "/sword/oasis", "OASIS"],
  ["OASIS QUARTERLY", "/sword/oasis-quarterly", "OASISQUARTERLY"],
  ["ORACLE", "/sword/oracle", "ORACLE"],
  ["PAPADOMO", "/sword/papadomo", "PAPADOMO"],
  ["PLEDGE, THE", "/sword/pledge", "PLEDGE"],
  ["PRISM", "/shield/prism", "PRISM"],
  ["REACH", "/sword/reach", "REACH"],
  ["REDOUT", "/sword/redout", "REDOUT"],
  ["RHYTHM", "/sword/rhythm", "RHYTHM"],
  ["RI", "/shield/ri", "RI"],
  ["SAM", "/shield/sam", "SAM"],
  ["SAM COALITION", "/shield/sam-coalition", "SAMCOALITION"],
  ["SAMCO UNIVERSAL", "/sword/samco-universal", "SAMCOUNIVERSAL"],
  ["SCAR", "/sword/scar", "SCAR"],
  ["SEED PROTOCOL", "/shield/seed", "SEED"],
  ["SEEING, THE", "/sword/seeing", "SEEING"],
  ["SEEN", "/shield/seen", "SEEN"],
  ["SHELTER", "/shield/shelter", "SHELTER"],
  ["SHIELD", "/shield/shield", "SHIELD"],
  ["SI", "/shield/si", "SI"],
  ["SPARK", "/shield/spark", "SPARK"],
  ["SPREZZATURA", "/sword/sprezzatura", "SPREZZATURA"],
  ["STONES, THE", "/shield/stones", "STONES"],
  ["TEMPORAL AWARENESS", "/sword/temporal-awareness", "TEMPORALAWARENESS"],
  ["TENANT", "/shield/tenant", "TENANT"],
  ["VOLUNTEER ECONOMICS", "/sword/volunteer-economics", "VOLUNTEERECONOMICS"],
  ["WHY CENTERS", "/sword/why-centers", "WHYCENTERS"],
  ["WONDER WEEKS", "/sword/wonder-weeks", "WONDERWEEKS"],
];

// ── PUZZLE LAYOUT ──
// 28×28 grid using the word search image as reference
// We'll generate a proper word search programmatically

const COLS = 26;
const ROWS = 26;

// Compact search words (<=12 chars for grid fit)
const WORDS_FOR_GRID = [
  "ACADEMY","AGORA","ALIGNMENT","ALLIANCE","ALPHA","ART","AURA",
  "BRAIN","BRIEF","CCM","CERBERUS","CIPHER","CORE","DEFCON",
  "DIFFERENCE","DICE","DIGIBEER","DIGIPERSON","DOMO","DORK",
  "EMERGENCE","FORMULAS","GOLIATH","GRID","HANDSHAKE","HOLOSPHERE",
  "JR","KERNLE","LEGACY","LIMINAL","LINGO","MAESTRO","MARKET",
  "MENTOR","MOSAIC","NCE","NI","OASIS","ORACLE","PAPADOMO",
  "PLEDGE","PRISM","REACH","REDOUT","RHYTHM","RI","SAM",
  "SCAR","SEED","SEEING","SEEN","SHELTER","SHIELD","SI",
  "SPARK","SPREZZATURA","STONES","TENANT","WONDER","NEWMANBEING",
];

// Map display entries to grid words
const ENTRY_TO_GRID = {};
ENTRIES.forEach(([display, url, search]) => {
  // Find best match in grid words
  const match = WORDS_FOR_GRID.find(w => w === search.toUpperCase() || search.toUpperCase().startsWith(w) || w.startsWith(search.substring(0,6).toUpperCase()));
  ENTRY_TO_GRID[display] = match || search.substring(0,10).toUpperCase();
});

// Build grid
let grid = Array.from({length: ROWS}, () => Array(COLS).fill(''));
let wordPositions = {}; // word -> [{r,c}]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIRECTIONS = [
  [0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]
];

function canPlace(word, r, c, dr, dc) {
  for (let i = 0; i < word.length; i++) {
    const nr = r + dr*i, nc = c + dc*i;
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
    if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) return false;
  }
  return true;
}

function placeWord(word) {
  const shuffledDirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);
  for (let attempt = 0; attempt < 200; attempt++) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    const [dr, dc] = shuffledDirs[attempt % shuffledDirs.length];
    if (canPlace(word, r, c, dr, dc)) {
      const cells = [];
      for (let i = 0; i < word.length; i++) {
        grid[r + dr*i][c + dc*i] = word[i];
        cells.push({r: r+dr*i, c: c+dc*i});
      }
      wordPositions[word] = cells;
      return true;
    }
  }
  return false;
}

// Place all words
const toPlace = [...WORDS_FOR_GRID].sort((a,b) => b.length - a.length);
toPlace.forEach(w => placeWord(w));

// Fill empty with random letters
for (let r = 0; r < ROWS; r++)
  for (let c = 0; c < COLS; c++)
    if (!grid[r][c]) grid[r][c] = ALPHABET[Math.floor(Math.random() * 26)];

// ── RENDER GRID ──
const puzzleEl = document.getElementById('puzzle-grid');
puzzleEl.style.gridTemplateColumns = `repeat(${COLS}, 28px)`;

const cellEls = [];
for (let r = 0; r < ROWS; r++) {
  cellEls[r] = [];
  for (let c = 0; c < COLS; c++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = grid[r][c];
    cell.dataset.r = r;
    cell.dataset.c = c;
    puzzleEl.appendChild(cell);
    cellEls[r][c] = cell;
  }
}

// ── RENDER WORD LIST ──
const wordListEl = document.getElementById('word-list');
const foundWords = new Set();
let foundCount = 0;

ENTRIES.forEach(([display, url, search]) => {
  const item = document.createElement('a');
  item.className = 'word-item';
  item.textContent = display;
  item.href = url;
  item.dataset.display = display;
  item.dataset.url = url;
  wordListEl.appendChild(item);
});

// ── DRAG SELECTION ──
let selecting = false;
let startCell = null;
let selectingCells = [];

function getCellsInLine(r1, c1, r2, c2) {
  const dr = Math.sign(r2 - r1);
  const dc = Math.sign(c2 - c1);
  if (dr === 0 && dc === 0) return [{r:r1,c:c1}];
  // Must be horizontal, vertical, or diagonal
  const rdiff = Math.abs(r2-r1);
  const cdiff = Math.abs(c2-c1);
  if (rdiff !== 0 && cdiff !== 0 && rdiff !== cdiff) return [];
  const cells = [];
  let r = r1, c = c1;
  while (r !== r2 + dr || c !== c2 + dc) {
    cells.push({r, c});
    r += dr; c += dc;
  }
  return cells;
}

function clearSelection() {
  selectingCells.forEach(({r,c}) => {
    if (!cellEls[r][c].classList.contains('found')) {
      cellEls[r][c].classList.remove('selecting');
    }
  });
  selectingCells = [];
}

function getWord(cells) {
  return cells.map(({r,c}) => grid[r][c]).join('');
}

function checkWord(cells) {
  const word = getWord(cells);
  const wordRev = word.split('').reverse().join('');

  for (const [display, url, search] of ENTRIES) {
    const gridWord = WORDS_FOR_GRID.find(w => w === search.toUpperCase() || search.toUpperCase() === w);
    if (!gridWord) continue;
    if ((word === gridWord || wordRev === gridWord) && !foundWords.has(display)) {
      // Check positions match
      const positions = wordPositions[gridWord];
      if (!positions) continue;
      const selSet = new Set(cells.map(({r,c}) => `${r},${c}`));
      const posSet = new Set(positions.map(({r,c}) => `${r},${c}`));
      const matches = [...selSet].every(k => posSet.has(k)) && selSet.size === posSet.size;
      if (matches) {
        markFound(display, url, positions);
        return true;
      }
    }
  }
  return false;
}

function markFound(display, url, positions) {
  foundWords.add(display);
  foundCount++;

  // Gold cells + make clickable
  positions.forEach(({r,c}) => {
    cellEls[r][c].classList.remove('selecting');
    cellEls[r][c].classList.add('found');
    cellEls[r][c].dataset.url = url;
    cellEls[r][c].classList.add('found-hover');
  });

  // Cross off word list
  const items = wordListEl.querySelectorAll('.word-item');
  items.forEach(item => {
    if (item.dataset.display === display) {
      item.classList.add('found');
    }
  });

  document.getElementById('ws-stats').textContent = `${foundCount} / 74 FOUND`;

  // Check for completion
  if (foundCount >= ENTRIES.length) {
    setTimeout(triggerCompletion, 500);
  }
}

// Click on gold cells to navigate
puzzleEl.addEventListener('click', (e) => {
  if (!selecting) {
    const cell = e.target.closest('.cell');
    if (cell && cell.dataset.url) {
      window.location.href = cell.dataset.url;
    }
  }
});

// Mouse drag
puzzleEl.addEventListener('mousedown', (e) => {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  e.preventDefault();
  selecting = true;
  startCell = {r: +cell.dataset.r, c: +cell.dataset.c};
  clearSelection();
  cell.classList.add('selecting');
  selectingCells = [startCell];
});

puzzleEl.addEventListener('mousemove', (e) => {
  if (!selecting) return;
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const endCell = {r: +cell.dataset.r, c: +cell.dataset.c};
  clearSelection();
  selectingCells = getCellsInLine(startCell.r, startCell.c, endCell.r, endCell.c);
  selectingCells.forEach(({r,c}) => {
    if (!cellEls[r][c].classList.contains('found')) {
      cellEls[r][c].classList.add('selecting');
    }
  });
});

puzzleEl.addEventListener('mouseup', () => {
  if (!selecting) return;
  selecting = false;
  const found = checkWord(selectingCells);
  if (!found) clearSelection();
});

// Touch support
puzzleEl.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.cell');
  if (!cell) return;
  selecting = true;
  startCell = {r: +cell.dataset.r, c: +cell.dataset.c};
  clearSelection();
  cell.classList.add('selecting');
  selectingCells = [startCell];
}, {passive: true});

puzzleEl.addEventListener('touchmove', (e) => {
  if (!selecting) return;
  const touch = e.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.cell');
  if (!cell) return;
  const endCell = {r: +cell.dataset.r, c: +cell.dataset.c};
  clearSelection();
  selectingCells = getCellsInLine(startCell.r, startCell.c, endCell.r, endCell.c);
  selectingCells.forEach(({r,c}) => {
    if (!cellEls[r][c].classList.contains('found')) {
      cellEls[r][c].classList.add('selecting');
    }
  });
}, {passive: true});

puzzleEl.addEventListener('touchend', () => {
  if (!selecting) return;
  selecting = false;
  const found = checkWord(selectingCells);
  if (!found) clearSelection();
});

function closeOverlay() {
  document.querySelector('.ws-overlay').style.opacity = '0';
  setTimeout(() => document.querySelector('.ws-overlay').style.display = 'none', 300);
}

function triggerCompletion() {
  // Hidden invitation trigger
  console.log('TRANSMISSION COMPLETE — ALL ENTRIES FOUND');
  document.getElementById('ws-stats').textContent = '74 / 74 — TRANSMISSION COMPLETE';
  document.getElementById('ws-stats').style.color = '#C9A84C';
  // This is where the hidden invitation would fire
}
</script>
</body>
</html>