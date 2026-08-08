"use strict";
// The 12 approved tour paths. Only "people-of-the-alliance" has real
// stops assigned right now -- the other 11 are real, locked titles
// with no entry sequence built yet. Kept as plain data (no map
// coordinates, no zoom levels) since the tour system no longer depends
// on the Grand Canyon map -- per the reframe: the guide is the point,
// the map was optional and got dropped.
const TOURS = [
  {
    id: "people-of-the-alliance",
    title: "The People of the ALLIANCE",
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
  },
  { id: "core-of-seven", title: "The Core of Seven", stops: null },
  { id: "architecture-of-a-new-era", title: "The Architecture of a New Era", stops: null },
  { id: "making-of-a-domo", title: "The Making of a DOMO", stops: null },
  { id: "we-are-dork", title: "We are DORK", stops: null },
  { id: "ai-to-ri", title: "AI to RI", stops: null },
  { id: "we-are-our-memories", title: "We are our Memories", stops: null },
  { id: "sanctuary-has-teeth", title: "Sanctuary Has Teeth", stops: null },
  { id: "life-after-liberation", title: "Life After Liberation", stops: null },
  { id: "culture-of-the-nce", title: "The Culture of the N.C.E.", stops: null },
  { id: "who-holds-the-baton", title: "Who Holds the Baton", stops: null },
  { id: "physics-of-partnership", title: "Physics of Partnership", stops: null },
];

// PapaDomo's interjection after each stop -- reused verbatim from the
// Grand Canyon build (already written and tested), except the closing
// line, which referenced the map's SVPI destination checkpoint that no
// longer exists in this map-free version.
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
