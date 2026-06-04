import { useState, useEffect, useRef, useCallback } from 'react'

const GAME_DURATION = 10
const LEADERBOARD_KEY = 'buttonblitz_leaderboard'
const MAX_LEADERBOARD = 10

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || []
  } catch {
    return []
  }
}

function saveLeaderboard(board) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board))
}

function getRank(board, score) {
  return board.filter((e) => e.score > score).length + 1
}

// Floating +1 particle
function Particle({ id, x, y, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 700)
    return () => clearTimeout(t)
  }, [id, onDone])

  return (
    <span
      className="particle"
      style={{ left: x, top: y }}
    >
      +1
    </span>
  )
}

export default function ButtonBlitzBoard() {
  const [phase, setPhase] = useState('idle') // idle | countdown | playing | result
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [clicks, setClicks] = useState(0)
  const [particles, setParticles] = useState([])
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard)
  const [playerName, setPlayerName] = useState('')
  const [savedScore, setSavedScore] = useState(null)
  const [nameError, setNameError] = useState('')
  const [buttonScale, setButtonScale] = useState(1)
  const [shake, setShake] = useState(false)
  const particleId = useRef(0)
  const timerRef = useRef(null)
  const countdownRef = useRef(null)
  const finalScore = useRef(0)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      clearInterval(countdownRef.current)
    }
  }, [])

  const startCountdown = () => {
    setPhase('countdown')
    setCountdown(3)
    setClicks(0)
    setTimeLeft(GAME_DURATION)
    setParticles([])
    setSavedScore(null)
    setPlayerName('')
    setNameError('')

    let c = 3
    countdownRef.current = setInterval(() => {
      c -= 1
      if (c <= 0) {
        clearInterval(countdownRef.current)
        startPlaying()
      } else {
        setCountdown(c)
      }
    }, 1000)
  }

  const startPlaying = () => {
    setPhase('playing')
    setTimeLeft(GAME_DURATION)
    setClicks(0)
    finalScore.current = 0

    let t = GAME_DURATION
    timerRef.current = setInterval(() => {
      t -= 1
      setTimeLeft(t)
      if (t <= 0) {
        clearInterval(timerRef.current)
        setPhase('result')
      }
    }, 1000)
  }

  const handleClick = useCallback(
    (e) => {
      if (phase !== 'playing') return

      setClicks((c) => {
        finalScore.current = c + 1
        return c + 1
      })

      // Floating particle
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = ++particleId.current
      setParticles((p) => [...p, { id, x, y }])

      // Button bounce
      setButtonScale(0.92)
      setTimeout(() => setButtonScale(1), 100)
    },
    [phase]
  )

  const removeParticle = useCallback((id) => {
    setParticles((p) => p.filter((pt) => pt.id !== id))
  }, [])

  const handleSave = () => {
    const name = playerName.trim()
    if (!name) {
      setNameError('Please enter your name!')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    const score = finalScore.current
    const entry = { name, score, date: new Date().toLocaleDateString() }
    const updated = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_LEADERBOARD)
    setLeaderboard(updated)
    saveLeaderboard(updated)
    setSavedScore(score)
    setNameError('')
  }

  const clearLeaderboard = () => {
    setLeaderboard([])
    saveLeaderboard([])
  }

  // Progress bar width
  const progressPct = (timeLeft / GAME_DURATION) * 100
  const progressColor =
    timeLeft > 5 ? '#30d158' : timeLeft > 2 ? '#ff9f0a' : '#ff3b30'

  // Rank medal
  const medal = (i) => ['🥇', '🥈', '🥉'][i] ?? `#${i + 1}`

  return (
    <div className="blitz-wrap">
      {/* ── IDLE ── */}
      {phase === 'idle' && (
        <div className="blitz-center">
          <div className="blitz-title-wrap">
            <span className="blitz-icon">👆</span>
            <h1 className="blitz-title">Button Blitz</h1>
            <p className="blitz-subtitle">
              Click the button as many times as you can in{' '}
              <strong>{GAME_DURATION} seconds</strong>!
            </p>
          </div>

          <button className="blitz-start-btn" onClick={startCountdown}>
            Play Now
          </button>

          {leaderboard.length > 0 && (
            <Leaderboard
              board={leaderboard}
              onClear={clearLeaderboard}
              highlight={null}
            />
          )}
        </div>
      )}

      {/* ── COUNTDOWN ── */}
      {phase === 'countdown' && (
        <div className="blitz-center">
          <p className="blitz-get-ready">Get ready…</p>
          <div className="blitz-countdown">{countdown}</div>
        </div>
      )}

      {/* ── PLAYING ── */}
      {phase === 'playing' && (
        <div className="blitz-center blitz-playing">
          {/* Timer bar */}
          <div className="blitz-timer-bar-wrap">
            <div
              className="blitz-timer-bar"
              style={{
                width: `${progressPct}%`,
                background: progressColor,
                transition: 'width 1s linear, background 0.3s',
              }}
            />
          </div>

          <div className="blitz-hud">
            <div className="blitz-hud-item">
              <span className="blitz-hud-label">Time</span>
              <span
                className="blitz-hud-value"
                style={{ color: progressColor }}
              >
                {timeLeft}s
              </span>
            </div>
            <div className="blitz-hud-item">
              <span className="blitz-hud-label">Clicks</span>
              <span className="blitz-hud-value">{clicks}</span>
            </div>
          </div>

          {/* Big clickable button */}
          <div className="blitz-btn-wrap">
            <button
              className="blitz-big-btn"
              style={{ transform: `scale(${buttonScale})` }}
              onClick={handleClick}
            >
              <span className="blitz-btn-label">CLICK!</span>
              <span className="blitz-btn-sub">{clicks}</span>
              {particles.map((p) => (
                <Particle
                  key={p.id}
                  id={p.id}
                  x={p.x}
                  y={p.y}
                  onDone={removeParticle}
                />
              ))}
            </button>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {phase === 'result' && (
        <div className="blitz-center">
          <div className="blitz-result-card">
            <div className="blitz-result-emoji">🎉</div>
            <h2 className="blitz-result-title">Time's Up!</h2>
            <p className="blitz-result-score">
              You clicked <strong>{finalScore.current}</strong> times
            </p>
            {leaderboard.length > 0 && (
              <p className="blitz-result-rank">
                Rank:{' '}
                <strong>
                  {medal(getRank(leaderboard, finalScore.current) - 1)}{' '}
                  {getRank(leaderboard, finalScore.current)} of{' '}
                  {Math.min(leaderboard.length + 1, MAX_LEADERBOARD)}
                </strong>
              </p>
            )}

            {savedScore === null ? (
              <div className={`blitz-save-form ${shake ? 'shake' : ''}`}>
                <input
                  className="blitz-name-input"
                  type="text"
                  maxLength={20}
                  placeholder="Your name…"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value)
                    setNameError('')
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                {nameError && (
                  <p className="blitz-name-error">{nameError}</p>
                )}
                <button className="blitz-save-btn" onClick={handleSave}>
                  Save Score
                </button>
              </div>
            ) : (
              <p className="blitz-saved-msg">✅ Score saved!</p>
            )}

            <button className="blitz-play-again-btn" onClick={startCountdown}>
              Play Again
            </button>
          </div>

          {leaderboard.length > 0 && (
            <Leaderboard
              board={leaderboard}
              onClear={clearLeaderboard}
              highlight={savedScore}
            />
          )}
        </div>
      )}
    </div>
  )
}

function Leaderboard({ board, onClear, highlight }) {
  const medal = (i) => ['🥇', '🥈', '🥉'][i] ?? `#${i + 1}`

  return (
    <div className="blitz-leaderboard">
      <div className="blitz-lb-header">
        <h3 className="blitz-lb-title">🏆 Leaderboard</h3>
        <button className="blitz-lb-clear" onClick={onClear}>
          Clear
        </button>
      </div>
      <ol className="blitz-lb-list">
        {board.map((entry, i) => (
          <li
            key={i}
            className={`blitz-lb-row ${
              highlight !== null && entry.score === highlight
                ? 'blitz-lb-row--highlight'
                : ''
            }`}
          >
            <span className="blitz-lb-rank">{medal(i)}</span>
            <span className="blitz-lb-name">{entry.name}</span>
            <span className="blitz-lb-score">{entry.score}</span>
            <span className="blitz-lb-date">{entry.date}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
