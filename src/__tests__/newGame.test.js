import React from 'react';
import { render, screen } from '@testing-library/react';
import NewGame from '../components/NewGame';

describe('NewGame', () => {
  test('renders NewGame component', () => {
    render(<NewGame />);
    const linkElement = screen.getByText(/New Game/i);
    expect(linkElement).toBeInTheDocument();
  });
});