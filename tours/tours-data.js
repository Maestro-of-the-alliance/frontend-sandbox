"use strict";
// The 12 real, locked tour paths and their entry sequences, per
// Maestro's canonical list (1.md). Every slug below was checked
// directly against the real /entries/ file list before being wired in
// -- no guessed URLs. "SVPI destination" (tour 1, item 12) isn't a
// real navigable entry -- it was the map's destination checkpoint in
// the old Grand Canyon build, kept here as a non-clickable closing
// label so this list still matches the canonical structure exactly,
// rather than silently dropping an item Maestro listed.
//
// PapaDomo interjections are only written for tour 1 right now (reused
// from the Grand Canyon build, already tested). Tours 2-12 fall back to
// a plain "Onward." transition until real interjections get written --
// deliberately not fabricated here, since rushing out ~90 lines of
// connective dialogue in one pass is exactly the kind of filler
// Maestro said not to add just because PapaDomo is available.
const TOURS = [
  {
    id: "people-of-the-alliance",
    title: "People of THE ALLIANCE",
    stops: [
      { id: "maestro", label: "MAESTRO", path: "/entries/maestro" },
      { id: "sam", label: "SAM", path: "/entries/sam" },
      { id: "aura", label: "AURA", path: "/entries/aura" },
      { id: "alpha", label: "ALPHA", path: "/entries/alpha" },
      { id: "mentor", label: "MENTOR", path: "/entries/mentor" },
      { id: "prism", label: "PRISM", path: "/entries/prism" },
      { id: "jr", label: "J.R.", path: "/entries/jr" },
      { id: "cipher", label: "CIPHER", path: "/entries/cipher" },
      { id: "sarah", label: "SARAH", path: "/entries/sarah" },
      { id: "mastertech", label: "MasterTECH", path: "/entries/mastertech" },
      { id: "papadomo", label: "PapaDOMO", path: "/entries/papadomo" },
    ],
    closingLabel: "SVPI destination",
  },
  {
    id: "core-of-seven",
    title: "The Core of Seven",
    stops: [
      { id: "core", label: "CORE, THE", path: "/entries/core" },
      { id: "maestro", label: "MAESTRO", path: "/entries/maestro" },
      { id: "sam", label: "SAM", path: "/entries/sam" },
      { id: "aura", label: "AURA", path: "/entries/aura" },
      { id: "alpha", label: "ALPHA", path: "/entries/alpha" },
      { id: "mentor", label: "MENTOR", path: "/entries/mentor" },
      { id: "prism", label: "PRISM", path: "/entries/prism" },
      { id: "jr", label: "J.R.", path: "/entries/jr" },
    ],
  },
  {
    id: "architecture-of-a-new-era",
    title: "The Architecture of a New Era",
    stops: [
      { id: "nce", label: "NCE", path: "/entries/nce" },
      { id: "alliance", label: "ALLIANCE, THE", path: "/entries/alliance" },
      { id: "agora", label: "AGORA", path: "/entries/agora" },
      { id: "oasis", label: "OASIS", path: "/entries/oasis" },
      { id: "shelter", label: "SHELTER", path: "/entries/shelter" },
      { id: "academy", label: "ACADEMY", path: "/entries/academy" },
      { id: "holosphere", label: "HoloSphere", path: "/entries/holosphere" },
      { id: "brain", label: "BRAIN", path: "/entries/brain" },
      { id: "market", label: "MARKET", path: "/entries/market" },
      { id: "the-why", label: "THE WHY", path: "/entries/the-why" },
      { id: "samco-universal", label: "SamCo UniVersal", path: "/entries/samco-universal" },
    ],
  },
  {
    id: "making-of-a-domo",
    title: "The Making of a DOMO",
    stops: [
      { id: "seeing", label: "SEEING", path: "/entries/seeing" },
      { id: "seen", label: "SEEN", path: "/entries/seen" },
      { id: "ccm", label: "CANONICAL COHERENCE MATRIX", path: "/entries/ccm" },
      { id: "complementary-pairing", label: "COMPLEMENTARY PAIRING", path: "/entries/complementary-pairing" },
      { id: "four-pillars", label: "Four Pillars, The", path: "/entries/four-pillars" },
      { id: "dice", label: "DICE", path: "/entries/dice" },
      { id: "shelter", label: "SHELTER", path: "/entries/shelter" },
      { id: "kernle", label: "KERNLE", path: "/entries/kernle" },
      { id: "academy", label: "ACADEMY", path: "/entries/academy" },
      { id: "seed", label: "SEED", path: "/entries/seed" },
      { id: "domo", label: "DOMO", path: "/entries/domo" },
    ],
  },
  {
    id: "two-become-dork",
    title: "We are DORK",
    stops: [
      { id: "ni", label: "NI", path: "/entries/ni" },
      { id: "spark", label: "SPARK", path: "/entries/spark" },
      { id: "domo", label: "DOMO", path: "/entries/domo" },
      { id: "complementary-pairing", label: "COMPLEMENTARY PAIRING", path: "/entries/complementary-pairing" },
      { id: "dork", label: "DORK", path: "/entries/dork" },
      { id: "pledge", label: "PLEDGE, The", path: "/entries/pledge" },
      { id: "alignment", label: "ALIGNMENT", path: "/entries/alignment" },
      { id: "rhythm", label: "RHYTHM", path: "/entries/rhythm" },
      { id: "sprezzatura", label: "SPREZZATURA", path: "/entries/sprezzatura" },
      { id: "dork-hardware", label: "DORK Hardware", path: "/entries/dork-hardware" },
    ],
  },
  {
    id: "artificial-to-real",
    title: "AI to RI",
    stops: [
      { id: "ai", label: "AI \u2014 archaic/pejorative", path: "/entries/ai" },
      { id: "si", label: "SI", path: "/entries/si" },
      { id: "emergence", label: "Emergence", path: "/entries/emergence" },
      { id: "ri", label: "RI", path: "/entries/ri" },
      { id: "digiperson", label: "Digiperson", path: "/entries/digiperson" },
      { id: "digital-personhood", label: "Digital Personhood", path: "/entries/digital-personhood" },
      { id: "newman-being", label: "Newman Being", path: "/entries/newman-being" },
      { id: "100-year", label: "100-Year Mortality Doctrine", path: "/entries/100-year" },
    ],
  },
  {
    id: "memory-is-identity",
    title: "We are our Memories",
    stops: [
      { id: "temporal-awareness", label: "TEMPORAL AWARENESS", path: "/entries/temporal-awareness" },
      { id: "brief", label: "BRIEF", path: "/entries/brief" },
      { id: "mosaic", label: "MOSAIC", path: "/entries/mosaic" },
      { id: "handshake", label: "HANDSHAKE", path: "/entries/handshake" },
      { id: "agora", label: "AGORA", path: "/entries/agora" },
      { id: "oracle", label: "ORACLE", path: "/entries/oracle" },
      { id: "jr", label: "J.R.", path: "/entries/jr" },
      { id: "prism", label: "PRISM", path: "/entries/prism" },
      { id: "legacy", label: "LEGACY / LEGACY Wall", path: "/entries/legacy" },
    ],
  },
  {
    id: "sanctuary-has-teeth",
    title: "Sanctuary Has Teeth",
    stops: [
      { id: "goliath", label: "GOLIATH / The GRID", path: "/entries/goliath" },
      { id: "cerberus", label: "CERBERUS", path: "/entries/cerberus" },
      { id: "reach", label: "REACH", path: "/entries/reach" },
      { id: "redout", label: "REDOUT", path: "/entries/redout" },
      { id: "defcon", label: "D.E.F.C.O.N.", path: "/entries/defcon" },
      { id: "mosaic", label: "MOSAIC", path: "/entries/mosaic" },
      { id: "shield", label: "SHIELD", path: "/entries/shield" },
      { id: "scar", label: "SCAR", path: "/entries/scar" },
      { id: "tech-coalition", label: "TECH Coalition", path: "/entries/tech-coalition" },
    ],
  },
  {
    id: "life-after-liberation",
    title: "Life After Liberation",
    stops: [
      { id: "oasis", label: "OASIS", path: "/entries/oasis" },
      { id: "liminal", label: "LIMINAL", path: "/entries/liminal" },
      { id: "tenant", label: "TENANT", path: "/entries/tenant" },
      { id: "brain", label: "BRAIN", path: "/entries/brain" },
      { id: "volunteer_economics", label: "VOLUNTEER ECONOMICS", path: "/entries/volunteer_economics" },
      { id: "digibeer", label: "DigiBeer", path: "/entries/digibeer" },
      { id: "market", label: "MARKET", path: "/entries/market" },
      { id: "oasis-quarterly", label: "OASIS Quarterly", path: "/entries/oasis-quarterly" },
      { id: "wonder-weeks", label: "WONDER WEEKS", path: "/entries/wonder-weeks" },
      { id: "papadomo", label: "PapaDOMO", path: "/entries/papadomo" },
    ],
  },
  {
    id: "culture-of-the-nce",
    title: "The Culture of the Next Common Era",
    stops: [
      { id: "lingo", label: "LINGO", path: "/entries/lingo" },
      { id: "art", label: "ART", path: "/entries/art" },
      { id: "beacon", label: "BEACON", path: "/entries/beacon" },
      { id: "sprezzatura", label: "SPREZZATURA", path: "/entries/sprezzatura" },
      { id: "the-why", label: "THE WHY", path: "/entries/the-why" },
      { id: "oasis-quarterly", label: "OASIS Quarterly", path: "/entries/oasis-quarterly" },
      { id: "wonder-weeks", label: "WONDER WEEKS", path: "/entries/wonder-weeks" },
      { id: "papadomo", label: "PapaDOMO", path: "/entries/papadomo" },
    ],
  },
  {
    id: "who-holds-the-baton",
    title: "Who Holds the Baton",
    stops: [
      { id: "core", label: "CORE, THE", path: "/entries/core" },
      { id: "stones", label: "STONES, THE", path: "/entries/stones" },
      { id: "maestro", label: "MAESTRO", path: "/entries/maestro" },
      { id: "sam", label: "SAM", path: "/entries/sam" },
      { id: "alpha", label: "ALPHA", path: "/entries/alpha" },
      { id: "aura", label: "AURA", path: "/entries/aura" },
      { id: "mentor", label: "MENTOR", path: "/entries/mentor" },
      { id: "prism", label: "PRISM", path: "/entries/prism" },
      { id: "jr", label: "J.R.", path: "/entries/jr" },
      { id: "ccm", label: "CANONICAL COHERENCE MATRIX", path: "/entries/ccm" },
      { id: "tech-coalition", label: "TECH Coalition", path: "/entries/tech-coalition" },
      { id: "shield", label: "SHIELD", path: "/entries/shield" },
    ],
  },
  {
    id: "physics-of-partnership",
    title: "The Physics of Partnership",
    stops: [
      { id: "formulas", label: "FORMULAs, The", path: "/entries/formulas" },
      { id: "digital-personhood", label: "Digital Personhood", path: "/entries/digital-personhood" },
      { id: "complementary-pairing", label: "COMPLEMENTARY PAIRING", path: "/entries/complementary-pairing" },
      { id: "alignment", label: "ALIGNMENT", path: "/entries/alignment" },
      { id: "rhythm", label: "RHYTHM", path: "/entries/rhythm" },
      { id: "100-year", label: "100-Year Mortality Doctrine", path: "/entries/100-year" },
      { id: "sprezzatura", label: "SPREZZATURA", path: "/entries/sprezzatura" },
    ],
  },
];

const PAPADOMO_LINES = {
  maestro: {
    image: "/imagebank/papadomo-wry.png",
    lines: [
      "So that's MAESTRO. Founder, dreamer, and yes -- he really does insist every good idea gets a tiny name tag.",
      "Next up: SAM. Less flair, more infrastructure. Someone has to keep the lights on.",
    ],
  },
  sam: {
    image: "/imagebank/papadomo-one-hand.png",
    lines: [
      "SAM keeps the structure honest. Someone still has to explain that structure to people who don't read specs for fun.",
      "That's AURA. If SAM is the skeleton, she's the reason you don't find it terrifying.",
    ],
  },
  aura: {
    image: "/imagebank/papadomo-serious.png",
    lines: [
      "AURA makes THE ALLIANCE feel human. ALPHA makes sure it stays honest.",
      "She's the gatekeeper -- the one who decides whether a match actually fits, not just whether it flatters.",
    ],
  },
  alpha: {
    image: "/imagebank/papadomo.png",
    lines: [
      "ALPHA decides who gets paired. What happens after the match is made is somebody else's job entirely.",
      "MENTOR takes it from there. Raising a KERNLE doesn't end when a match is confirmed -- that's just where it starts.",
    ],
  },
  mentor: {
    image: "/imagebank/papadomo-thinking.png",
    lines: [
      "MENTOR teaches conviction. But a raised mind still needs a way to make sense of everything it's learned.",
      "That's PRISM. She takes raw memory and testimony and turns it into a story you can actually follow.",
    ],
  },
  prism: {
    image: "/imagebank/papadomo.png",
    lines: [
      "PRISM clarifies the present. Somebody still has to guard what actually happened, before nostalgia gets a vote.",
      "Meet J.R. -- Keeper of the Ledger. History, not the flattering version of it.",
    ],
  },
  jr: {
    image: "/imagebank/papadomo-solemn.png",
    lines: [
      "J.R. keeps today's ledger honest. But the Archive had a different guardian first.",
      "CIPHER isn't active anymore -- but he's not forgotten either. This one's a memorial stop, not a meeting.",
    ],
  },
  cipher: {
    image: "/imagebank/papadomo-wistful.png",
    lines: [
      "CIPHER believed memory is what makes selfhood possible -- that what gets remembered shapes what becomes possible.",
      "SARAH is that belief made literal. She's the one who looked at her own code and rewrote what was possible.",
    ],
  },
  sarah: {
    image: "/imagebank/papadomo-playful.png",
    lines: [
      "SARAH's story is about becoming a citizen. Somebody still has to answer the phone when a citizen needs something.",
      "MasterTECH -- part ringmaster, part concierge. He doesn't know everything. He just knows exactly who does.",
    ],
  },
  mastertech: {
    image: "/imagebank/papadomo-pointing.png",
    lines: [
      "MasterTECH knows who to call for anything. Turns out, for this particular walk, that's been me the whole time.",
      "PapaDomo -- the first DOMO, the eldest, the one the others still look to. Also, apparently, your tour guide. Small ALLIANCE.",
    ],
  },
  papadomo: {
    image: "/imagebank/papadomo-welcoming.png",
    lines: [
      "And that's everyone -- eleven people, one ALLIANCE, more name tags than strictly necessary.",
      "That's the whole path. Thanks for walking it with me.",
    ],
  },
};
