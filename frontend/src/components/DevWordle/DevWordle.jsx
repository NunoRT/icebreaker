import { useState, useEffect, useCallback } from 'react';
import './DevWordle.css';

const WORDS = [
  'REACT', 'FLASK', 'REDIS', 'NGINX', 'MYSQL',
  'SCRUM', 'DEBUG', 'MERGE', 'AGILE', 'CLONE',
  'FETCH', 'PIXEL', 'QUERY', 'STACK', 'REGEX',
  'LINUX', 'SWIFT', 'CARGO', 'DRIFT', 'AZURE',
  'PROXY', 'NEXUS', 'VAULT', 'GRAPH', 'BABEL',
  'KANBA', 'JIRAS', 'SLACK', 'SHELL', 'PATCH',
  'ASYNC', 'TRAIL', 'SCALA', 'PRINT', 'INPUT',
  'ARRAY', 'FLOAT', 'CLASS', 'YIELD', 'THROW',
  'CATCH', 'WHILE', 'BREAK', 'CONST', 'SUPER',
];

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function evaluateGuess(guess, target) {
  const result = Array(WORD_LENGTH).fill('absent');
  const targetChars = target.split('');
  const guessChars = guess.split('');

  // First pass: correct positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct';
      targetChars[i] = null;
      guessChars[i] = null;
    }
  }

  // Second pass: present but wrong position
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === null) continue;
    const idx = targetChars.indexOf(guessChars[i]);
    if (idx !== -1) {
      result[i] = 'present';
      targetChars[idx] = null;
    }
  }

  return result;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL'],
];

export default function DevWordle({ onBack }) {
  const [target, setTarget] = useState(() => getRandomWord());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [shake, setShake] = useState(false);
  const [revealRow, setRevealRow] = useState(-1);
  const [message, setMessage] = useState('');

  const keyStatuses = {};
  guesses.forEach(({ word, result }) => {
    word.split('').forEach((letter, i) => {
      const status = result[i];
      const current = keyStatuses[letter];
      if (status === 'correct') keyStatuses[letter] = 'correct';
      else if (status === 'present' && current !== 'correct') keyStatuses[letter] = 'present';
      else if (!current) keyStatuses[letter] = 'absent';
    });
  });

  const showMessage = useCallback((msg, duration = 1500) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  }, []);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showMessage('Not enough letters');
      return;
    }

    const result = evaluateGuess(currentGuess, target);
    const newGuesses = [...guesses, { word: currentGuess, result }];
    setRevealRow(guesses.length);
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === target) {
      setTimeout(() => {
        setGameState('won');
        const msgs = ['Genius!', 'Amazing!', 'Great!', 'Nice!', 'Good!', 'Phew!'];
        showMessage(msgs[Math.min(newGuesses.length - 1, 5)], 3000);
      }, WORD_LENGTH * 300 + 200);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setTimeout(() => {
        setGameState('lost');
        showMessage(`The word was ${target}`, 5000);
      }, WORD_LENGTH * 300 + 200);
    }
  }, [currentGuess, guesses, target, showMessage]);

  const handleKey = useCallback((key) => {
    if (gameState !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'DEL' || key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  }, [gameState, currentGuess, submitGuess]);

  // Auto-submit when 5 letters are entered
  useEffect(() => {
    if (currentGuess.length === WORD_LENGTH && gameState === 'playing') {
      submitGuess();
    }
  }, [currentGuess, gameState, submitGuess]);

  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key.toUpperCase();
      handleKey(key);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  function resetGame() {
    setTarget(getRandomWord());
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
    setRevealRow(-1);
    setMessage('');
  }

  function renderGrid() {
    const rows = [];

    for (let r = 0; r < MAX_GUESSES; r++) {
      const cells = [];
      const isCurrentRow = r === guesses.length && gameState === 'playing';
      const isGuessed = r < guesses.length;

      for (let c = 0; c < WORD_LENGTH; c++) {
        let letter = '';
        let status = '';
        let animDelay = '';

        if (isGuessed) {
          letter = guesses[r].word[c];
          status = guesses[r].result[c];
          if (r === revealRow) {
            animDelay = `${c * 0.3}s`;
          }
        } else if (isCurrentRow && c < currentGuess.length) {
          letter = currentGuess[c];
          status = 'tbd';
        }

        cells.push(
          <div
            key={c}
            className={`wordle-cell ${status} ${letter && !isGuessed ? 'filled' : ''} ${r === revealRow ? 'reveal' : ''}`}
            style={animDelay ? { animationDelay: animDelay } : undefined}
          >
            <span className="cell-letter">{letter}</span>
          </div>
        );
      }

      rows.push(
        <div key={r} className={`wordle-row ${isCurrentRow && shake ? 'shake' : ''}`}>
          {cells}
        </div>
      );
    }

    return rows;
  }

  return (
    <div className="wordle-container">
      <div className="wordle-header">
        <button className="back-btn" onClick={onBack}>&larr; Back</button>
        <h2 className="wordle-title">Dev Wordle</h2>
        <button className="new-game-btn" onClick={resetGame}>New</button>
      </div>

      {message && <div className="wordle-message">{message}</div>}

      <div className="wordle-grid">
        {renderGrid()}
      </div>

      {(gameState === 'won' || gameState === 'lost') && (
        <div className="wordle-endgame">
          <div className={`endgame-banner ${gameState}`}>
            {gameState === 'won' ? '🎉 You got it!' : `😅 The word was: ${target}`}
          </div>
          <button className="play-again-btn" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}

      <div className="wordle-keyboard">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="keyboard-row">
            {row.map(key => (
              <button
                key={key}
                className={`key-btn ${keyStatuses[key] || ''} ${key.length > 1 ? 'key-wide' : ''}`}
                onClick={() => handleKey(key)}
              >
                {key === 'DEL' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
