import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MatchingGame from '../components/MatchingGame/MatchingGame';

describe('MatchingGame', () => {
  test('renders without crashing', () => {
    render(<MatchingGame />);
  });

  test('card flipping functionality', () => {
    const { getByTestId } = render(<MatchingGame />);
    const card = getByTestId('card');
    fireEvent.click(card);
    expect(card).toHaveClass('flipped');
  });

  test('matching logic', () => {
    const { getByTestId } = render(<MatchingGame />);
    const card1 = getByTestId('card-1');
    const card2 = getByTestId('card-2');
    fireEvent.click(card1);
    fireEvent.click(card2);
    expect(card1).toHaveClass('matched');
    expect(card2).toHaveClass('matched');
  });

  test('win condition', () => {
    const { getByText } = render(<MatchingGame />);
    expect(getByText('You Win!')).toBeInTheDocument();
  });
});