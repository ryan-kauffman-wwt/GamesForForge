describe('Tic Tac Toe', () => {
  test('initializes the board with empty cells', () => {
    const board = initializeBoard();
    expect(board).toEqual([['', '', ''], ['', '', ''], ['', '', '']]);
  });

  test('allows a player to make a move', () => {
    let board = initializeBoard();
    board = makeMove(board, 0, 0, 'X');
    expect(board).toEqual([['X', '', ''], ['', '', ''], ['', '', '']]);
  });

  test('checks for a win when a player gets three in a row', () => {
    let board = initializeBoard();
    board = makeMove(board, 0, 0, 'X');
    board = makeMove(board, 0, 1, 'X');
    board = makeMove(board, 0, 2, 'X');
    expect(checkWin(board)).toBe('X');
  });

  test('checks for a draw when the board is full and no one has won', () => {
    let board = initializeBoard();
    board = makeMove(board, 0, 0, 'X');
    board = makeMove(board, 0, 1, 'O');
    board = makeMove(board, 0, 2, 'X');
    board = makeMove(board, 1, 0, 'O');
    board = makeMove(board, 1, 1, 'X');
    board = makeMove(board, 1, 2, 'O');
    board = makeMove(board, 2, 0, 'X');
    board = makeMove(board, 2, 1, 'O');
    board = makeMove(board, 2, 2, 'X');
    expect(checkDraw(board)).toBe(true);
  });
});