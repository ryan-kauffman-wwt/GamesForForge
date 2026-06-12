const path = require('path');
const { initializeBoard, makeMove, checkWin, checkDraw } = require(path.resolve(__dirname, 'tic-tac-toe/tic-tac-toe'));

global.initializeBoard = initializeBoard;
global.makeMove = makeMove;
global.checkWin = checkWin;
global.checkDraw = checkDraw;
