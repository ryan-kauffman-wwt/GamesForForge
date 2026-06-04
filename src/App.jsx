import React from 'react';
import './App.css';
import App from './App';
import { strict as assert } from 'assert';
import { render } from 'react-dom';
import StrandsGame from './components/StrandsGame/StrandsGame';

render(
  <React.StrictMode>
    <App />
    <StrandsGame />
  </React.StrictMode>,
  document.getElementById('root')
);