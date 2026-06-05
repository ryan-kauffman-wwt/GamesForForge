import { render, screen } from '@testing-library/react'
import SimpleGame from './SimpleGame'

describe('SimpleGame', () => {
  test('renders SimpleGame component', () => {
    render(<SimpleGame />)
    const linkElement = screen.getByText(/Simple Game/i)
    expect(linkElement).toBeInTheDocument()
  })
})