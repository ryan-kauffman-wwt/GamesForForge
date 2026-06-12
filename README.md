# 🐭 Whack-a-Mole

> Part of the **GamesForForge** collection — a suite of browser-based mini-games built with React and Vite.

## 📖 Description

A fast-paced reflex game where moles pop up from holes on a 3×3 grid and you must click them before they disappear. Race against a 60-second countdown to score as many points as possible!

## 🕹️ How to Play

- Moles randomly appear in one of nine holes every second.
- Click a mole while it is visible to earn **+1 point**.
- Missed moles score nothing — stay sharp!
- The timer starts at **60 seconds** and counts down.
- When time runs out, the game ends and your final score is displayed.

## ⌨️ Controls

Mouse click or tap on a mole to whack it.

## 💡 Tips

- Watch the whole grid — moles can appear anywhere at any time.
- Quick clicks beat hesitation; moles vanish after about one second.
- Try to maintain a rhythm rather than chasing individual moles.

## 🛠️ Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| UI         | React 18                    |
| Build tool | Vite                        |
| Styling    | Tailwind CSS                |
| Hosting    | Netlify                     |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   └── WhackAMole.jsx       # Main game component
├── data/
│   └── whackAMoleData.js    # Initial game state & configuration
└── main.jsx                 # Application entry point
```

## 🎮 Other Games in GamesForForge

This project includes many more mini-games accessible from the game picker:

- Wordle
- Word Search
- Hangman
- Memory Match
- Sudoku
- Snake
- 2048
- Tic-Tac-Toe
- Trivia Quiz
- Type Racer
- Anagram
- Math Quiz
- Spelling Bee
- Crossword
- Scramble
- Number Crunch
- Word Chain
- …and more!

## 📝 License

ISC
