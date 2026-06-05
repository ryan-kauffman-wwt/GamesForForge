import React, { useState } from 'react';

const NewGame = () => {
  const [score, setScore] = useState(0);

  const handleClick = () => {
    setScore(score + 1);
  };

  return (
    <div>
      <h1>New Game</h1>
      <p>Score: {score}</p>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
};

export default NewGame;