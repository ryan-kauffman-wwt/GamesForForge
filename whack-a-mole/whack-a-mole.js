/**
 * WhackAMole - A simple Whack-a-Mole game constructor
 */
function WhackAMole(options) {
  if (!(this instanceof WhackAMole)) {
    return new WhackAMole(options);
  }
  options = options || {};
  this.duration = options.duration !== undefined ? options.duration : 30000;
  this.moleCount = options.moleCount !== undefined ? options.moleCount : 9;
  this.score = 0;
  this.isRunning = false;
  this._activeMoles = new Array(this.moleCount).fill(false);
  this._timers = [];
}

WhackAMole.prototype.start = function () {
  if (this.isRunning) return;
  this.isRunning = true;
  this.score = 0;
  this._activeMoles = new Array(this.moleCount).fill(false);
  this._scheduleNextMole();

  var self = this;
  this._gameTimer = setTimeout(function () {
    self.stop();
  }, this.duration);
};

WhackAMole.prototype.stop = function () {
  this.isRunning = false;
  this._timers.forEach(function (t) { clearTimeout(t); });
  this._timers = [];
  if (this._gameTimer) {
    clearTimeout(this._gameTimer);
    this._gameTimer = null;
  }
  this._activeMoles = new Array(this.moleCount).fill(false);
};

WhackAMole.prototype.whack = function (index) {
  if (!this.isRunning) return false;
  if (index < 0 || index >= this.moleCount) return false;
  if (!this._activeMoles[index]) return false;
  this._activeMoles[index] = false;
  this.score += 1;
  return true;
};

WhackAMole.prototype.getMoles = function () {
  return this._activeMoles.slice();
};

WhackAMole.prototype.getScore = function () {
  return this.score;
};

WhackAMole.prototype._scheduleNextMole = function () {
  if (!this.isRunning) return;
  var self = this;
  var delay = Math.floor(Math.random() * 800) + 400;
  var t = setTimeout(function () {
    if (!self.isRunning) return;
    var inactive = [];
    self._activeMoles.forEach(function (active, i) {
      if (!active) inactive.push(i);
    });
    if (inactive.length > 0) {
      var idx = inactive[Math.floor(Math.random() * inactive.length)];
      self._activeMoles[idx] = true;
      var hideDelay = Math.floor(Math.random() * 600) + 600;
      var hideTimer = setTimeout(function () {
        self._activeMoles[idx] = false;
      }, hideDelay);
      self._timers.push(hideTimer);
    }
    self._scheduleNextMole();
  }, delay);
  this._timers.push(t);
};

// Expose globally for Jest tests that reference WhackAMole without require()
if (typeof global !== 'undefined') {
  global.WhackAMole = WhackAMole;
}

module.exports = WhackAMole;
