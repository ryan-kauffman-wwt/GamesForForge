import React, { useState } from 'react';

/**
 * SmallSimpleFunGame - A simple number guessing game.
 *
 * The player tries to guess a randomly generated number between 1 and 10.
 * They can start and stop the game, and their score increments with each
 * correct guess.
 */
function SmallSimpleFunGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [target, setTarget] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGuess('');
    setMessage('');
    setError('');
    setTarget(Math.floor(Math.random() * 10) + 1);
  };

  const stopGame = () => {
    setGameStarted(false);
    setMessage(`Game over! Your final score was ${score}.`);
    setGuess('');
    setError('');
    setTarget(null);
  };

  const handleGuess = () => {
    const parsed = parseInt(guess, 10);

    if (isNaN(parsed)) {
      setError('Please enter a valid number.');
      return;
    }

    if (parsed < 1 || parsed > 10) {
      setError('Please enter a number between 1 and 10.');
      return;
    }

    setError('');

    if (parsed === target) {
      setScore((prev) => prev + 1);
      setMessage('Correct! Guess again.');
      setTarget(Math.floor(Math.random() * 10) + 1);
    } else {
      setMessage(`Wrong! The number was ${target}. Try again.`);
      setTarget(Math.floor(Math.random() * 10) + 1);
    }

    setGuess('');
  };

  return (
    <div className="small-simple-fun-game">
      <h1>Small Simple Fun Game</h1>
      <p>Guess a number between 1 and 10!</p>

      {!gameStarted ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <>
          <p data-testid="score">Score: {score}</p>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess (1-10)"
            min={1}
            max={10}
            aria-label="guess"
          />
          <button onClick={handleGuess}>Submit Guess</button>
          <button onClick={stopGame}>Stop Game</button>
          {error && <p data-testid="error" role="alert">{error}</p>}
          {message && <p data-testid="message">{message}</p>}
        </>
      )}

      {!gameStarted && message && (
        <p data-testid="final-message">{message}</p>
      )}
    </div>
  );
}

export default SmallSimpleFunGame;
