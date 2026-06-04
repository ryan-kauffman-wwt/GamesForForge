import { useState, useCallback } from 'react'
import { clsx } from 'clsx'

// ── Game Logic ────────────────────────────────────────────────────

const WINNING_COMBINATIONS = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
]

function checkWinner(squares) {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }
    }
  }
  return null
}

function isBoardFull(squares) {
  return squares.every((square) => square !== null)
}

function getAIMove(squares, playerSymbol) {
  const aiSymbol = playerSymbol === 'X' ? 'O' : 'X'

  // Check if AI can win
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      const testSquares = [...squares]
      testSquares[i] = aiSymbol
      if (checkWinner(testSquares)?.winner === aiSymbol) {
        return i
      }
    }
  }

  // Check if player can win, block them
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      const testSquares = [...squares]
      testSquares[i] = playerSymbol
      if (checkWinner(testSquares)?.winner === playerSymbol) {
        return i
      }
    }
  }

  // Take center if available
  if (squares[4] === null) return 4

  // Take a corner
  const corners = [0, 2, 6, 8]
  const availableCorners = corners.filter((i) => squares[i] === null)
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)]
  }

  // Take any available space
  const available = squares
    .map((square, i) => (square === null ? i : null))
    .filter((i) => i !== null)
  return available[Math.floor(Math.random() * available.length)]
}

// ── Square Component ──────────────────────────────────────────────

function Square({ value, onClick, disabled, isWinning, isHoverable }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={clsx(
        'w-full aspect-square rounded-xl font-bold text-3xl sm:text-4xl transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
        isWinning && 'scale-110 ring-2 ring-yellow-400',
        !disabled && value === null && isHoverable && 'hover:scale-105 hover:bg-blue-500/10 cursor-pointer',
        disabled && value === null && 'opacity-50',
        value === 'X' && 'text-blue-600 dark:text-blue-400',
        value === 'O' && 'text-red-600 dark:text-red-400'
      )}
      style={{
        background: isWinning
          ? 'linear-gradient(145deg, rgba(250,204,21,0.2), rgba(250,204,21,0.1))'
          : 'var(--bg-surface)',
        border: '2px solid var(--fill-secondary)',
        boxShadow: isWinning ? '0 0 12px rgba(250,204,21,0.3)' : 'var(--shadow-sm)',
      }}
    >
      {value}
    </button>
  )
}

// ── Board Component ───────────────────────────────────────────────

function Board({ squares, onClick, winningLine, gameActive }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-sm mx-auto aspect-square">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onClick(index)}
          disabled={!gameActive}
          isWinning={winningLine?.includes(index)}
          isHoverable={gameActive}
        />
      ))}
    </div>
  )
}

// ── Stats Bar ─────────────────────────────────────────────────────

function StatsBar({ playerWins, aiWins, draws }) {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {[
        { label: 'You', value: playerWins, color: 'text-blue-600 dark:text-blue-400' },
        { label: 'AI', value: aiWins, color: 'text-red-600 dark:text-red-400' },
        { label: 'Draws', value: draws, color: 'text-gray-600 dark:text-gray-400' },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--fill-tertiary)' }}
        >
          <span
            className={clsx('text-lg font-bold', color)}
            style={{ letterSpacing: '-0.02em' }}
          >
            {value}
          </span>
          <span
            className="text-xs font-semibold uppercase"
            style={{
              letterSpacing: '0.06em',
              color: 'var(--label-tertiary)',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Result Screen ─────────────────────────────────────────────────

function ResultScreen({ result, playerWins, aiWins, draws, onPlayAgain }) {
  let emoji, title, message

  if (result === 'player-win') {
    emoji = '🎉'
    title = 'You Win!'
    message = 'Great job!'
  } else if (result === 'ai-win') {
    emoji = '🤖'
    title = 'AI Wins!'
    message = 'Better luck next time!'
  } else if (result === 'draw') {
    emoji = '🤝'
    title = 'It\'s a Draw!'
    message = 'Well played!'
  }

  return (
    <div
      className="spring-pop flex flex-col items-center gap-6 p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background:
            result === 'player-win'
              ? 'linear-gradient(145deg, #34c759, #30d158)'
              : result === 'ai-win'
                ? 'linear-gradient(145deg, #ff3b30, #ff453a)'
                : 'linear-gradient(145deg, #5ac8fa, #0a84ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          boxShadow:
            result === 'player-win'
              ? '0 8px 24px rgba(52,199,89,0.35)'
              : result === 'ai-win'
                ? '0 8px 24px rgba(255,59,48,0.35)'
                : '0 8px 24px rgba(10,132,255,0.35)',
        }}
      >
        {emoji}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--label-primary)',
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--label-tertiary)' }}>
          {message}
        </p>
      </div>

      {/* Score */}
      <div className="flex gap-6">
        {[
          { label: 'You', value: playerWins },
          { label: 'AI', value: aiWins },
          { label: 'Draws', value: draws },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--label-primary)',
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--label-tertiary)',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <button onClick={onPlayAgain} className="btn-primary w-full">
        Play Again
      </button>
    </div>
  )
}

// ── Main Game Component ───────────────────────────────────────────

export default function TicTacToeBoard() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [playerWins, setPlayerWins] = useState(0)
  const [aiWins, setAiWins] = useState(0)
  const [draws, setDraws] = useState(0)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'player-win' | 'ai-win' | 'draw'
  const [winningLine, setWinningLine] = useState(null)
  const [isAIThinking, setIsAIThinking] = useState(false)

  const resetGame = useCallback(() => {
    setSquares(Array(9).fill(null))
    setGameState('playing')
    setWinningLine(null)
    setIsAIThinking(false)
  }, [])

  const handlePlayAgain = useCallback(() => {
    resetGame()
  }, [resetGame])

  const handleSquareClick = useCallback(
    (index) => {
      if (gameState !== 'playing' || squares[index] !== null || isAIThinking) {
        return
      }

      // Player move
      const newSquares = [...squares]
      newSquares[index] = 'X'
      setSquares(newSquares)

      // Check for player win
      const playerResult = checkWinner(newSquares)
      if (playerResult) {
        setWinningLine(playerResult.line)
        setGameState('player-win')
        setPlayerWins((w) => w + 1)
        return
      }

      // Check for draw
      if (isBoardFull(newSquares)) {
        setGameState('draw')
        setDraws((d) => d + 1)
        return
      }

      // AI move (with delay for better UX)
      setIsAIThinking(true)
      setTimeout(() => {
        const aiMove = getAIMove(newSquares, 'X')
        newSquares[aiMove] = 'O'
        setSquares(newSquares)

        // Check for AI win
        const aiResult = checkWinner(newSquares)
        if (aiResult) {
          setWinningLine(aiResult.line)
          setGameState('ai-win')
          setAiWins((w) => w + 1)
          setIsAIThinking(false)
          return
        }

        // Check for draw
        if (isBoardFull(newSquares)) {
          setGameState('draw')
          setDraws((d) => d + 1)
          setIsAIThinking(false)
          return
        }

        setIsAIThinking(false)
      }, 600)
    },
    [gameState, squares, isAIThinking]
  )

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-8">
      {/* Title */}
      <div className="text-center">
        <h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2"
          style={{ color: 'var(--label-primary)' }}
        >
          Tic Tac Toe
        </h2>
        <p style={{ color: 'var(--label-tertiary)' }}>
          {gameState === 'playing'
            ? isAIThinking
              ? 'AI is thinking...'
              : 'Your turn (X)'
            : ''}
        </p>
      </div>

      {/* Stats */}
      <StatsBar playerWins={playerWins} aiWins={aiWins} draws={draws} />

      {/* Game Board */}
      {gameState === 'playing' ? (
        <Board
          squares={squares}
          onClick={handleSquareClick}
          winningLine={winningLine}
          gameActive={!isAIThinking}
        />
      ) : (
        <ResultScreen
          result={gameState}
          playerWins={playerWins}
          aiWins={aiWins}
          draws={draws}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {/* Instructions */}
      {gameState === 'playing' && !isAIThinking && (
        <p
          className="text-center text-sm"
          style={{ color: 'var(--label-tertiary)' }}
        >
          Click a square to make your move
        </p>
      )}
    </div>
  )
}
