/**
 * WhackAMole - A simple Whack-a-Mole game constructor.
 *
 * Creates a game instance where moles pop up at random intervals
 * and the player scores points by "whacking" them in time.
 */
function WhackAMole(options) {
  if (!(this instanceof WhackAMole)) {
    return new WhackAMole(options);
  }

  const opts = options || {};

  this.score = 0;
  this.lives = opts.lives !== undefined ? opts.lives : 3;
  this.duration = opts.duration !== undefined ? opts.duration : 30000; // ms
  this.moleCount = opts.moleCount !== undefined ? opts.moleCount : 9;
  this.isRunning = false;
  this._timers = [];
}

/**
 * Start the game.
 */
WhackAMole.prototype.start = function () {
  this.score = 0;
  this.isRunning = true;
};

/**
 * Stop the game.
 */
WhackAMole.prototype.stop = function () {
  this.isRunning = false;
  this._timers.forEach(function (t) { clearTimeout(t); });
  this._timers = [];
};

/**
 * Whack a mole — increments score if the mole is active.
 * @param {boolean} moleActive - Whether the mole is currently up.
 * @returns {boolean} Whether the whack was successful.
 */
WhackAMole.prototype.whack = function (moleActive) {
  if (!this.isRunning) return false;
  if (moleActive) {
    this.score += 1;
    return true;
  }
  return false;
};

/**
 * Get the current score.
 * @returns {number}
 */
WhackAMole.prototype.getScore = function () {
  return this.score;
};

module.exports = WhackAMole;
