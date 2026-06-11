/**
 * Cat Art Matching Game data.
 *
 * Each entry represents a famous art-style reimagined with cats.
 * `art`   — the visual representation shown on the "painting" card (emoji art)
 * `label` — the style / title shown on the "name" card
 * `hint`  — fun trivia blurb shown on a successful match
 * `palette` — accent colour used for matched-pair highlighting
 */

export const CAT_ART_PAIRS = [
  {
    id: "starry-night",
    art: "🌌🐱\n🌀🌙✨\n🏘️🔵💙",
    label: "The Starry Night Cat",
    hint: "Van Gogh's swirling night sky — now with a cat gazing at the cosmos.",
    palette: "#1a3a6e",
  },
  {
    id: "mona-lisa",
    art: "🖼️😺\n🏔️🌿🎨\n👑🪟🌄",
    label: "Mona Lisa Cat",
    hint: "Leonardo da Vinci's mysterious smile… now with whiskers.",
    palette: "#7a6040",
  },
  {
    id: "scream",
    art: "😱🐱\n🌊🔴🟠\n🌉😨🙀",
    label: "The Scream Cat",
    hint: "Edvard Munch's existential dread — the cat just knocked something off the table.",
    palette: "#c0392b",
  },
  {
    id: "water-lilies",
    art: "🌸🐱\n🪷🟢💚\n🌊🏞️🌺",
    label: "Water Lilies Cat",
    hint: "Monet's serene Giverny pond — the cat is *definitely* about to splash in it.",
    palette: "#27ae60",
  },
  {
    id: "great-wave",
    art: "🌊🐱\n🗻🔵🏄\n🌀💙🐟",
    label: "The Great Wave Cat",
    hint: "Hokusai's iconic wave — the cat rides it with zero fear.",
    palette: "#2980b9",
  },
  {
    id: "girl-pearl-earring",
    art: "💎🐱\n🧣💙🪬\n✨👁️🌟",
    label: "Girl with a Pearl Earring Cat",
    hint: "Vermeer's luminous portrait — the pearl earring is now a jingle bell.",
    palette: "#8e44ad",
  },
  {
    id: "sunday-afternoon",
    art: "☀️🐱\n🏖️🎩🌂\n🟡🟢🌳",
    label: "Sunday Afternoon Cat",
    hint: "Seurat's pointillist park — every dot is a tiny cat fur pattern.",
    palette: "#f39c12",
  },
  {
    id: "persistence-memory",
    art: "⏰🐱\n🏜️🫠🕰️\n🌅💧🐜",
    label: "Persistence of Memory Cat",
    hint: "Dalí's melting clocks — the cat is napping on top of the droopiest one.",
    palette: "#e67e22",
  },
  {
    id: "birth-venus",
    art: "🐚🐱\n🌊🌹💐\n🏛️🌬️✨",
    label: "Birth of Venus Cat",
    hint: "Botticelli's goddess rising from the sea — replaced by a very regal cat.",
    palette: "#e91e8c",
  },
  {
    id: "american-gothic",
    art: "🏚️🐱\n🌾🪣😾\n🔱🧑‍🌾👩",
    label: "American Gothic Cat",
    hint: "Grant Wood's stern farming couple — both are now very serious cats.",
    palette: "#6d4c41",
  },
  {
    id: "kiss",
    art: "💛🐱\n🌹💋🟡\n🌌🤍💫",
    label: "The Kiss Cat",
    hint: "Klimt's golden embrace — two cats wrapped in gold leaf.",
    palette: "#d4ac0d",
  },
  {
    id: "last-supper",
    art: "🍞🐱\n🍷🕊️✝️\n🪑🌅🏛️",
    label: "The Last Supper Cat",
    hint: "Da Vinci's mural — thirteen cats at a very long table.",
    palette: "#795548",
  },
];

/**
 * Build a shuffled list of card objects for the game.
 * Each pair produces two cards: one "art" card and one "label" card.
 */
export function buildCatArtDeck(pairs) {
  const cards = [];
  pairs.forEach((pair) => {
    cards.push({
      id: `art-${pair.id}`,
      pairId: pair.id,
      type: "art",
      content: pair.art,
      palette: pair.palette,
      hint: pair.hint,
      flipped: false,
      matched: false,
    });
    cards.push({
      id: `label-${pair.id}`,
      pairId: pair.id,
      type: "label",
      content: pair.label,
      palette: pair.palette,
      hint: pair.hint,
      flipped: false,
      matched: false,
    });
  });

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/** Pick a random subset of N pairs */
export function pickPairs(n = 8) {
  const shuffled = [...CAT_ART_PAIRS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export const DIFFICULTY_LEVELS = [
  { id: "easy",   label: "Easy",   emoji: "😺", pairs: 6  },
  { id: "medium", label: "Medium", emoji: "🐱", pairs: 9  },
  { id: "hard",   label: "Hard",   emoji: "😾", pairs: 12 },
];
