/**
 * THE ALLIANCE Canon Search Core Engine
 * Handcrafted static matching engine with precomputed semantic vector-synonym layers.
 */

let searchIndex = null;
let currentMode = 'literal'; // 'literal' or 'semantic'

// DOM Elements
const searchInput = document.getElementById('search-input');
const tabLiteral = document.getElementById('tab-literal');
const tabSemantic = document.getElementById('tab-semantic');
const explanationText = document.getElementById('explanation-text');
const resultsContainer = document.getElementById('results-container');
const clearBtn = document.getElementById('clear-btn');
const docCountLoading = document.getElementById('doc-count-loading');
const semanticDot = document.getElementById('semantic-dot');

// Initialize App
async function init() {
  try {
    const response = await fetch('canon-index.json');
    if (!response.ok) {
      throw new Error('Failed to load canon index file.');
    }
    searchIndex = await response.json();
    
    // Update doc count
    const totalDocs = searchIndex.documents.length;
    docCountLoading.textContent = `ONLINE [${totalDocs} FILES LOADED]`;
    docCountLoading.className = 'text-cyberCyan font-bold';
    
    // Wire up events
    searchInput.addEventListener('input', handleSearch);
    clearBtn.addEventListener('click', clearSearch);
    
    tabLiteral.addEventListener('click', () => setMode('literal'));
    tabSemantic.addEventListener('click', () => setMode('semantic'));
    
    // Enable search
    searchInput.disabled = false;
    searchInput.focus();
    
    renderResults([]); // Standby mode
    
  } catch (error) {
    console.error('Initialization error:', error);
    docCountLoading.textContent = 'DATABASE ERROR';
    docCountLoading.className = 'text-red-500 font-bold';
    resultsContainer.innerHTML = `
      <div class="text-red-500 border border-red-950 bg-red-950/10 p-4 rounded font-mono text-sm">
        [ERROR] Failed to load canon-index.json database file. Make sure index.html, search.js and canon-index.json are in the same folder.
      </div>
    `;
  }
}

function setMode(mode) {
  currentMode = mode;
  
  if (mode === 'literal') {
    tabLiteral.className = 'px-4 py-2 font-mono text-sm uppercase flex items-center space-x-2 border border-cyberCyan bg-cyan-950/40 text-cyberCyan glow-cyan transition-all duration-200';
    tabSemantic.className = 'px-4 py-2 font-mono text-sm uppercase flex items-center space-x-2 border border-transparent hover:border-cyan-800 text-cyan-600 hover:text-cyberCyan transition-all duration-200';
    semanticDot.className = 'w-2 h-2 bg-transparent border border-cyan-800 rounded-full';
    explanationText.textContent = 'EXACT MATCHING: Finds literal words, phrases, or codenames anywhere in canon.';
    searchInput.placeholder = "ENTER QUERY FOR WORD-FOR-WORD TEXT SEARCH (E.G. 'REDOUT', 'CIPHER')...";
  } else {
    tabSemantic.className = 'px-4 py-2 font-mono text-sm uppercase flex items-center space-x-2 border border-cyberAmber bg-amber-950/40 text-cyberAmber glow-amber-active transition-all duration-200';
    tabLiteral.className = 'px-4 py-2 font-mono text-sm uppercase flex items-center space-x-2 border border-transparent hover:border-cyan-800 text-cyan-600 hover:text-cyberCyan transition-all duration-200';
    semanticDot.className = 'w-2 h-2 bg-cyberAmber rounded-full';
    explanationText.textContent = 'SEMANTIC CONCEPT: Matches underlying ideas or user questions (e.g. searching "leaving partner" finds REDOUT & Uncounted Sentence).';
    searchInput.placeholder = "ENTER CONCEPT OR PROBLEM STATEMENT (E.G. 'WHAT IF MY PARTNER LEAVES')...";
  }
  
  handleSearch();
}

function clearSearch() {
  searchInput.value = '';
  clearBtn.classList.add('hidden');
  handleSearch();
  searchInput.focus();
}

function handleSearch() {
  const query = searchInput.value.trim();
  
  if (!query) {
    clearBtn.classList.add('hidden');
    renderResults([]);
    return;
  }
  
  clearBtn.classList.remove('hidden');
  
  if (currentMode === 'literal') {
    performLiteralSearch(query);
  } else {
    performSemanticSearch(query);
  }
}

// 1. Literal Word-for-Word Search Engine
function performLiteralSearch(query) {
  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return;
  
  const results = [];
  const queryRegex = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');

  for (const doc of searchIndex.documents) {
    const textLower = doc.content.toLowerCase();
    const titleLower = doc.title.toLowerCase();
    
    let matchScore = 0;
    let matchSnippet = "";
    let rawMatchedText = "";
    
    // Check for exact phrase first (gives highest priority)
    const exactPhraseIndex = textLower.indexOf(query.toLowerCase());
    if (exactPhraseIndex !== -1) {
      matchScore += 100;
      
      // Extract snippet around the exact phrase match
      const start = Math.max(0, exactPhraseIndex - 60);
      const end = Math.min(doc.content.length, exactPhraseIndex + query.length + 100);
      let snippet = doc.content.substring(start, end);
      if (start > 0) snippet = "..." + snippet;
      if (end < doc.content.length) snippet = snippet + "...";
      
      // Highlight the query phrase in the snippet
      matchSnippet = highlightText(snippet, query);
      // Raw (unhighlighted) matched text — used to build the deep-link
      // Text Fragment. Keep it short (a few words); very long fragments
      // are less reliable for the browser to locate on the page.
      rawMatchedText = doc.content.substring(exactPhraseIndex, exactPhraseIndex + query.length);
    } else {
      // Check for partial keyword matches
      let matchedWordsCount = 0;
      queryWords.forEach(word => {
        if (textLower.includes(word)) {
          matchedWordsCount++;
          matchScore += 10;
        }
        if (titleLower.includes(word)) {
          matchScore += 30; // Title match bonus
        }
      });
      
      if (matchedWordsCount > 0) {
        // Find the first matching word and build a snippet around it
        let firstMatchIndex = -1;
        for (const word of queryWords) {
          const idx = textLower.indexOf(word);
          if (idx !== -1) {
            firstMatchIndex = idx;
            break;
          }
        }
        
        if (firstMatchIndex !== -1) {
          const start = Math.max(0, firstMatchIndex - 60);
          const end = Math.min(doc.content.length, firstMatchIndex + 120);
          let snippet = doc.content.substring(start, end);
          if (start > 0) snippet = "..." + snippet;
          if (end < doc.content.length) snippet = snippet + "...";
          
          // Highlight all matched keywords in the snippet
          let highlighted = snippet;
          queryWords.forEach(word => {
            highlighted = highlightText(highlighted, word);
          });
          matchSnippet = highlighted;
          // Short surrounding phrase (not just the single matched word) —
          // more reliable for the browser to locate uniquely on the page
          // than one common word by itself.
          const fragEnd = Math.min(doc.content.length, firstMatchIndex + 40);
          rawMatchedText = doc.content.substring(firstMatchIndex, fragEnd).trim();
        }
      }
    }
    
    if (matchScore > 0) {
      results.push({
        doc,
        score: matchScore,
        snippet: matchSnippet || doc.content.substring(0, 150) + "...",
        matchedText: rawMatchedText,
        type: 'exact'
      });
    }
  }
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  renderResults(results, query);
}

// Helper to escape and highlight matching text
function highlightText(text, term) {
  if (!term || !text) return text;
  // Escape regex specials
  const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// 2. Client-side Precomputed Concept / Semantic Match Engine
function performSemanticSearch(query) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(Boolean);
  const results = [];
  
  for (const doc of searchIndex.documents) {
    let semanticScore = 0;
    let matchTypeNotes = [];
    
    // Check Precomputed Questions (highest semantic weight)
    if (doc.questions && doc.questions.length > 0) {
      doc.questions.forEach(q => {
        const qLower = q.toLowerCase();
        
        // Check for exact substring match first
        if (qLower.includes(queryLower) || queryLower.includes(qLower)) {
          semanticScore += 80;
          matchTypeNotes.push("Direct question matching");
        } else {
          // Check for keyword overlaps in question list
          let wordOverlap = 0;
          queryWords.forEach(word => {
            if (qLower.includes(word)) {
              wordOverlap++;
            }
          });
          if (wordOverlap > 0) {
            semanticScore += (wordOverlap / queryWords.length) * 40;
            matchTypeNotes.push("Concept intersection: " + q);
          }
        }
      });
    }
    
    // Check Precomputed Concepts / Tag list
    if (doc.concepts && doc.concepts.length > 0) {
      doc.concepts.forEach(concept => {
        const cLower = concept.toLowerCase();
        if (cLower.includes(queryLower) || queryLower.includes(cLower)) {
          semanticScore += 50;
          matchTypeNotes.push("Core concept match");
        } else {
          queryWords.forEach(word => {
            if (cLower.includes(word)) {
              semanticScore += 15;
            }
          });
        }
      });
    }
    
    // Check Precomputed Synonyms list
    if (doc.synonyms && doc.synonyms.length > 0) {
      doc.synonyms.forEach(synonym => {
        const sLower = synonym.toLowerCase();
        if (sLower.includes(queryLower) || queryLower.includes(sLower)) {
          semanticScore += 40;
          matchTypeNotes.push("Alternate term match");
        } else {
          queryWords.forEach(word => {
            if (sLower.includes(word)) {
              semanticScore += 10;
            }
          });
        }
      });
    }
    
    // Title match fallback in semantic search
    if (doc.title.toLowerCase().includes(queryLower)) {
      semanticScore += 30;
      matchTypeNotes.push("Title relevance");
    }

    if (semanticScore > 0) {
      // Pick unique notes
      const uniqueNotes = [...new Set(matchTypeNotes)].slice(0, 2);
      const relevanceSummary = uniqueNotes.length > 0 
        ? "Concept: " + uniqueNotes.join(" / ")
        : "Matches general canon context of this entry.";
        
      results.push({
        doc,
        score: Math.min(100, Math.round(semanticScore)),
        snippet: relevanceSummary,
        type: 'semantic'
      });
    }
  }
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  renderResults(results, query);
}

// Render Results to UI
function renderResults(results, query = "") {
  if (results.length === 0) {
    if (!query) {
      resultsContainer.innerHTML = `
        <div class="text-center py-16 text-cyan-900 border border-dashed border-cyan-950 rounded-lg bg-black/10">
          <div class="font-mono mb-2 animate-pulse">SYSTEM STANDBY</div>
          <div class="text-xs font-mono">READY TO ANALYZE INCOMING QUERY STRINGS</div>
        </div>
      `;
    } else {
      resultsContainer.innerHTML = `
        <div class="text-center py-16 text-cyan-700/60 border border-dashed border-cyan-950 rounded-lg bg-black/20 font-mono">
          <div class="text-lg mb-2">⚠ NO RECON CORRELATION DETECTED</div>
          <div class="text-xs max-w-md mx-auto">
            Zero direct or semantic matches found in any canon documents for query: <span class="text-cyberCyan">"${escapeHtml(query)}"</span>.
          </div>
        </div>
      `;
    }
    return;
  }
  
  let html = `
    <div class="font-mono text-xs text-cyan-700 mb-4 uppercase flex justify-between">
      <span>CORRELATIONS: ${results.length} RECORD(S) RETRIEVED</span>
      <span>MODE: ${currentMode.toUpperCase()}</span>
    </div>
    <div class="space-y-4">
  `;
  
  results.forEach(({ doc, score, snippet, matchedText, type }) => {
    const liveSiteUrl = doc.url.startsWith('/') 
      ? `https://allianceftf.org${doc.url}` 
      : `https://allianceftf.org/entries/${doc.slug}.html`;

    // Deep-link straight to the matched passage using a Text Fragment
    // (#:~:text=...). Supported by Chrome, Edge, and most Chromium-based
    // browsers — the page auto-scrolls to and highlights that exact text.
    // Not supported by Safari; on unsupported browsers this just loads
    // the page normally at the top, so it degrades gracefully rather
    // than breaking. Only literal/phrase matches have real quoted text
    // to jump to — semantic matches fall back to the plain top-of-page link.
    const deepLinkUrl = matchedText
      ? `${liveSiteUrl}#:~:text=${encodeURIComponent(matchedText)}`
      : liveSiteUrl;
      
    const isSemantic = type === 'semantic';
    const accentColor = isSemantic ? 'border-amber-500/30' : 'border-cyan-500/30';
    const textAccent = isSemantic ? 'text-cyberAmber' : 'text-cyberCyan';
    const barBg = isSemantic ? 'bg-cyberAmber' : 'bg-cyberCyan';
    const badgeBg = isSemantic ? 'bg-amber-950/40 text-cyberAmber border-amber-800' : 'bg-cyan-950/40 text-cyberCyan border-cyan-800';

    html += `
      <div class="bg-terminalBg/80 border ${accentColor} hover:border-cyan-600/60 p-5 rounded-lg transition-all duration-200 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div class="flex-grow space-y-2">
          <!-- Title & Badges -->
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-xl font-orbitron font-bold text-white tracking-wide hover:text-cyberCyan transition-all">
              <a href="${liveSiteUrl}" target="_blank" rel="noopener noreferrer" title="Go to the beginning of this entry">
                ${escapeHtml(doc.title)}
              </a>
            </h3>
            <span class="text-2xs font-mono px-2 py-0.5 rounded border ${badgeBg} uppercase">
              ${isSemantic ? 'Semantic Match' : 'Phrase Match'}
            </span>
            <span class="text-3xs font-mono text-cyan-800">
              ${escapeHtml(doc.filename)}
            </span>
          </div>
          
          <!-- Snippet — clickable straight to the matched passage -->
          <a
            href="${deepLinkUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="block text-sm font-sans text-gray-400 leading-relaxed hover:text-gray-200 transition-colors"
            title="${matchedText ? 'Jump to this exact passage' : 'Go to the beginning of this entry'}"
          >
            ${snippet}
          </a>
          
          <!-- Live Link metadata -->
          <div class="text-3xs font-mono text-cyan-700 select-all truncate">
            URL: ${liveSiteUrl}
          </div>
        </div>
        
        <!-- Score & Navigation Action -->
        <div class="md:w-36 flex md:flex-col items-center justify-between md:justify-center md:text-center md:border-l md:border-cyan-950/50 md:pl-4 shrink-0 gap-3">
          <!-- Matching Index Score -->
          <div class="text-right md:text-center">
            <span class="text-2xs font-mono text-cyan-600 block uppercase">Match Weight</span>
            <span class="text-2xl font-orbitron font-extrabold ${textAccent}">${score}%</span>
            <!-- Progress Bar -->
            <div class="w-20 h-1 bg-cyan-950/60 rounded-full mt-1 overflow-hidden">
              <div class="h-full ${barBg}" style="width: ${score}%"></div>
            </div>
          </div>
          
          <!-- Site Redirect — goes to the beginning of the entry -->
          <a 
            href="${liveSiteUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Go to the beginning of this entry"
            class="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyberCyan hover:text-black border border-cyan-800 hover:border-cyberCyan font-mono text-2xs uppercase tracking-widest text-cyberCyan text-center block transition-all shrink-0"
          >
            LAUNCH ↗
          </a>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  resultsContainer.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Start core engine
init();
