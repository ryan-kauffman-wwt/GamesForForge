import React from 'react';
import { Link } from 'react-router-dom';
import SimpleGame from './SimpleGame/SimpleGame';

const GamePicker = ({ onGameSelect }) => {
  return (
    <div className='game-picker'>
      <h2>Choose a Game</h2>
      <ul>
        <li>
          <button onClick={() => onGameSelect('simple') }>
            Simple Game
          </button>
        </li>
        <!-- Other game options -->
      </ul>
    </div>
  );
};

export default GamePicker;