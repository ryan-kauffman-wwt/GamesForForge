const StrandsGame = require('./strandsGame');

describe('StrandsGame', () => {
  let game;

  beforeEach(() => {
    game = new StrandsGame();
  });

  test('adds a strand', () => {
    game.addStrand('new strand');
    expect(game.getStrands()).toContain('new strand');
  });
});