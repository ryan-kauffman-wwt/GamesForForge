const GAME_METADATA = {
  'whack-a-mole': {
    title: 'Whack-a-Mole',
    emoji: '🐭',
    description:
      'A fast-paced reflex game where moles pop up from holes on a 3×3 grid and you must click them before they disappear. Race against a 60-second countdown to score as many points as possible!',
    howToPlay: [
      'Moles randomly appear in one of nine holes every second.',
      'Click a mole while it is visible to earn **+1 point**.',
      'Missed moles score nothing — stay sharp!',
      'The timer starts at **60 seconds** and counts down.',
      'When time runs out, the game ends and your final score is displayed.',
    ],
    controls: 'Mouse click / tap on a mole to whack it.',
    tips: [
      'Watch the whole grid — moles can appear anywhere.',
      'Quick clicks beat hesitation; moles vanish after one second.',
      'Try to maintain a rhythm rather than chasing individual moles.',
    ],
  },
  'tic-tac-toe': {
    title: 'Tic-Tac-Toe',
    emoji: '❌',
    description:
      'The classic two-player strategy game on a 3×3 grid. Play against an AI opponent and try to get three of your marks in a row before it does.',
    howToPlay: [
      'You play as **X**, the AI plays as **O**.',
      'Click any empty cell to place your mark.',
      'First player to get three in a row (horizontal, vertical, or diagonal) wins.',
      'If all nine cells are filled with no winner, the game is a draw.',
    ],
    controls: 'Mouse click / tap on an empty cell to place your mark.',
    tips: [
      'Corners are the strongest opening moves.',
      'Block the AI whenever it has two marks in a row.',
      'Control the center to maximise winning lines.',
    ],
  },
};

const DEFAULT_METADATA = {
  title: (game) =>
    game
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
  emoji: '🎮',
  description: (game) => `A fun browser-based ${game} game built with React and Vite.`,
  howToPlay: ['Follow the on-screen instructions to play.'],
  controls: 'Mouse click / tap to interact.',
  tips: ['Have fun!'],
};

/**
 * Generates a Markdown README string for the given game.
 *
 * @param {string} game - The kebab-case game identifier (e.g. 'whack-a-mole').
 * @returns {string} A Markdown-formatted README string.
 */
export const generateReadme = (game) => {
  if (!game || typeof game !== 'string') {
    throw new TypeError('generateReadme requires a non-empty string game identifier.');
  }

  const meta = GAME_METADATA[game.toLowerCase()] ?? {
    title:
      typeof DEFAULT_METADATA.title === 'function'
        ? DEFAULT_METADATA.title(game)
        : DEFAULT_METADATA.title,
    emoji: DEFAULT_METADATA.emoji,
    description:
      typeof DEFAULT_METADATA.description === 'function'
        ? DEFAULT_METADATA.description(game)
        : DEFAULT_METADATA.description,
    howToPlay: DEFAULT_METADATA.howToPlay,
    controls: DEFAULT_METADATA.controls,
    tips: DEFAULT_METADATA.tips,
  };

  const howToPlayList = meta.howToPlay.map((step) => `- ${step}`).join('\n');
  const tipsList = meta.tips.map((tip) => `- ${tip}`).join('\n');

  return `# ${meta.emoji} ${meta.title}

> Part of the **GamesForForge** collection — a suite of browser-based mini-games built with React and Vite.

## 📖 Description

${meta.description}

## 🕹️ How to Play

${howToPlayList}

## ⌨️ Controls

${meta.controls}

## 💡 Tips

${tipsList}

## 🛠️ Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| UI         | React 18                    |
| Build tool | Vite                        |
| Styling    | Tailwind CSS                |
| Hosting    | Netlify                     |

## 🚀 Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/          # React game components
├── data/                # Static game data & configuration
├── hooks/               # Custom React hooks
└── main.jsx             # Application entry point
\`\`\`

## 📝 License

ISC
`;
};
