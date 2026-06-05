import { useState, useEffect, useRef } from 'react'
import './FlappyBirdBoard.css'

const BIRD_SIZE = 20
const GRAVITY = 0.5
const JUMP_STRENGTH = -10
const PIPE_WIDTH = 60
const PIPE_GAP = 120
const PIPE_SPEED = 5
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const BIRD_X = 50
const PIPE_SPACING = 200

const FlappyBirdBoard = () => {
  const canvasRef = useRef(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const gameStateRef = useRef({
    birdY: 150,
    birdVelocity: 0,
    pipes: [],
    score: 0,
    gameActive: false,
  })
  const gameLoopRef = useRef(null)

  const randomGapY = () =>
    Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50

  // Game loop
  useEffect(() => {
    if (!gameStarted) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Initialise state
    gameStateRef.current = {
      birdY: 150,
      birdVelocity: 0,
      pipes: [
        { x: CANVAS_WIDTH, gapY: randomGapY(), scored: false },
        { x: CANVAS_WIDTH + PIPE_SPACING, gapY: randomGapY(), scored: false },
        { x: CANVAS_WIDTH + PIPE_SPACING * 2, gapY: randomGapY(), scored: false },
      ],
      score: 0,
      gameActive: true,
    }

    let animFrameId

    const endGame = () => {
      gameStateRef.current.gameActive = false
      setGameOver(true)
      cancelAnimationFrame(animFrameId)
    }

    const tick = () => {
      const state = gameStateRef.current
      if (!state.gameActive) return

      // --- Physics ---
      state.birdVelocity += GRAVITY
      state.birdY += state.birdVelocity

      // --- Move pipes ---
      state.pipes.forEach((pipe) => {
        pipe.x -= PIPE_SPEED
      })

      // --- Recycle off-screen pipes ---
      if (state.pipes[0].x < -PIPE_WIDTH) {
        state.pipes.shift()
        const lastX = state.pipes[state.pipes.length - 1].x
        state.pipes.push({ x: lastX + PIPE_SPACING, gapY: randomGapY(), scored: false })
      }

      // --- Score: bird centre crosses pipe right edge ---
      state.pipes.forEach((pipe) => {
        if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_X) {
          pipe.scored = true
          state.score++
          setScore(state.score)
        }
      })

      // --- Collision: ground / ceiling ---
      if (state.birdY > CANVAS_HEIGHT - BIRD_SIZE || state.birdY < 0) {
        endGame()
        return
      }

      // --- Collision: pipes ---
      const birdLeft = BIRD_X
      const birdRight = BIRD_X + BIRD_SIZE
      const birdTop = state.birdY
      const birdBottom = state.birdY + BIRD_SIZE

      for (const pipe of state.pipes) {
        if (
          birdRight > pipe.x &&
          birdLeft < pipe.x + PIPE_WIDTH &&
          (birdTop < pipe.gapY || birdBottom > pipe.gapY + PIPE_GAP)
        ) {
          endGame()
          return
        }
      }

      // --- Draw ---
      // Sky
      ctx.fillStyle = '#87CEEB'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Ground
      ctx.fillStyle = '#8B6914'
      ctx.fillRect(0, CANVAS_HEIGHT - 10, CANVAS_WIDTH, 10)
      ctx.fillStyle = '#5C8A1E'
      ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 10)

      // Pipes
      state.pipes.forEach((pipe) => {
        // Pipe body – top
        ctx.fillStyle = '#3A9E3A'
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY)
        // Pipe cap – top
        ctx.fillStyle = '#2D7D2D'
        ctx.fillRect(pipe.x - 4, pipe.gapY - 20, PIPE_WIDTH + 8, 20)

        // Pipe body – bottom
        const bottomY = pipe.gapY + PIPE_GAP
        ctx.fillStyle = '#3A9E3A'
        ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, CANVAS_HEIGHT - bottomY)
        // Pipe cap – bottom
        ctx.fillStyle = '#2D7D2D'
        ctx.fillRect(pipe.x - 4, bottomY, PIPE_WIDTH + 8, 20)
      })

      // Bird body
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(
        BIRD_X + BIRD_SIZE / 2,
        state.birdY + BIRD_SIZE / 2,
        BIRD_SIZE / 2,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      // Bird eye
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(BIRD_X + BIRD_SIZE * 0.7, state.birdY + BIRD_SIZE * 0.35, 3, 0, Math.PI * 2)
      ctx.fill()

      // Bird beak
      ctx.fillStyle = '#FF8C00'
      ctx.beginPath()
      ctx.moveTo(BIRD_X + BIRD_SIZE, state.birdY + BIRD_SIZE * 0.5)
      ctx.lineTo(BIRD_X + BIRD_SIZE + 8, state.birdY + BIRD_SIZE * 0.6)
      ctx.lineTo(BIRD_X + BIRD_SIZE, state.birdY + BIRD_SIZE * 0.7)
      ctx.fill()

      // Score
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'
      ctx.lineWidth = 3
      ctx.font = 'bold 28px Arial'
      ctx.strokeText(`${state.score}`, CANVAS_WIDTH / 2 - 10, 40)
      ctx.fillText(`${state.score}`, CANVAS_WIDTH / 2 - 10, 40)

      animFrameId = requestAnimationFrame(tick)
    }

    animFrameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animFrameId)
  }, [gameStarted])

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (gameStateRef.current.gameActive) {
          gameStateRef.current.birdVelocity = JUMP_STRENGTH
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCanvasClick = () => {
    if (gameStateRef.current.gameActive) {
      gameStateRef.current.birdVelocity = JUMP_STRENGTH
    }
  }

  const handleStart = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted((prev) => !prev) // toggle to force useEffect re-run
    // Use a small timeout so the toggle registers before resetting
    setTimeout(() => setGameStarted(true), 0)
  }

  const handleRestart = () => {
    setGameOver(false)
    setScore(0)
    setGameStarted(false)
    setTimeout(() => setGameStarted(true), 0)
  }

  return (
    <div className="flappy-bird-container">
      <h1>🐦 Flappy Bird</h1>

      {!gameStarted ? (
        <div className="game-intro">
          <p>Press <kbd>SPACE</kbd> / <kbd>↑</kbd> or click the canvas to flap!</p>
          <button onClick={handleStart} className="fb-button">
            Start Game
          </button>
        </div>
      ) : (
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            className="game-canvas"
          />
          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-content">
                <h2>Game Over!</h2>
                <p className="final-score">Score: {score}</p>
                <button onClick={handleRestart} className="fb-button">
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FlappyBirdBoard
