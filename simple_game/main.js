const readline = require('readline');

let playerPosition = { x: 0, y: 0 };

function printGrid() {
  let grid = Array(5).fill(null).map(() => Array(5).fill(' '));
  grid[playerPosition.y][playerPosition.x] = 'P';
  grid.forEach(row => console.log(row.join(' '))); 
}

function movePlayer(direction) {
  switch (direction) {
    case 'up':
      if (playerPosition.y > 0) playerPosition.y--;
      break;
    case 'down':
      if (playerPosition.y < 4) playerPosition.y++;
      break;
    case 'left':
      if (playerPosition.x > 0) playerPosition.x--;
      break;
    case 'right':
      if (playerPosition.x < 4) playerPosition.x++;
      break;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function gameLoop() {
  printGrid();
  rl.question('Move (up/down/left/right): ', (answer) => {
    movePlayer(answer.trim().toLowerCase());
    gameLoop();
  });
}

gameLoop();