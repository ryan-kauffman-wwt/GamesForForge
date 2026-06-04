import { useState, useEffect, useRef, useCallback } from 'react'

const GAME_DURATION = 10
const STORAGE_KEY = 'buttonmasher_leaderboard'
const MAX_LEADERBOARD = 10

function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLeaderboard(board) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
  } catch {
    // ignore
  }
}

function getRankEmoji(rank) {
  if (rank === 0) return '🥇'
  if (rank === 1) return '🥈'
  if (rank === 2) return '🥉'
  return `${rank + 1}.`
}

export default function ButtonMasherBoard() {
  const [phase, setPhase] = useState('idle') // idle | playing | done
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard)
  const [playerName, setPlayerName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [lastScore, setLastScore] = useState(null)
  const [newEntryIndex, setNewEntryIndex] = useState(null)
  const [ripples, setRipples] = useState([])
  const intervalRef = useRef(null)
  const rippleId = useRef(0)

  // Countdown timer
  useEffect(() => {
    if (phase !== 'playing') return
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          setPhase('done')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [phase])

  const startGame = () => {
    setClicks(0)
    setTimeLeft(GAME_DURATION)
    setLastScore(null)
    setNewEntryIndex(null)
    setRipples([])
    setPhase('playing')
  }

  const handleButtonClick = useCallback(
    (e) => {
      if (phase !== 'playing') return
      setClicks((c) => c + 1)

      // Ripple effect
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = ++rippleId.current
      setRipples((prev) => [...prev, { id, x, y }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
    },
    [phase]
  )

  // When game ends, save score
  useEffect(() => {
    if (phase !== 'done') return
    setLastScore(clicks)
    const name = playerName.trim() || 'Anonymous'
    const entry = { name, score: clicks, date: new Date().toLocaleDateString() }
    const updated = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_LEADERBOARD)
    const idx = updated.findIndex(
      (e) => e.name === entry.name && e.score === entry.score && e.date === entry.date
    )
    setNewEntryIndex(idx)
    setLeaderboard(updated)
    saveLeaderboard(updated)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNameSubmit = (e) => {
    e.preventDefault()
    const name = nameInput.trim()
    if (name) setPlayerName(name)
    setNameInput('')
  }

  const clearLeaderboard = () => {
    setLeaderboard([])
    saveLeaderboard([])
    setNewEntryIndex(null)
  }

  const timerPct = (timeLeft / GAME_DURATION) * 100
  const timerColor =
    timeLeft > 6 ? '#30d158' : timeLeft > 3 ? '#ff9f0a' : '#ff453a'

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 px-4 py-6 select-none">
      {/* Title */}
      <div className="text-center">
        <h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          style={{ color: 'var(--label-primary)' }}
        >
          👆 Button Masher
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--label-secondary)' }}>
          Click the button as many times as you can in {GAME_DURATION} seconds!
        </p>
      </div>

      {/* Name form (shown when not playing) */}
      {phase !== 'playing' && (
        <form
          onSubmit={handleNameSubmit}
          className="flex items-center gap-2 w-full max-w-xs"
        >
          <input
            type="text"
            maxLength={20}
            placeholder="Your name (optional)"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="flex-1 rounded-xl px-3 py-2 text-sm border outline-none"
            style={{
              background: 'var(--fill-secondary)',
              color: 'var(--label-primary)',
              borderColor: 'var(--separator)',
            }}
          />
          <button
            type="submit"
            className="rounded-xl px-3 py-2 text-sm font-semibold"
            style={{
              background: 'var(--fill-tertiary)',
              color: 'var(--label-primary)',
            }}
          >
            Set
          </button>
        </form>
      )}

      {/* Scoreboard row */}
      <div className="flex items-center gap-6">
        {/* Click counter */}
        <div className="text-center">
          <div
            className="text-5xl font-black tabular-nums"
            style={{ color: 'var(--label-primary)' }}
          >
            {clicks}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--label-tertiary)' }}>
            clicks
          </div>
        </div>

        {/* Timer ring */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="var(--fill-secondary)"
              strokeWidth="8"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={timerColor}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - timerPct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
            />
          </svg>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span
              className="text-2xl font-black tabular-nums leading-none"
              style={{ color: timerColor }}
            >
              {timeLeft}
            </span>
            <span className="text-xs" style={{ color: 'var(--label-tertiary)' }}>
              sec
            </span>
          </div>
        </div>
      </div>

      {/* Result banner */}
      {phase === 'done' && (
        <div
          className="w-full rounded-2xl px-5 py-4 text-center"
          style={{ background: 'var(--fill-secondary)' }}
        >
          <p className="text-lg font-bold" style={{ color: 'var(--label-primary)' }}>
            Time's up! 🎉
          </p>
          <p className="text-4xl font-black mt-1" style={{ color: '#5e5ce6' }}>
            {lastScore} clicks
          </p>
          {newEntryIndex === 0 && (
            <p className="text-sm mt-1 font-semibold" style={{ color: '#ff9f0a' }}>
              🏆 New all-time record!
            </p>
          )}
        </div>
      )}

      {/* Big Button */}
      {phase === 'playing' ? (
        <button
          onClick={handleButtonClick}
          className="relative overflow-hidden w-56 h-56 rounded-full font-black text-white text-2xl shadow-2xl active:scale-95"
          style={{
            background: 'linear-gradient(145deg, #5e5ce6, #bf5af2)',
            boxShadow: '0 8px 32px rgba(94,92,230,0.5)',
            transition: 'transform 0.05s',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'manipulation',
          }}
        >
          CLICK!
          {ripples.map((r) => (
            <span
              key={r.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: r.x - 40,
                top: r.y - 40,
                width: 80,
                height: 80,
                background: 'rgba(255,255,255,0.35)',
                animation: 'masher-ripple 0.6s ease-out forwards',
              }}
            />
          ))}
        </button>
      ) : (
        <button
          onClick={startGame}
          className="w-56 h-56 rounded-full font-black text-white text-2xl shadow-2xl active:scale-95 hover:scale-105"
          style={{
            background:
              phase === 'done'
                ? 'linear-gradient(145deg, #30d158, #34c759)'
                : 'linear-gradient(145deg, #5e5ce6, #bf5af2)',
            boxShadow:
              phase === 'done'
                ? '0 8px 32px rgba(48,209,88,0.45)'
                : '0 8px 32px rgba(94,92,230,0.5)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            touchAction: 'manipulation',
          }}
        >
          {phase === 'done' ? 'PLAY AGAIN' : 'START!'}
        </button>
      )}

      {/* Leaderboard */}
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{ background: 'var(--fill-secondary)' }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--separator)' }}
        >
          <h3
            className="font-bold text-base"
            style={{ color: 'var(--label-primary)' }}
          >
            🏆 Leaderboard
          </h3>
          {leaderboard.length > 0 && (
            <button
              onClick={clearLeaderboard}
              className="text-xs px-2 py-1 rounded-lg"
              style={{
                color: '#ff453a',
                background: 'rgba(255,69,58,0.12)',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {leaderboard.length === 0 ? (
          <p
            className="text-center text-sm py-6"
            style={{ color: 'var(--label-tertiary)' }}
          >
            No scores yet — be the first!
          </p>
        ) : (
          <ol>
            {leaderboard.map((entry, i) => (
              <li
                key={`${entry.name}-${entry.score}-${i}`}
                className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0"
                style={{
                  borderColor: 'var(--separator)',
                  background:
                    i === newEntryIndex
                      ? 'rgba(94,92,230,0.12)'
                      : 'transparent',
                }}
              >
                {/* Rank */}
                <span
                  className="w-8 text-center font-bold text-sm"
                  style={{ color: i < 3 ? '#ff9f0a' : 'var(--label-tertiary)' }}
                >
                  {getRankEmoji(i)}
                </span>

                {/* Name */}
                <span
                  className="flex-1 font-semibold text-sm truncate"
                  style={{ color: 'var(--label-primary)' }}
                >
                  {entry.name}
                  {i === newEntryIndex && (
                    <span
                      className="ml-2 text-xs font-normal"
                      style={{ color: '#5e5ce6' }}
                    >
                      ← you
                    </span>
                  )}
                </span>

                {/* Score */}
                <span
                  className="font-black text-base tabular-nums"
                  style={{ color: 'var(--label-primary)' }}
                >
                  {entry.score}
                </span>

                {/* Date */}
                <span
                  className="text-xs ml-1"
                  style={{ color: 'var(--label-tertiary)' }}
                >
                  {entry.date}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Ripple keyframe injected once */}
      <style>{`
        @keyframes masher-ripple {
          0%   { transform: scale(0.2); opacity: 1; }
          100% { transform: scale(4);   opacity: 0; }
        }
      `}</style>
    </div>
  )
}
