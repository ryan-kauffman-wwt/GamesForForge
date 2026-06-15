import React from 'react';
import { render, screen } from '@testing-library/react';
import SimpleGame from '../../components/SimpleGame';

describe('SimpleGame', () => {
  test('renders game title', () => {
    render(<SimpleGame />);
    expect(screen.getByText(/simple game/i)).toBeInTheDocument();
  });

  test('starts with 0 score', () => {
    render(<SimpleGame />);
    expect(screen.getByText(/score: 0/i)).toBeInTheDocument();
  });

  test('increments score on button click', () => {
    render(<SimpleGame />);
    const button = screen.getByRole('button', { name: /play/i });
    fireEvent.click(button);
    expect(screen.getByText(/score: 1/i)).toBeInTheDocument();
  });
});