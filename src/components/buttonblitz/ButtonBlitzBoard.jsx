import { useState, useEffect, useRef, useCallback } from 'react'

const GAME_DURATION = 10
const LEADERBOARD_KEY = 'buttonblitz_leaderboard'
const MAX_LEADERBOARD = 10

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || []
  } catch {
    return []
  }
}

function saveLeaderboard(board) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board))
}

function addScore(name, clicks) {
  const board = getLeaderboard()
  board.push({ name, clicks, date: new Date().toLocaleDateString() })
  board.sort((a, b) => b.clicks - a.clicks)
  const trimmed = board.slice(0, MAX_LEADERBOARD)
  saveLeaderboard(trimmed)
  return trimmed
}

// Phases: 'idle' | 'countdown' | 'playing' | 'done'
export default function ButtonBlitzBoard() {
  const [phase, setPhase] = useState('idle')
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [clicks, setClicks] = useState(0)
  const [leaderboard, setLeaderboard] = useState(getLeaderboard())
  const [playerName, setPlayerName] = useState('')
  const [nameSaved, setNameSaved] = useState(false)
  const [shake, setShake] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [rank, setRank] = useState(null)

  const timerRef = useRef(null)
  const countdownRef = useRef(null)
  const clicksRef = useRef(0)

  // Keep ref in sync for use inside intervals
  useEffect(() => {
    clicksRef.current = clicks
  }, [clicks])

  const startCountdown = useCallback(() => {
    setPhase('countdown')
    setCountdown(3)
    setClicks(0)
    clicksRef.current = 0
    setTimeLeft(GAME_DURATION)
    setNameSaved(false)
    setRank(null)

    let c = 3
    countdownRef.current = setInterval(() => {
      c -= 1
      if (c <= 0) {
        clearInterval(countdownRef.current)
        setPhase('playing')
        startGame()
      } else {
        setCountdown(c)
      }
    }, 1000)
  }, [])

  const startGame = useCallback(() => {
    let t = GAME_DURATION
    timerRef.current = setInterval(() => {
      t -= 1
      setTimeLeft(t)
      if (t <= 0) {
        clearInterval(timerRef.current)
        setPhase('done')
      }
    }, 1000)
  }, [])

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      clearInterval(countdownRef.current)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (phase !== 'playing') return
    setClicks((c) => c + 1)
    // Trigger pulse animation
    setPulse(true)
    setTimeout(() => setPulse(false), 100)
  }, [phase])

  const handleSaveScore = () => {
    const name = playerName.trim() || 'Anonymous'
    const updated = addScore(name, clicks)
    setLeaderboard(updated)
    const pos = updated.findIndex(
      (e) => e.name === name && e.clicks === clicks
    )
    setRank(pos + 1)
    setNameSaved(true)
    // Shake if score is #1
    if (pos === 0) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  const progressPct = (timeLeft / GAME_DURATION) * 100
  const progressColor =
    timeLeft > 6 ? '#30d158' : timeLeft > 3 ? '#ff9f0a' : '#ff3b30'

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center gap-6">
      {/* Title */}
      <div className="text-center">
        <h2
          className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          style={{ color: 'var(--label-primary)' }}
        >
          👆 Button Blitz
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--label-secondary)' }}>
          Click the button as many times as you can in {GAME_DURATION} seconds!
        </p>
      </div>

      {/* ── IDLE ── */}
      {phase === 'idle' && (
        <div className="flex flex-col items-center gap-6 w-full">
          <button
            onClick={startCountdown}
            className="w-48 h-48 rounded-full text-white font-extrabold text-2xl shadow-xl transition-transform active:scale-95 hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#5e5ce6,#bf5af2)' }}
          >
            START
          </button>
          {leaderboard.length > 0 && <Leaderboard board={leaderboard} />}
        </div>
      )}

      {/* ── COUNTDOWN ── */}
      {phase === 'countdown' && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-semibold" style={{ color: 'var(--label-secondary)' }}>
            Get ready…
          </p>
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center text-7xl font-black shadow-xl"
            style={{ background: 'linear-gradient(135deg,#5e5ce6,#bf5af2)', color: '#fff' }}
          >
            {countdown}
          </div>
        </div>
      )}

      {/* ── PLAYING ── */}
      {phase === 'playing' && (
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Timer bar */}
          <div className="w-full">
            <div className="flex justify-between text-sm font-semibold mb-1"
              style={{ color: 'var(--label-secondary)' }}>
              <span>Time left</span>
              <span style={{ color: progressColor }}>{timeLeft}s</span>
            </div>
            <div
              className="w-full h-4 rounded-full overflow-hidden"
              style={{ background: 'var(--fill-tertiary)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%`, background: progressColor }}
              />
            </div>
          </div>

          {/* Click count */}
          <div
            className="text-7xl font-black tabular-nums"
            style={{ color: 'var(--label-primary)' }}
          >
            {clicks}
          </div>
          <p className="text-sm" style={{ color: 'var(--label-tertiary)' }}>clicks</p>

          {/* THE BIG BUTTON */}
          <button
            onClick={handleClick}
            className="w-56 h-56 rounded-full text-white font-extrabold text-3xl shadow-2xl select-none transition-transform active:scale-90"
            style={{
              background: 'linear-gradient(135deg,#ff6b6b,#ff9f0a)',
              transform: pulse ? 'scale(0.92)' : 'scale(1)',
              transition: 'transform 0.08s ease',
              WebkitTapHighlightColor: 'transparent',
            }}
            aria-label="Click me!"
          >
            CLICK!
          </button>
        </div>
      )}

      {/* ── DONE ── */}
      {phase === 'done' && (
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: 'var(--label-secondary)' }}>
              Time's up! 🎉
            </p>
            <p
              className="text-8xl font-black tabular-nums mt-2"
              style={{ color: 'var(--label-primary)' }}
            >
              {clicks}
            </p>
            <p className="text-lg font-semibold mt-1" style={{ color: 'var(--label-secondary)' }}>
              {clicks === 1 ? 'click' : 'clicks'}
            </p>
          </div>

          {/* Save score */}
          {!nameSaved ? (
            <div
              className="w-full rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <p className="font-semibold text-center" style={{ color: 'var(--label-primary)' }}>
                Save your score to the leaderboard
              </p>
              <input
                type="text"
                placeholder="Your name (optional)"
                maxLength={20}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveScore()}
                className="w-full rounded-xl px-4 py-2 text-sm border outline-none"
                style={{
                  background: 'var(--bg-primary)',
                  color: 'var(--label-primary)',
                  borderColor: 'var(--separator)',
                }}
              />
              <button
                onClick={handleSaveScore}
                className="w-full py-2 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#5e5ce6,#bf5af2)' }}
              >
                Save Score
              </button>
            </div>
          ) : (
            <div
              className="text-center rounded-2xl p-4"
              style={{ background: 'var(--bg-secondary)', color: 'var(--label-primary)' }}
            >
              {rank === 1 ? (
                <p className="font-bold text-lg">🏆 New #1! Amazing!</p>
              ) : rank !== null ? (
                <p className="font-bold text-lg">You ranked #{rank}! 🎯</p>
              ) : null}
            </div>
          )}

          {/* Play again */}
          <button
            onClick={startCountdown}
            className="px-8 py-3 rounded-2xl font-bold text-white text-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#30d158,#0a84ff)' }}
          >
            Play Again
          </button>

          {leaderboard.length > 0 && (
            <Leaderboard board={leaderboard} highlightClicks={nameSaved ? clicks : null} />
          )}
        </div>
      )}
    </div>
  )
}

function Leaderboard({ board, highlightClicks }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <div
        className="px-5 py-3 font-extrabold text-base tracking-wide"
        style={{
          background: 'linear-gradient(135deg,#5e5ce6,#bf5af2)',
          color: '#fff',
        }}
      >
        🏆 Leaderboard
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--separator)' }}>
        {board.map((entry, i) => {
          const isHighlighted = highlightClicks !== null && entry.clicks === highlightClicks && i === board.findIndex(e => e.clicks === highlightClicks)
          const medals = ['🥇', '🥈', '🥉']
          return (
            <div
              key={i}
              className="flex items-center px-5 py-3 gap-3 text-sm"
              style={{
                background: isHighlighted ? 'rgba(94,92,230,0.12)' : 'transparent',
                color: 'var(--label-primary)',
                fontWeight: isHighlighted ? 700 : 400,
              }}
            >
              <span className="w-6 text-center text-base">
                {medals[i] || `${i + 1}.`}
              </span>
              <span className="flex-1 truncate">{entry.name}</span>
              <span
                className="font-black text-base tabular-nums"
                style={{ color: isHighlighted ? '#5e5ce6' : 'var(--label-primary)' }}
              >
                {entry.clicks}
              </span>
              <span className="text-xs" style={{ color: 'var(--label-tertiary)' }}>
                {entry.date}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
