import { useState, useEffect, useRef, useCallback } from 'react'

// ── Upgrade Definitions ───────────────────────────────────────────

const INITIAL_UPGRADES = [
  {
    id: 'cursor',
    name: 'Better Cursor',
    emoji: '🖱️',
    baseCost: 10,
    cost: 10,
    effect: 2,
    type: 'click',
    description: '+2 clicks per click',
    purchased: 0,
  },
  {
    id: 'autoClicker',
    name: 'Auto Clicker',
    emoji: '⚙️',
    baseCost: 50,
    cost: 50,
    effect: 1,
    type: 'passive',
    description: '+1 click / sec',
    purchased: 0,
  },
  {
    id: 'doubleClick',
    name: 'Double Click',
    emoji: '✌️',
    baseCost: 100,
    cost: 100,
    effect: 5,
    type: 'click',
    description: '+5 clicks per click',
    purchased: 0,
  },
  {
    id: 'robot',
    name: 'Robot Worker',
    emoji: '🤖',
    baseCost: 200,
    cost: 200,
    effect: 5,
    type: 'passive',
    description: '+5 clicks / sec',
    purchased: 0,
  },
  {
    id: 'farm',
    name: 'Click Farm',
    emoji: '🏭',
    baseCost: 500,
    cost: 500,
    effect: 20,
    type: 'passive',
    description: '+20 clicks / sec',
    purchased: 0,
  },
  {
    id: 'mega',
    name: 'Mega Click',
    emoji: '💥',
    baseCost: 750,
    cost: 750,
    effect: 25,
    type: 'click',
    description: '+25 clicks per click',
    purchased: 0,
  },
]

function buildInitialState() {
  return {
    clicks: 0,
    clickValue: 1,
    cps: 0,
    upgrades: INITIAL_UPGRADES.map((u) => ({ ...u })),
  }
}

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return Math.floor(n).toString()
}

// ── Floating +N label ─────────────────────────────────────────────

function FloatingLabel({ id, value, x, y }) {
  return (
    <span
      key={id}
      className="pointer-events-none select-none absolute font-bold text-lg"
      style={{
        left: x,
        top: y,
        color: 'var(--label-primary)',
        opacity: 0,
        animation: 'floatUp 0.8s ease-out forwards',
        transform: 'translateX(-50%)',
        textShadow: '0 1px 4px rgba(0,0,0,0.25)',
        zIndex: 10,
      }}
    >
      +{value}
    </span>
  )
}

// ── Upgrade Card ──────────────────────────────────────────────────

function UpgradeCard({ upgrade, canAfford, onPurchase }) {
  return (
    <button
      onClick={() => onPurchase(upgrade.id)}
      disabled={!canAfford}
      className="flex flex-col gap-1 p-3 rounded-2xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      style={{
        background: 'var(--bg-surface)',
        border: '2px solid',
        borderColor: canAfford ? 'var(--fill-secondary)' : 'var(--fill-tertiary)',
        opacity: canAfford ? 1 : 0.45,
        cursor: canAfford ? 'pointer' : 'not-allowed',
        boxShadow: canAfford ? 'var(--shadow-sm)' : 'none',
        transform: canAfford ? undefined : 'none',
      }}
      onMouseEnter={(e) => {
        if (canAfford) e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
      }}
    >
      <span className="text-2xl leading-none">{upgrade.emoji}</span>
      <span
        className="font-bold text-sm leading-tight"
        style={{ color: 'var(--label-primary)' }}
      >
        {upgrade.name}
      </span>
      <span className="text-xs" style={{ color: 'var(--label-tertiary)' }}>
        {upgrade.description}
      </span>
      <span
        className="text-xs font-semibold mt-0.5"
        style={{ color: '#ff9f0a' }}
      >
        🪙 {formatNumber(upgrade.cost)}
        {upgrade.purchased > 0 && (
          <span style={{ color: 'var(--label-tertiary)' }}>
            {' '}
            · owned {upgrade.purchased}
          </span>
        )}
      </span>
    </button>
  )
}

// ── Main Component ────────────────────────────────────────────────

export default function ClickerBoard() {
  const [state, setState] = useState(buildInitialState)
  const [floats, setFloats] = useState([])
  const [pulse, setPulse] = useState(false)
  const floatId = useRef(0)
  const buttonRef = useRef(null)

  // Passive income tick
  useEffect(() => {
    if (state.cps <= 0) return
    const id = setInterval(() => {
      setState((s) => ({ ...s, clicks: s.clicks + s.cps }))
    }, 1000)
    return () => clearInterval(id)
  }, [state.cps])

  const handleClick = useCallback((e) => {
    setState((s) => ({ ...s, clicks: s.clicks + s.clickValue }))

    // Pulse animation
    setPulse(true)
    setTimeout(() => setPulse(false), 150)

    // Floating label position relative to button
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top - 20
      const id = floatId.current++
      setFloats((f) => [...f, { id, x, y }])
      setTimeout(() => setFloats((f) => f.filter((fl) => fl.id !== id)), 850)
    }
  }, [])

  const purchaseUpgrade = useCallback((upgradeId) => {
    setState((s) => {
      const upgrade = s.upgrades.find((u) => u.id === upgradeId)
      if (!upgrade || s.clicks < upgrade.cost) return s

      const newClicks = s.clicks - upgrade.cost
      const newUpgrades = s.upgrades.map((u) =>
        u.id === upgradeId
          ? {
              ...u,
              purchased: u.purchased + 1,
              cost: Math.ceil(u.cost * 1.15),
            }
          : u
      )

      const newClickValue =
        upgrade.type === 'click' ? s.clickValue + upgrade.effect : s.clickValue
      const newCps =
        upgrade.type === 'passive' ? s.cps + upgrade.effect : s.cps

      return {
        ...s,
        clicks: newClicks,
        clickValue: newClickValue,
        cps: newCps,
        upgrades: newUpgrades,
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    if (window.confirm('Reset all progress? This cannot be undone!')) {
      setState(buildInitialState())
      setFloats([])
    }
  }, [])

  const { clicks, clickValue, cps, upgrades } = state

  return (
    <>
      {/* Float-up keyframe injected once */}
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-60px); }
        }
      `}</style>

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-8">
        {/* Title */}
        <div className="text-center">
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: 'var(--label-primary)', letterSpacing: '-0.03em' }}
          >
            🖱️ Click Counter
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--label-tertiary)' }}>
            Click to earn — buy upgrades to earn faster
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {[
            { label: 'Clicks', value: formatNumber(clicks) },
            { label: 'Per Click', value: `+${clickValue}` },
            { label: 'Per Second', value: cps > 0 ? `+${cps}` : '—' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-2xl"
              style={{ background: 'var(--fill-tertiary)' }}
            >
              <span
                className="text-xl font-bold"
                style={{
                  color: 'var(--label-primary)',
                  letterSpacing: '-0.02em',
                }}
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

        {/* Big Click Button */}
        <div className="relative w-full flex justify-center">
          {/* Floating labels */}
          {floats.map((fl) => (
            <FloatingLabel
              key={fl.id}
              id={fl.id}
              value={clickValue}
              x={fl.x}
              y={fl.y}
            />
          ))}

          <button
            ref={buttonRef}
            onClick={handleClick}
            className="relative select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #667eea, #764ba2)',
              boxShadow: pulse
                ? '0 4px 20px rgba(102,126,234,0.5)'
                : '0 12px 40px rgba(102,126,234,0.45)',
              border: 'none',
              cursor: 'pointer',
              transform: pulse ? 'scale(0.93)' : 'scale(1)',
              transition: 'transform 0.12s ease, box-shadow 0.12s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 52, lineHeight: 1, pointerEvents: 'none' }}>
              🖱️
            </span>
            <span
              style={{
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '0.04em',
                pointerEvents: 'none',
              }}
            >
              CLICK!
            </span>
          </button>
        </div>

        {/* Upgrades */}
        <div className="w-full">
          <h2
            className="text-base font-bold mb-3"
            style={{ color: 'var(--label-secondary)', letterSpacing: '-0.01em' }}
          >
            Upgrades
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {upgrades.map((upgrade) => (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                canAfford={clicks >= upgrade.cost}
                onPurchase={purchaseUpgrade}
              />
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={resetGame}
          className="text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
          style={{
            background: 'var(--fill-tertiary)',
            color: '#ff3b30',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'rgba(255,59,48,0.12)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'var(--fill-tertiary)')
          }
        >
          Reset Game
        </button>
      </div>
    </>
  )
}
