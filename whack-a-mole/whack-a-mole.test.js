const WhackAMole = require('./whack-a-mole');

test('Whack-a-Mole game should be defined', () => {
  expect(typeof WhackAMole).toBe('function');
});