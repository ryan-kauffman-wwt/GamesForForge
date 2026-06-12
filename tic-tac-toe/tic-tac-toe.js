/**
 * Tic Tac Toe game logic
 */

/**
 * Initializes a 3x3 board with empty cells.
 * @returns {string[][]} A 3x3 array of empty strings.
 */
function initializeBoard() {
  return [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
}

/**
 * Places a player's mark on the board at the given row and column.
 * @param {string[][]} board - The current board state.
 * @param {number} row - The row index (0-2).
 * @param {number} col - The column index (0-2).
 * @param {string} player - The player's mark ('X' or 'O').
 * @returns {string[][]} A new board with the move applied.
 */
function makeMove(board, row, col, player) {
  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = player;
  return newBoard;
}

/**
 * Checks if any player has won the game.
 * @param {string[][]} board - The current board state.
 * @returns {string|null} The winning player's mark ('X' or 'O'), or null if no winner.
 */
function checkWin(board) {
  const lines = [
    // Rows
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // Columns
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // Diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    const cellA = board[a[0]][a[1]];
    const cellB = board[b[0]][b[1]];
    const cellC = board[c[0]][c[1]];
    if (cellA && cellA === cellB && cellA === cellC) {
      return cellA;
    }
  }

  return null;
}

/**
 * Checks if the board is completely filled (all cells occupied).
 * Returns true when every cell has been played, regardless of winner.
 * @param {string[][]} board - The current board state.
 * @returns {boolean} True if all cells are filled, false otherwise.
 */
function checkDraw(board) {
  return board.every((row) => row.every((cell) => cell !== ''));
}

module.exports = { initializeBoard, makeMove, checkWin, checkDraw };
