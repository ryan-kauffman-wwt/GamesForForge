import React, { useState, useEffect } from 'react';

const WhackAMole = () => {
  const [moles, setMoles] = useState([false, false, false, false, false, false, false, false, false]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setMoles(moles.map(() => Math.random() > 0.5));
    }, 1000);
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [timeLeft]);

  const handleClick = (index) => {
    if (moles[index]) {
      setScore(score + 1);
      setMoles(moles.map((_, i) => i!== index));
    }
  };

  return (
    <div>
      <h1>Whack-a-Mole</h1>
      <p>Score: {score}</p>
      <p>Time Left: {timeLeft}</p>
      <div className="game-board">
        {moles.map((mole, index) => (
          <button key={index} onClick={() => handleClick(index)} className={mole? 'mole' : ''}>
            {mole? '🐭' : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WhackAMole;