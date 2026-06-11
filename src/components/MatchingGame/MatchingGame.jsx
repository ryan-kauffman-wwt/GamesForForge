import React, { useState, useEffect } from 'react';
import dog1 from '../../assets/dogArt/dog1.png';
import dog2 from '../../assets/dogArt/dog2.png';
import dog3 from '../../assets/dogArt/dog3.png';
import dog4 from '../../assets/dogArt/dog4.png';

const MatchingGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  useEffect(() => {
    const initialCards = [
      { id: 1, image: dog1, matched: false },
      { id: 2, image: dog2, matched: false },
      { id: 3, image: dog3, matched: false },
      { id: 4, image: dog4, matched: false },
      { id: 5, image: dog1, matched: false },
      { id: 6, image: dog2, matched: false },
      { id: 7, image: dog3, matched: false },
      { id: 8, image: dog4, matched: false },
    ];
    setCards(initialCards.sort(() => Math.random() - 0.5));
  }, []);

  const handleCardClick = (card) => {
    if (flippedCards.length < 2 &&!matchedCards.includes(card.id)) {
      setFlippedCards([...flippedCards, card.id]);
      if (flippedCards.length === 1) {
        const [firstCard] = flippedCards;
        if (cards[firstCard - 1].image === card.image) {
          setMatchedCards([...matchedCards, firstCard, card.id]);
        }
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <div className="matching-game">
      {cards.map(card => (
        <div key={card.id} className={`card ${flippedCards.includes(card.id) || matchedCards.includes(card.id)? 'flipped' : ''}`} onClick={() => handleCardClick(card)}>
          {flippedCards.includes(card.id) || matchedCards.includes(card.id)? <img src={card.image} alt="Dog" /> : 'Flip Me!'}
        </div>
      ))}
    </div>
  );
};

export default MatchingGame;