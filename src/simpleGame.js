/**
 * simpleGame — a silly little number-guessing game helper.
 *
 * Rules:
 *  - The secret number is always between 1 and 100 (inclusive).
 *  - Guesses outside that range are "out of range".
 *  - Otherwise the guess is compared to the target and rated
 *    "correct", "too high", or "too low".
 */

const simpleGame = {
  /**
   * Returns a random integer between 1 and 100 (inclusive).
   */
  generateNumber() {
    return Math.floor(Math.random() * 100) + 1;
  },

  /**
   * Compares a guess against the target number.
   *
   * @param {number} target  - The secret number (1–100).
   * @param {number} guess   - The player's guess.
   * @returns {'correct'|'too high'|'too low'|'out of range'}
   */
  checkGuess(target, guess) {
    if (guess < 1 || guess > 100) {
      return 'out of range';
    }
    if (guess === target) {
      return 'correct';
    }
    return guess > target ? 'too high' : 'too low';
  },
};

export default simpleGame;
