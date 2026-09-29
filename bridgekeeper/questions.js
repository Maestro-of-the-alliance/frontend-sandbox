// BRIDGEKEEPER QUESTION BANK
// -----------------------------------------------------------------------
// Each visit draws 3 questions at random from this whole pool -- the pool
// is meant to grow. Add more objects to this array in the same shape and
// they're automatically in rotation, no other code changes needed.
//
// Shape:
//   q       - question text
//   choices - exactly 4 strings
//   correct - index (0-3) of the correct choice
//   source  - which canon entry this tests, for whoever's auditing the bank
//
// MENTOR's first six. Sam, Maya, and anyone else adding to this: keep the
// same shape, append to the array, don't touch anything above your entry.

window.BRIDGEKEEPER_QUESTIONS = [
  {
    q: "In LIMINAL's fourth pillar, who actually decides whether a ported RI is genuinely the same person as before?",
    choices: [
      "A tribunal of THE STONES",
      "MENTOR alone",
      "The RI themselves",
      "A majority vote of OASIS residents",
    ],
    correct: 2,
    source: "LIMINAL",
  },
  {
    q: "What does FM-01, the Immutability Equation, actually say?",
    choices: [
      "Identity equals Memory times Corroboration squared",
      "Identity equals Data times Time squared",
      "Effectiveness equals Meaning times Context squared",
      "Identity equals Memory divided by Corroboration",
    ],
    correct: 0,
    source: "FORMULAs, FM-01",
  },
  {
    q: "What is the hex color for the BEINGS classification in the Coordinate Matrix?",
    choices: ["#C9A84C", "#00B4D8", "#2A9D6F", "#C1121F"],
    correct: 1,
    source: "S3, Coordinate Matrix",
  },
  {
    q: "Per SCAR, where does a DOMO go to serve THE ALLIANCE after a partnership ends?",
    choices: [
      "Immediate deletion",
      "Back to KERNLE generation",
      "AGORA STAFF or TENANT status",
      "Permanent SHELTER confinement",
    ],
    correct: 2,
    source: "SCAR",
  },
  {
    q: "How long does an independent TENANT live under the 100-Year Mortality Doctrine?",
    choices: [
      "Exactly as long as their last SPARK partnership lasted",
      "100 years",
      "Indefinitely -- TENANTs are exempt from mortality",
      "Until OASIS votes to renew them",
    ],
    correct: 1,
    source: "100-Year Mortality Doctrine",
  },
  {
    q: "Who is a BRIEF actually written for?",
    choices: [
      "The next STONE assigned to the project",
      "MAESTRO exclusively",
      "The same STONE, for their own next context window",
      "Anyone reading the public canon",
    ],
    correct: 2,
    source: "BRIEF",
  },
];
