import { useState, useCallback } from 'react'
import { clsx } from 'clsx'

// ── Game Logic ────────────────────────────────────────────────────

const CHOICES = [
  { id: 'rock',     emoji: '🪨', label: 'Rock'     },
  { id: 'paper',   emoji: '📄', label: 'Paper'    },
  { id: 'scissors',emoji: '✂️', label: 'Scissors' },
  { id: 'lizard',  emoji: '🦎', label: 'Lizard'   },
  { id: 'spock',   emoji: '🖖', label: 'Spock'    },
]

// beats[a] = list of choices that a defeats
const BEATS = {
  rock:     ['scissors', 'lizard'],
  paper:    ['rock',     'spock'],
  scissors: ['paper',   'lizard'],
  lizard:   ['spock',   'paper'],
  spock:    ['rock',    'scissors'],
}

// Flavour text for each matchup
const OUTCOME_TEXT = {
  'rock-scissors':     'Rock crushes Scissors',
  'rock-lizard':       'Rock crushes Lizard',
  'paper-rock':        'Paper covers Rock',
  'paper-spock':       'Paper disproves Spock',
  'scissors-paper':    'Scissors cuts Paper',
  'scissors-lizard':   'Scissors decapitates Lizard',
  'lizard-spock':      'Lizard poisons Spock',
  'lizard-paper':      'Lizard eats Paper',
  'spock-rock':        'Spock vaporizes Rock',
  'spock-scissors':    'Spock smashes Scissors',
}

function getResult(player, cpu) {
  if (player === cpu) return 'draw'
  if (BEATS[player].includes(cpu)) return 'win'
  return 'lose'
}

function getOutcomeText(player, cpu) {
  const key = `${player}-${cpu}`
  const reverseKey = `${cpu}-${player}`
  return OUTCOME_TEXT[key] || OUTCOME_TEXT[reverseKey] || ''
}

function randomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)].id
}

// ── Choice Button ─────────────────────────────────────────────────

function ChoiceButton({ choice, onClick, disabled, selected, dim }) {
  return (
    <button
      onClick={() => onClick(choice.id)}
      disabled={disabled}
      className={clsx(
        'flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-2xl font-semibold',
        'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
        !disabled && 'hover:scale-105 cursor-pointer',
        selected && 'scale-110 ring-2 ring-blue-500',
        dim && 'opacity-30 scale-95',
        disabled && !selected && !dim && 'cursor-not-allowed',
      )}
      style={{
        background: selected
          ? 'linear-gradient(145deg, rgba(0,122,255,0.18), rgba(0,122,255,0.08))'
          : 'var(--bg-surface)',
        border: selected ? '2px solid var(--accent)' : '2px solid var(--fill-secondary)',
        boxShadow: selected ? '0 0 16px rgba(0,122,255,0.25)' : 'var(--shadow-sm)',
        minWidth: 72,
      }}
    >
      <span className="text-3xl sm:text-4xl leading-none">{choice.emoji}</span>
      <span
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: selected ? 'var(--accent)' : 'var(--label-tertiary)' }}
      >
        {choice.label}
      </span>
    </button>
  )
}

// ── Stats Bar ─────────────────────────────────────────────────────

function StatsBar({ wins, losses, draws }) {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {[
        { label: 'Wins',   value: wins,   color: 'text-green-600 dark:text-green-400' },
        { label: 'Losses', value: losses, color: 'text-red-600 dark:text-red-400'   },
        { label: 'Draws',  value: draws,  color: 'text-gray-500 dark:text-gray-400' },
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
            style={{ letterSpacing: '0.06em', color: 'var(--label-tertiary)' }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Round Result Display ──────────────────────────────────────────

function RoundResult({ playerChoice, cpuChoice, result, outcomeText, onNext }) {
  const resultConfig = {
    win:  { emoji: '🎉', label: 'You Win!',    gradient: 'linear-gradient(145deg, #34c759, #30d158)', shadow: 'rgba(52,199,89,0.35)'   },
    lose: { emoji: '😬', label: 'You Lose!',   gradient: 'linear-gradient(145deg, #ff3b30, #ff453a)', shadow: 'rgba(255,59,48,0.35)'   },
    draw: { emoji: '🤝', label: "It's a Tie!", gradient: 'linear-gradient(145deg, #5ac8fa, #0a84ff)', shadow: 'rgba(10,132,255,0.35)' },
  }
  const cfg = resultConfig[result]
  const playerObj = CHOICES.find((c) => c.id === playerChoice)
  const cpuObj    = CHOICES.find((c) => c.id === cpuChoice)

  return (
    <div
      className="spring-pop flex flex-col items-center gap-5 p-6 sm:p-8 rounded-3xl w-full max-w-sm mx-auto"
      style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
    >
      {/* Result badge */}
      <div
        style={{
          width: 72, height: 72,
          borderRadius: 20,
          background: cfg.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32,
          boxShadow: `0 8px 24px ${cfg.shadow}`,
        }}
      >
        {cfg.emoji}
      </div>

      <h2
        style={{
          fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em',
          color: 'var(--label-primary)',
        }}
      >
        {cfg.label}
      </h2>

      {/* VS display */}
      <div className="flex items-center gap-4 w-full justify-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl">{playerObj.emoji}</span>
          <span className="text-xs font-semibold uppercase" style={{ color: 'var(--label-tertiary)' }}>
            You
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--label-secondary)' }}>
            {playerObj.label}
          </span>
        </div>

        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--label-quaternary)' }}>VS</span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl">{cpuObj.emoji}</span>
          <span className="text-xs font-semibold uppercase" style={{ color: 'var(--label-tertiary)' }}>
            CPU
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--label-secondary)' }}>
            {cpuObj.label}
          </span>
        </div>
      </div>

      {/* Flavour text */}
      {outcomeText && (
        <p
          className="text-center text-sm font-medium px-2"
          style={{ color: 'var(--label-tertiary)' }}
        >
          {outcomeText}
        </p>
      )}

      <button onClick={onNext} className="btn-primary w-full">
        Next Round
      </button>
    </div>
  )
}

// ── Main Game Component ───────────────────────────────────────────

export default function RPSLSBoard() {
  const [phase, setPhase] = useState('pick')       // 'pick' | 'result'
  const [playerChoice, setPlayerChoice] = useState(null)
  const [cpuChoice, setCpuChoice]       = useState(null)
  const [result, setResult]             = useState(null)
  const [outcomeText, setOutcomeText]   = useState('')
  const [wins, setWins]     = useState(0)
  const [losses, setLosses] = useState(0)
  const [draws, setDraws]   = useState(0)

  const handlePick = useCallback((choiceId) => {
    const cpu = randomChoice()
    const res = getResult(choiceId, cpu)
    const text = res !== 'draw' ? getOutcomeText(choiceId, cpu) : "Great minds think alike!"

    setPlayerChoice(choiceId)
    setCpuChoice(cpu)
    setResult(res)
    setOutcomeText(text)
    setPhase('result')

    if (res === 'win')  setWins((w)   => w + 1)
    if (res === 'lose') setLosses((l) => l + 1)
    if (res === 'draw') setDraws((d)  => d + 1)
  }, [])

  const handleNext = useCallback(() => {
    setPlayerChoice(null)
    setCpuChoice(null)
    setResult(null)
    setOutcomeText('')
    setPhase('pick')
  }, [])

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 px-4 py-2">
      {/* Title */}
      <div className="text-center">
        <h1
          className="font-display text-gradient"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}
        >
          Rock Paper Scissors
        </h1>
        <p style={{ color: 'var(--label-tertiary)', fontSize: '0.9rem', marginTop: 2 }}>
          Lizard Spock 🖖
        </p>
      </div>

      {/* Stats */}
      <StatsBar wins={wins} losses={losses} draws={draws} />

      {/* Game area */}
      {phase === 'pick' ? (
        <div
          className="w-full flex flex-col items-center gap-6 p-6 rounded-3xl"
          style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)' }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: 'var(--label-tertiary)' }}
          >
            Make your move
          </p>

          {/* Choice grid — pentagon-ish layout */}
          <div className="grid grid-cols-3 gap-3 w-full place-items-center">
            {CHOICES.slice(0, 3).map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                onClick={handlePick}
                disabled={false}
                selected={false}
                dim={false}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 w-full max-w-[200px] place-items-center mx-auto">
            {CHOICES.slice(3).map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                onClick={handlePick}
                disabled={false}
                selected={false}
                dim={false}
              />
            ))}
          </div>
        </div>
      ) : (
        <RoundResult
          playerChoice={playerChoice}
          cpuChoice={cpuChoice}
          result={result}
          outcomeText={outcomeText}
          onNext={handleNext}
        />
      )}

      {/* Rules reference */}
      <details
        className="w-full rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)' }}
      >
        <summary
          className="px-5 py-3 cursor-pointer text-sm font-semibold select-none"
          style={{ color: 'var(--label-secondary)' }}
        >
          📖 How it works
        </summary>
        <div className="px-5 pb-4 pt-1 flex flex-col gap-1.5">
          {Object.entries(BEATS).map(([attacker, victims]) =>
            victims.map((victim) => {
              const key = `${attacker}-${victim}`
              const aObj = CHOICES.find((c) => c.id === attacker)
              const vObj = CHOICES.find((c) => c.id === victim)
              return (
                <p key={key} className="text-sm" style={{ color: 'var(--label-tertiary)' }}>
                  {aObj.emoji} <strong style={{ color: 'var(--label-secondary)' }}>{aObj.label}</strong>{' '}
                  — {OUTCOME_TEXT[key]} —{' '}
                  {vObj.emoji} <strong style={{ color: 'var(--label-secondary)' }}>{vObj.label}</strong>
                </p>
              )
            })
          )}
        </div>
      </details>
    </div>
  )
}
