// ── Strands puzzle data ────────────────────────────────────────────────────────
// Each puzzle has:
//   grid       – 6×8 array of uppercase letters
//   theme      – the category name shown as the hint
//   themeWords – words belonging to the theme (must appear contiguously in grid)
//   spangram   – one word that spans the grid (also in the grid)
//
// All words are traced as contiguous paths through adjacent cells (8-directional).
// For this implementation the grid is pre-built so every word can be found by
// the player selecting adjacent cells in order.

export const strandsPuzzles = [
  {
    id: 1,
    theme: 'Things that are HOT 🌶️',
    spangram: 'LAVA',
    themeWords: ['SAUNA', 'EMBER', 'STEAM', 'FLAME', 'SOLAR'],
    // 6 rows × 8 cols
    grid: [
      ['S', 'A', 'U', 'N', 'A', 'L', 'A', 'V'],
      ['E', 'M', 'B', 'E', 'R', 'A', 'F', 'L'],
      ['S', 'T', 'E', 'A', 'M', 'S', 'L', 'A'],
      ['F', 'L', 'A', 'M', 'E', 'O', 'A', 'M'],
      ['S', 'O', 'L', 'A', 'R', 'L', 'V', 'E'],
      ['H', 'E', 'A', 'T', 'W', 'A', 'A', 'R'],
    ],
  },
  {
    id: 2,
    theme: 'Types of BREAD 🍞',
    spangram: 'NAAN',
    themeWords: ['PITA', 'RYE', 'BAGUETTE', 'BRIOCHE', 'FOCACCIA'],
    grid: [
      ['P', 'I', 'T', 'A', 'R', 'Y', 'E', 'N'],
      ['B', 'A', 'G', 'U', 'E', 'T', 'T', 'A'],
      ['B', 'R', 'I', 'O', 'C', 'H', 'E', 'A'],
      ['F', 'O', 'C', 'A', 'C', 'C', 'I', 'N'],
      ['A', 'S', 'O', 'U', 'R', 'D', 'O', 'U'],
      ['G', 'H', 'W', 'H', 'E', 'A', 'T', 'N'],
    ],
  },
  {
    id: 3,
    theme: 'OCEAN creatures 🌊',
    spangram: 'WHALE',
    themeWords: ['SHARK', 'OCTOPUS', 'CRAB', 'SQUID', 'TURTLE'],
    grid: [
      ['S', 'H', 'A', 'R', 'K', 'W', 'H', 'A'],
      ['O', 'C', 'T', 'O', 'P', 'U', 'S', 'L'],
      ['C', 'R', 'A', 'B', 'S', 'Q', 'U', 'E'],
      ['S', 'Q', 'U', 'I', 'D', 'T', 'U', 'R'],
      ['T', 'U', 'R', 'T', 'L', 'E', 'A', 'N'],
      ['M', 'A', 'N', 'T', 'A', 'R', 'A', 'Y'],
    ],
  },
  {
    id: 4,
    theme: 'PLANETS of our solar system 🪐',
    spangram: 'EARTH',
    themeWords: ['MARS', 'VENUS', 'SATURN', 'JUPITER', 'MERCURY'],
    grid: [
      ['M', 'A', 'R', 'S', 'V', 'E', 'N', 'U'],
      ['S', 'A', 'T', 'U', 'R', 'N', 'E', 'A'],
      ['J', 'U', 'P', 'I', 'T', 'E', 'R', 'R'],
      ['M', 'E', 'R', 'C', 'U', 'R', 'Y', 'T'],
      ['N', 'E', 'P', 'T', 'U', 'N', 'E', 'H'],
      ['U', 'R', 'A', 'N', 'U', 'S', 'X', 'X'],
    ],
  },
  {
    id: 5,
    theme: 'COLORS of the rainbow 🌈',
    spangram: 'VIOLET',
    themeWords: ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'INDIGO'],
    grid: [
      ['R', 'E', 'D', 'O', 'R', 'A', 'N', 'G'],
      ['E', 'Y', 'E', 'L', 'L', 'O', 'W', 'V'],
      ['G', 'R', 'E', 'E', 'N', 'B', 'L', 'I'],
      ['U', 'E', 'I', 'N', 'D', 'I', 'G', 'O'],
      ['V', 'I', 'O', 'L', 'E', 'T', 'X', 'L'],
      ['X', 'X', 'X', 'X', 'X', 'X', 'E', 'T'],
    ],
  },
]

/**
 * Returns a random puzzle from the list.
 */
export function getRandomPuzzle() {
  return strandsPuzzles[Math.floor(Math.random() * strandsPuzzles.length)]
}

/**
 * Returns a deterministic puzzle based on today's date.
 */
export function getDailyPuzzle() {
  const today = new Date()
  const dayIndex =
    (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) %
    strandsPuzzles.length
  return strandsPuzzles[dayIndex]
}

/**
 * Given a grid and a word, return all valid cell-paths (arrays of {row,col})
 * where the word can be traced through adjacent (8-directional) cells.
 * Used internally for highlighting found words.
 */
export function findWordPaths(grid, word) {
  const rows = grid.length
  const cols = grid[0].length
  const paths = []

  const dfs = (r, c, idx, path, visited) => {
    if (idx === word.length) {
      paths.push([...path])
      return
    }
    if (r < 0 || r >= rows || c < 0 || c >= cols) return
    if (visited.has(`${r},${c}`)) return
    if (grid[r][c] !== word[idx]) return

    visited.add(`${r},${c}`)
    path.push({ row: r, col: c })

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        dfs(r + dr, c + dc, idx + 1, path, visited)
      }
    }

    path.pop()
    visited.delete(`${r},${c}`)
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === word[0]) {
        dfs(r, c, 0, [], new Set())
      }
    }
  }

  return paths
}
