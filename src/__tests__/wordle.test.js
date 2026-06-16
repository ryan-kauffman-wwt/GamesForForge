import { initializeGame, makeGuess } from '../wordle';

describe('Wordle Game', () => {
  test('initializes with a random word', () => {
    const game = initializeGame();
    expect(game.word).toBeDefined();
  });

  test('accepts a guess and checks if it is correct', () => {
    const game = initializeGame();
    const guess = 'apple';
    const result = makeGuess(game, guess);
    expect(result).toBeDefined();
  });

  test('tracks the number of attempts', () => {
    const game = initializeGame();
    makeGuess(game, 'guess1');
    makeGuess(game, 'guess2');
    expect(game.attempts).toBe(2);
  });

  test('ends when the word is guessed or the maximum attempts are reached', () => {
    const game = initializeGame();
    makeGuess(game, 'guess1');
    makeGuess(game, 'guess2');
    makeGuess(game, 'guess3');
    makeGuess(game, 'guess4');
    makeGuess(game, 'guess5');
    makeGuess(game, 'guess6');
    expect(game.ended).toBe(true);
  });
});