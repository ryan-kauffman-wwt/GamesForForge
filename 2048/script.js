const board = document.getElementById('game-board');
const size = 4;
let tiles = [];

function initializeBoard() {
  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    board.appendChild(tile);
    tiles.push(tile);
  }
  addNewTile();
  addNewTile();
}

function addNewTile() {
  const emptyTiles = tiles.filter(tile =>!tile.textContent);
  if (emptyTiles.length > 0) {
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    randomTile.textContent = Math.random() < 0.9? '2' : '4';
  }
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      moveTiles(event.key);
      addNewTile();
      break;
  }
});

function moveTiles(direction) {
  // Implement tile movement logic here
}

initializeBoard();