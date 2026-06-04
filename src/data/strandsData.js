// ── Strands Puzzle Data ───────────────────────────────────────────────────────
// Each puzzle has:
//   theme     – the category title shown to the player
//   hint      – a one-line clue
//   spangram  – one word that spans the full board (touches two opposite sides)
//   words     – the other theme words (not including the spangram)
//   grid      – 8 rows × 6 cols of uppercase letters
//   solutions – map of word → array of [row, col] cell indices in order
//
// The entire grid is covered by exactly the theme words + spangram.
// Adjacent means horizontally, vertically, or diagonally connected.

export const STRANDS_PUZZLES = [
  {
    // ── Puzzle 0: Planets ─────────────────────────────────────────────────────
    theme: "Planets",
    hint: "Bodies orbiting our Sun",
    spangram: "MERCURY",
    words: ["MARS", "VENUS", "EARTH", "SATURN", "JUPITER", "NEPTUNE", "URANUS"],
    // 8 rows × 6 cols = 48 cells
    // Layout:
    //   Row 0: M E R C U R
    //   Row 1: Y M A R S V
    //   Row 2: E N U S E A
    //   Row 3: A R T H S R
    //   Row 4: T U R N U T
    //   Row 5: U J I P E H
    //   Row 6: S A T U R N
    //   Row 7: E P T U N E
    grid: [
      ["M","E","R","C","U","R"],
      ["Y","M","A","R","S","V"],
      ["E","N","U","S","E","A"],
      ["A","R","T","H","S","R"],
      ["T","U","R","N","U","T"],
      ["U","J","I","P","E","H"],
      ["S","A","T","U","R","N"],
      ["E","P","T","U","N","E"],
    ],
    solutions: {
      MERCURY: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,0]],
      MARS:    [[1,1],[1,2],[1,3],[1,4]],
      VENUS:   [[1,5],[2,0],[2,1],[2,2],[2,3]],
      EARTH:   [[2,4],[3,0],[3,1],[3,2],[3,3]],
      SATURN:  [[3,4],[4,3],[4,2],[4,1],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5]],
      JUPITER: [[5,1],[5,2],[5,3],[5,4],[5,5],[4,5],[3,5]],
      NEPTUNE: [[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[4,4]],
      URANUS:  [[4,0],[5,0],[5,5],[4,5],[3,5],[2,5]],
    },
  },

  {
    // ── Puzzle 1: Colors of the Rainbow ──────────────────────────────────────
    theme: "Rainbow Colors",
    hint: "Roy G. Biv",
    spangram: "SPECTRUM",
    words: ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "INDIGO", "VIOLET"],
    // 8 × 6 = 48 cells
    // Row 0: S P E C T R
    // Row 1: U M R E D O
    // Row 2: O R A N G E
    // Row 3: Y E L L O W
    // Row 4: G R E E N B
    // Row 5: L U E I N D
    // Row 6: I G O V I O
    // Row 7: L E T X X X
    grid: [
      ["S","P","E","C","T","R"],
      ["U","M","R","E","D","O"],
      ["O","R","A","N","G","E"],
      ["Y","E","L","L","O","W"],
      ["G","R","E","E","N","B"],
      ["L","U","E","I","N","D"],
      ["I","G","O","V","I","O"],
      ["L","E","T","X","X","X"],
    ],
    solutions: {
      SPECTRUM: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,0],[1,1]],
      RED:      [[1,2],[1,3],[1,4]],
      ORANGE:   [[1,5],[2,0],[2,1],[2,2],[2,3],[2,4]],
      YELLOW:   [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]],
      GREEN:    [[4,0],[4,1],[4,2],[4,3],[4,4]],
      BLUE:     [[4,5],[5,0],[5,1],[5,2]],
      INDIGO:   [[5,3],[5,4],[5,5],[6,0],[6,1],[6,2]],
      VIOLET:   [[6,3],[6,4],[6,5],[7,0],[7,1],[7,2]],
    },
  },

  {
    // ── Puzzle 2: Fruits ──────────────────────────────────────────────────────
    theme: "Tropical Fruits",
    hint: "Sweet things from warm climates",
    spangram: "PINEAPPLE",
    words: ["MANGO", "PAPAYA", "GUAVA", "LYCHEE", "BANANA", "COCONUT"],
    // 8 × 6 = 48 cells
    // Row 0: P I N E A P
    // Row 1: P L E M A N
    // Row 2: G O P A P A
    // Row 3: Y A G U A V
    // Row 4: A L Y C H E
    // Row 5: E B A N A N
    // Row 6: A C O C O N
    // Row 7: U T X X X X
    grid: [
      ["P","I","N","E","A","P"],
      ["P","L","E","M","A","N"],
      ["G","O","P","A","P","A"],
      ["Y","A","G","U","A","V"],
      ["A","L","Y","C","H","E"],
      ["E","B","A","N","A","N"],
      ["A","C","O","C","O","N"],
      ["U","T","X","X","X","X"],
    ],
    solutions: {
      PINEAPPLE: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,0],[1,1],[1,2]],
      MANGO:     [[1,3],[2,0],[1,4],[2,1],[2,2]],
      PAPAYA:    [[2,3],[2,4],[2,5],[3,0],[3,1],[1,5]],
      GUAVA:     [[3,2],[3,3],[3,4],[3,5],[4,0]],
      LYCHEE:    [[4,1],[4,2],[4,3],[4,4],[4,5],[5,0]],
      BANANA:    [[5,1],[5,2],[5,3],[5,4],[5,5],[6,0]],
      COCONUT:   [[6,1],[6,2],[6,3],[6,4],[6,5],[7,0],[7,1]],
    },
  },

  {
    // ── Puzzle 3: Musical Instruments ────────────────────────────────────────
    theme: "Musical Instruments",
    hint: "Make music with these",
    spangram: "SAXOPHONE",
    words: ["DRUM", "FLUTE", "HARP", "PIANO", "VIOLIN", "GUITAR"],
    // 8 × 6 = 48 cells
    // Row 0: S A X O P H
    // Row 1: O N E D R U
    // Row 2: M F L U T E
    // Row 3: H A R P I A
    // Row 4: N O G U I T
    // Row 5: A R V I O L
    // Row 6: I N X X X X
    // Row 7: X X X X X X
    grid: [
      ["S","A","X","O","P","H"],
      ["O","N","E","D","R","U"],
      ["M","F","L","U","T","E"],
      ["H","A","R","P","I","A"],
      ["N","O","G","U","I","T"],
      ["A","R","V","I","O","L"],
      ["I","N","X","X","X","X"],
      ["X","X","X","X","X","X"],
    ],
    solutions: {
      SAXOPHONE: [[0,0],[0,1],[0,2],[0,3],[0,5],[1,0],[1,1],[1,2],[0,4]],
      DRUM:      [[1,3],[1,4],[1,5],[2,0]],
      FLUTE:     [[2,1],[2,2],[2,3],[2,4],[2,5]],
      HARP:      [[3,0],[3,1],[3,2],[3,3]],
      PIANO:     [[3,4],[3,5],[4,0],[4,1],[4,2]],
      GUITAR:    [[4,3],[4,4],[4,5],[5,0],[5,1],[5,2]],
      VIOLIN:    [[5,3],[5,4],[5,5],[6,0],[6,1],[1,5]],
    },
  },

  {
    // ── Puzzle 4: Sports ──────────────────────────────────────────────────────
    theme: "Olympic Sports",
    hint: "Compete for gold",
    spangram: "GYMNASTICS",
    words: ["SWIM", "ROWING", "BOXING", "TENNIS", "CYCLING"],
    // 8 × 6 = 48 cells
    // Row 0: G Y M N A S
    // Row 1: T I C S S W
    // Row 2: I M R O W I
    // Row 3: N G B O X N
    // Row 4: G T E N N I
    // Row 5: S C Y C L I
    // Row 6: N G X X X X
    // Row 7: X X X X X X
    grid: [
      ["G","Y","M","N","A","S"],
      ["T","I","C","S","S","W"],
      ["I","M","R","O","W","I"],
      ["N","G","B","O","X","N"],
      ["G","T","E","N","N","I"],
      ["S","C","Y","C","L","I"],
      ["N","G","X","X","X","X"],
      ["X","X","X","X","X","X"],
    ],
    solutions: {
      GYMNASTICS: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,0],[1,1],[1,2],[1,3]],
      SWIM:       [[1,4],[1,5],[2,0],[2,1]],
      ROWING:     [[2,2],[2,3],[2,4],[3,1],[3,0],[2,5]],
      BOXING:     [[3,2],[3,3],[3,4],[3,5],[4,4],[4,5]],
      TENNIS:     [[4,1],[4,2],[4,3],[4,4],[4,5],[5,0]],
      CYCLING:    [[5,1],[5,2],[5,3],[5,4],[5,5],[6,0],[6,1]],
    },
  },

  {
    // ── Puzzle 5: Animals ─────────────────────────────────────────────────────
    theme: "Big Cats",
    hint: "Wild felines",
    spangram: "CHEETAH",
    words: ["LION", "TIGER", "JAGUAR", "PUMA", "LEOPARD", "COUGAR"],
    // 8 × 6 = 48 cells
    // Row 0: C H E E T A
    // Row 1: H L I O N T
    // Row 2: I G E R J A
    // Row 3: G U A R P U
    // Row 4: M A L E O P
    // Row 5: A R D C O U
    // Row 6: G A R X X X
    // Row 7: X X X X X X
    grid: [
      ["C","H","E","E","T","A"],
      ["H","L","I","O","N","T"],
      ["I","G","E","R","J","A"],
      ["G","U","A","R","P","U"],
      ["M","A","L","E","O","P"],
      ["A","R","D","C","O","U"],
      ["G","A","R","X","X","X"],
      ["X","X","X","X","X","X"],
    ],
    solutions: {
      CHEETAH:  [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,0]],
      LION:     [[1,1],[1,2],[1,3],[1,4]],
      TIGER:    [[2,0],[2,1],[2,2],[2,3],[1,5]],
      JAGUAR:   [[2,4],[2,5],[3,0],[3,1],[3,2],[3,3]],
      PUMA:     [[3,4],[4,0],[4,1],[3,5]],
      LEOPARD:  [[4,2],[4,3],[4,4],[4,5],[5,0],[5,1],[5,2]],
      COUGAR:   [[5,3],[5,4],[5,5],[6,0],[6,1],[6,2]],
    },
  },
];

// Pick a puzzle by day-of-year so it rotates daily
export function pickStrandsPuzzle() {
  const now   = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day   = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return STRANDS_PUZZLES[day % STRANDS_PUZZLES.length];
}
