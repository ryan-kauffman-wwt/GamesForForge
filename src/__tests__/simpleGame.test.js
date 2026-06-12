import simpleGame from '../simpleGame';

describe('Simple Game', () => {
  test('generates a random number between 1 and 100', () => {
    const number = simpleGame.generateNumber();
    expect(number).toBeGreaterThanOrEqual(1);
    expect(number).toBeLessThanOrEqual(100);
  });

  test('checks if the guess is correct', () => {
    expect(simpleGame.checkGuess(50, 50)).toBe('correct');
  });

  test('checks if the guess is too high', () => {
    expect(simpleGame.checkGuess(50, 60)).toBe('too high');
  });

  test('checks if the guess is too low', () => {
    expect(simpleGame.checkGuess(50, 40)).toBe('too low');
  });

  test('handles edge cases for guesses outside the range', () => {
    expect(simpleGame.checkGuess(50, 0)).toBe('out of range');
    expect(simpleGame.checkGuess(50, 101)).toBe('out of range');
  });
});