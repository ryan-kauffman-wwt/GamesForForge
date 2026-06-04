import React from 'react';
import { strandsPuzzles } from '../../data/strandsData/strandsData';

const StrandsGame = () => {
  const puzzle = strandsPuzzles[0];
  return (
    <div>
      <h1>Strands Game</h1>
      <ul>
        {puzzle.words.map(word => <li key={word}>{word}</li>)}
      </ul>
    </div>
  );
};

export default StrandsGame;