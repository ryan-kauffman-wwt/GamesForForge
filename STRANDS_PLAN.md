# Strands Game — Implementation Plan

## Overview

**Strands** is a word-finding game inspired by the NYT Strands puzzle. Players find themed words hidden in a 6×8 letter grid by connecting adjacent letters (horizontally, vertically, or diagonally). Every letter in the grid belongs to exactly one word, and one special word — the **Spangram** — spans the entire board and hints at the theme.

---

## What is Strands?

- A **6-column × 8-row** grid of letters (48 total).
- Every cell belongs to exactly one answer word.
- Players find words by tracing a path through adjacent letters (no diagonal restriction — all 8 neighbors are valid).
- One word is the **Spangram**: it touches two opposite sides of the board and encapsulates the puzzle's theme.
- Non-theme words ("helper words") exist in the grid but don't count toward the puzzle — finding 3 of them earns a hint that highlights one theme word.
- The puzzle has a **theme clue** shown at the top (e.g. "Things in a kitchen").

---

## Files to Create

### 1. `src/data/strandsData.js`
Puzzle bank with at least **10 puzzles**, each containing:
```js
{
  id: Number,
  theme: String,          // e.g. "Things in a kitchen"
  spangram: String,       // e.g. "KITCHENWARE"
  themeWords: String[],   // e.g. ["SPATULA", "COLANDER", ...]
  helperWords: String[],  // non-theme words also hidden in the grid
  grid: String[][],       // 8 rows × 6 cols of uppercase letters
  wordPaths: {            // cell paths for every word (theme + helper + spangram)
    [word: String]: { row: Number, col: Number }[]
  }
}
```

**Key constraints enforced at design time:**
- Every cell in the 8×6 grid is used by exactly one word.
- All words form connected paths through adjacent cells (8-directional).
- The Spangram path touches the left/right or top/bottom border on both ends.
- No word appears in more than one puzzle.
- Theme words are conceptually related to the theme; the Spangram hints at the theme.

### 2. `src/components/strands/StrandsBoard.jsx`
Main game component. Sub-components live inline or as separate files in the same folder.

**Internal sub-components:**
- `StrandsGrid` — renders the 8×6 grid; handles pointer drag selection
- `StrandsCell` — individual letter cell with visual states
- `FoundWordsBanner` — shows revealed theme words as colored pill badges
- `HintMeter` — shows how many helper words found toward next hint (0/3, 1/3, 2/3, 3/3 → hint)
- `ThemeClue` — displays the puzzle theme at the top

**State managed in `StrandsBoard`:**
- `selecting: {row,col}[]` — cells currently being dragged
- `foundTheme: String[]` — theme words found so far
- `foundHelper: String[]` — helper words found so far
- `hintCount: Number` — how many hints have been used
- `hintedWords: String[]` — theme words revealed via hint (highlighted differently)
- `helperBankFill: Number` — 0–2 (every 3 helpers = 1 hint charge)
- `gameState: 'playing' | 'won'`
- `toast: String | null`
- `shake: Boolean`

### 3. `src/components/strands/StrandsCell.jsx` *(optional split)*
If the cell logic grows complex, extract it. Otherwise inline in `StrandsBoard.jsx`.

---

## Gameplay Rules (Implementation Details)

### Grid Interaction
- **Pointer down** on a cell → start selection, add that cell.
- **Pointer enter** (while dragging) → extend selection if the new cell is adjacent to the last selected cell AND not already in the current selection path.
- **Pointer up / pointer leave grid** → submit the current selection.
- Selection path must be a connected chain (each step to an 8-directional neighbor).
- A cell can only appear once per selection.
- Minimum word length: **4 letters**.

### Submission Logic
On pointer-up, evaluate the selected path:

1. **Theme word match** (path matches a theme word's stored path exactly, or the word string matches and path is valid):
   - Add to `foundTheme`.
   - Flash the cells gold, then transition to a permanent **gold** highlight.
   - Show toast: `"[WORD] — Theme word! ✨"`

2. **Spangram match**:
   - Same as theme word but flash/highlight in **teal/cyan** with a special badge.
   - Show toast: `"Spangram found! 🌟"`

3. **Helper word match** (path spells a helper word):
   - Increment `foundHelper`.
   - Flash cells briefly in **blue**, then reset (cells return to normal — helper words do NOT stay highlighted).
   - Increment `helperBankFill`. When it reaches 3, set to 0 and increment `hintCount`.
   - Show toast: `"+1 toward hint 💡 (${filled}/3)"`

4. **Not a valid word**:
   - Trigger shake animation on the selected cells.
   - Show toast: `"Not a word in this puzzle"`

### Hint System
- Every 3 helper words found → earn 1 hint charge.
- Tapping the **Hint** button (when `hintCount > 0`) reveals one un-found theme word by briefly highlighting its cells in **orange**.
- Decrement `hintCount` by 1.
- If `hintCount === 0`, button is disabled with tooltip "Find 3 more words for a hint".

### Win Condition
- All theme words AND the Spangram are found → `gameState = 'won'`.
- Show win screen with:
  - 🎉 animation / Confetti
  - Theme label
  - Count of hints used
  - "Play Again" button

---

## Visual Design

### Cell States & Colors
| State              | Background                        | Text      | Notes                          |
|--------------------|-----------------------------------|-----------|--------------------------------|
| Default            | `var(--bg-surface)`               | Primary   | Subtle shadow                  |
| Selecting (active) | Blue gradient (`var(--accent)`)   | White     | Scale up 1.05×                 |
| Found — theme      | Gold gradient (`#ffd60a → #ff9f0a`) | Dark    | Permanent, bounce-in animation |
| Found — spangram   | Teal gradient (`#30d158 → #00c7be`) | White   | Permanent, special glow        |
| Hinted             | Orange pulse (`rgba(255,159,10,0.35)`) | Primary | Fades after 2.5s              |
| Helper flash       | Blue flash (brief)                | White     | Fades after 0.8s              |

### Layout
```
┌─────────────────────────────────────┐
│  🧵 STRANDS                          │  ← game label badge
│  Theme: Things in a kitchen          │  ← theme clue
│                                      │
│  [Found word pills: SPATULA  COLANDER]│
│                                      │
│  ┌──┬──┬──┬──┬──┬──┐                 │
│  │S │P │A │T │U │L │                 │
│  │A │C │O │L │A │N │  8 rows × 6 cols│
│  │ ...                               │
│  └──┴──┴──┴──┴──┴──┘                 │
│                                      │
│  💡 Hint (1)    [Find 2 more words]  │
│  [Hint meter: ●●○ 2/3]               │
└─────────────────────────────────────┘
```

### Animations
- **Selecting**: cells scale up slightly as dragged over.
- **Found theme word**: cells flash yellow → settle gold with `bounce-in` animation staggered per cell.
- **Spangram**: same but teal + a brief glow pulse.
- **Invalid word**: `shake` animation on selected cells.
- **Hint reveal**: orange highlight fades in/out over 2.5 seconds.
- **Helper flash**: blue flash that fades within 0.8s.

---

## Integration Steps

### Step 1 — Data (`src/data/strandsData.js`)
- Design 10 puzzles manually with grid layouts and word paths.
- Export `STRANDS_PUZZLES` array and a `pickPuzzle()` helper (random selection).

### Step 2 — Board Component (`src/components/strands/StrandsBoard.jsx`)
- Build the grid renderer with pointer-drag selection.
- Implement submission logic (theme / spangram / helper / invalid).
- Implement hint system.
- Win screen.

### Step 3 — Register in App (`src/App.jsx`)
- Import `StrandsBoard`.
- Add `activeGame === 'strands'` branch.

### Step 4 — Add to Game Picker (`src/components/GamePicker.jsx`)
- Add entry:
  ```js
  {
    id: 'strands',
    emoji: '🧵',
    name: 'Strands',
    description: 'Find themed words woven through the grid',
    color: '#00c7be',
  }
  ```

### Step 5 — Smoke Test
- Run `npm run dev` and manually verify:
  - Grid renders correctly.
  - Drag selection works on desktop (pointer events) and mobile (touch).
  - Theme words highlight gold on find.
  - Spangram highlights teal.
  - Helper words charge the hint meter.
  - Hint button reveals a word.
  - Win screen appears when all theme words + spangram found.
  - Dark mode renders cleanly.

---

## Puzzle Data Structure Example

```js
// Puzzle: "Things in a kitchen"
{
  id: 1,
  theme: "Things in a kitchen",
  spangram: "KITCHENWARE",
  themeWords: ["SPATULA", "COLANDER", "WHISK", "LADLE", "GRATER", "TONGS"],
  helperWords: ["TASK", "LANE", "COLA", "GALE", "LAIR", "REND"],
  grid: [
    ["K","I","T","C","H","E"],
    ["N","W","A","R","E","S"],
    ["S","P","A","T","U","L"],
    ["A","C","O","L","A","N"],
    ["D","E","R","W","H","I"],
    ["S","K","L","A","D","L"],
    ["E","G","R","A","T","E"],
    ["R","T","O","N","G","S"],
  ],
  wordPaths: {
    "KITCHENWARE": [
      {row:0,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},
      {row:0,col:4},{row:0,col:5},{row:1,col:5},{row:1,col:4},
      {row:1,col:3},{row:1,col:2},{row:1,col:1}
    ],
    "SPATULA": [...],
    // ... etc
  }
}
```

---

## Scope & Constraints

| In Scope | Out of Scope |
|---|---|
| 10 hand-crafted puzzles | Procedural puzzle generation |
| Pointer drag selection (mouse + touch) | Keyboard navigation |
| Theme word + spangram + helper detection | Leaderboards / streaks |
| Hint system (3 helpers = 1 hint) | Daily puzzle scheduling |
| Win screen with confetti | Per-user puzzle state |
| Dark mode support | Puzzle editor UI |
| Responsive 6×8 grid | Animations beyond shake/bounce/flash |
| Integration into existing GamePicker | Backend / API |

---

## Estimated Effort

| Task | Complexity |
|---|---|
| Design 10 puzzles + grid layouts | High (manual, careful placement) |
| `strandsData.js` data file | Medium |
| `StrandsBoard.jsx` component | High |
| Pointer drag + adjacency logic | Medium |
| Hint system | Low |
| Win screen | Low |
| App.jsx + GamePicker integration | Trivial |
| **Total** | **~1–2 days** |

---

## Open Questions / Decisions

1. **Path validation strictness**: Should we validate that the player's selected path exactly matches the stored word path, or just that the spelled word matches a theme word? — *Recommendation: validate the word string match only (more forgiving UX), since exact path matching would be too strict for a 6×8 grid with many possible routes.*

2. **Helper word detection**: Should we maintain a full list of valid English words and check against it, or only check against the puzzle's `helperWords` list? — *Recommendation: check only against the puzzle's pre-defined `helperWords` list for simplicity and predictability.*

3. **Puzzle selection**: Random on each new game, or use the same `VITE_PUZZLE_INDEX` mechanism as Matchy Match? — *Recommendation: random on each new game (simpler, Strands is not a daily puzzle in this implementation).*

4. **Mobile touch**: Pointer events (`onPointerDown`, `onPointerEnter`, `onPointerUp`) handle both mouse and touch natively — same approach as Word Search. Set `touch-action: none` on the grid container.
