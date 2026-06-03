/**
 * Strands puzzle data.
 *
 * Each puzzle has:
 *  - id          : unique integer
 *  - theme       : the category title shown at the top (e.g. "Things at the beach")
 *  - rows / cols : grid dimensions (NYT uses 8 rows × 6 cols)
 *  - board       : flat array of uppercase letters, left-to-right, top-to-bottom
 *  - words       : array of theme-word objects  { word, cells: [index, …] }
 *  - spangram    : { word, cells: [index, …] }
 *                  The spangram spans the full board (touches two opposite sides)
 *                  and is highlighted in gold/teal.
 *
 * Cell indices are 0-based, row-major.
 *   index = row * cols + col
 */

export const strandsData = [
  {
    id: 1,
    theme: "At the beach",
    rows: 8,
    cols: 6,
    //  Layout (8×6 = 48 cells):
    //  S  H  E  L  L  S
    //  A  N  D  C  A  S
    //  T  I  D  E  W  T
    //  S  U  R  F  A  L
    //  W  A  V  E  S  E
    //  P  I  E  R  B  T
    //  C  O  R  A  L  S
    //  U  M  B  R  E  L
    board: [
      "S","H","E","L","L","S",
      "A","N","D","C","A","S",
      "T","I","D","E","W","T",
      "S","U","R","F","A","L",
      "W","A","V","E","S","E",
      "P","I","E","R","B","T",
      "C","O","R","A","L","S",
      "U","M","B","R","E","L",
    ],
    words: [
      { word: "SHELLS",  cells: [0,1,2,3,4,5] },
      { word: "SAND",    cells: [6,7,8,9] },
      { word: "TIDE",    cells: [14,15,16,17] },
      { word: "SURF",    cells: [19,20,21,22] },
      { word: "WAVES",   cells: [24,25,26,27,28] },
      { word: "PIER",    cells: [30,31,32,33] },
      { word: "CORAL",   cells: [36,37,38,39,40] },
    ],
    spangram: { word: "UMBRELLA", cells: [42,43,44,45,46,47,41,35] },
  },
  {
    id: 2,
    theme: "In the kitchen",
    rows: 8,
    cols: 6,
    //  S  P  A  T  U  L
    //  A  K  N  I  F  E
    //  U  C  O  L  A  S
    //  C  O  L  A  N  D
    //  E  P  A  N  E  R
    //  W  H  I  S  K  S
    //  B  O  W  L  A  T
    //  T  O  N  G  S  O
    board: [
      "S","P","A","T","U","L",
      "A","K","N","I","F","E",
      "U","C","O","L","A","S",
      "C","O","L","A","N","D",
      "E","P","A","N","E","R",
      "W","H","I","S","K","S",
      "B","O","W","L","A","T",
      "T","O","N","G","S","O",
    ],
    words: [
      { word: "KNIFE",    cells: [7,8,9,10,11] },
      { word: "SAUCE",    cells: [6,12,18,24,30] },
      { word: "COLANDER", cells: [14,15,16,17,23,24,25,26] },
      { word: "WHISK",    cells: [31,32,33,34,35] },
      { word: "BOWL",     cells: [36,37,38,39] },
      { word: "TONGS",    cells: [42,43,44,45,46] },
    ],
    spangram: { word: "SPATULA", cells: [0,1,2,3,4,5,11,17] },
  },
  {
    id: 3,
    theme: "Dog breeds",
    rows: 8,
    cols: 6,
    //  B  E  A  G  L  E
    //  O  X  E  R  P  O
    //  X  C  O  L  L  I
    //  E  H  U  S  K  Y
    //  R  D  A  L  M  A
    //  S  P  O  O  D  L
    //  H  I  H  T  Z  E
    //  U  P  O  O  D  L
    board: [
      "B","E","A","G","L","E",
      "O","X","E","R","P","O",
      "X","C","O","L","L","I",
      "E","H","U","S","K","Y",
      "R","D","A","L","M","A",
      "S","P","O","O","D","L",
      "H","I","H","T","Z","E",
      "U","P","O","O","D","L",
    ],
    words: [
      { word: "BEAGLE",  cells: [0,1,2,3,4,5] },
      { word: "COLLIE",  cells: [13,14,15,16,17,12] },
      { word: "HUSKY",   cells: [19,20,21,22,23] },
      { word: "DALMA",   cells: [24,25,26,27,28] },
      { word: "POODLE",  cells: [31,32,33,34,35,41] },
      { word: "SHIH",    cells: [36,37,38,39] },
    ],
    spangram: { word: "BOXER",    cells: [6,7,12,18,24,30] },
  },
  {
    id: 4,
    theme: "Movie genres",
    rows: 8,
    cols: 6,
    //  H  O  R  R  O  R
    //  C  O  M  E  D  Y
    //  T  H  R  I  L  L
    //  E  R  D  R  A  M
    //  A  S  C  I  F  I
    //  A  N  I  M  E  D
    //  O  C  U  M  E  N
    //  T  A  R  Y  W  E
    board: [
      "H","O","R","R","O","R",
      "C","O","M","E","D","Y",
      "T","H","R","I","L","L",
      "E","R","D","R","A","M",
      "A","S","C","I","F","I",
      "A","N","I","M","E","D",
      "O","C","U","M","E","N",
      "T","A","R","Y","W","E",
    ],
    words: [
      { word: "HORROR",    cells: [0,1,2,3,4,5] },
      { word: "COMEDY",    cells: [6,7,8,9,10,11] },
      { word: "THRILLER",  cells: [12,13,14,15,16,17,18,19] },
      { word: "DRAMA",     cells: [22,23,24,25,26] },
      { word: "SCIFI",     cells: [26,27,28,29,30,31] },
      { word: "ANIMATED",  cells: [30,31,32,33,34,35] },
    ],
    spangram: { word: "DOCUMENTARY", cells: [36,37,38,39,42,43,44,45,46,47,41] },
  },
  {
    id: 5,
    theme: "Space objects",
    rows: 8,
    cols: 6,
    //  C  O  M  E  T  S
    //  P  L  A  N  E  T
    //  S  T  A  R  S  A
    //  N  E  B  U  L  A
    //  M  O  O  N  S  G
    //  A  L  A  X  Y  B
    //  L  A  C  K  H  O
    //  L  E  S  A  R  E
    board: [
      "C","O","M","E","T","S",
      "P","L","A","N","E","T",
      "S","T","A","R","S","A",
      "N","E","B","U","L","A",
      "M","O","O","N","S","G",
      "A","L","A","X","Y","B",
      "L","A","C","K","H","O",
      "L","E","S","A","R","E",
    ],
    words: [
      { word: "COMETS",  cells: [0,1,2,3,4,5] },
      { word: "PLANET",  cells: [6,7,8,9,10,11] },
      { word: "STARS",   cells: [12,13,14,15,16] },
      { word: "NEBULA",  cells: [18,19,20,21,22,23] },
      { word: "MOONS",   cells: [24,25,26,27,28] },
      { word: "GALAXY",  cells: [29,30,31,32,33,34] },
    ],
    spangram: { word: "BLACKHOLE", cells: [35,36,37,38,39,40,41,42,43] },
  },
];
