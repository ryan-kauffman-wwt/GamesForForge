import React, { useState } from 'react';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  const flipCard = (card) => {
    setFlippedCards([...flippedCards, card]);
  };

  return (
    <div>
      <h1>Memory Game</h1>
      <div className="game-board">
        {cards.map(card => (
          <div key={card.id} className="card" onClick={() => flipCard(card)}>
            {flippedCards.includes(card)? card.value : '?'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;