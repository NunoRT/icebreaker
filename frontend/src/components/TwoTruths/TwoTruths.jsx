import { useState, useEffect } from 'react';
import { fetchTruths, addTruth, deleteTruth } from '../../services/api';
import './TwoTruths.css';

export default function TwoTruths({ onBack }) {
  const [truths, setTruths] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [phase, setPhase] = useState('loading'); // loading, menu, playing, adding, finished
  const [shuffledTruths, setShuffledTruths] = useState([]);

  // Add form state
  const [formName, setFormName] = useState('');
  const [formStatements, setFormStatements] = useState(['', '', '']);
  const [formLieIndex, setFormLieIndex] = useState(0);

  useEffect(() => {
    loadTruths();
  }, []);

  async function loadTruths() {
    try {
      const data = await fetchTruths();
      setTruths(data);
      setPhase('menu');
    } catch (err) {
      console.error(err);
      setPhase('menu');
    }
  }

  function startGame() {
    if (truths.length === 0) return;
    const shuffled = [...truths].sort(() => Math.random() - 0.5);
    setShuffledTruths(shuffled);
    setCurrentIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore({ correct: 0, total: 0 });
    setPhase('playing');
  }

  function handleSelect(index) {
    if (revealed) return;
    setSelected(index);
  }

  function handleReveal() {
    if (selected === null) return;
    setRevealed(true);
    const current = shuffledTruths[currentIndex];
    if (selected === current.lieIndex) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= shuffledTruths.length) {
      setPhase('finished');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    if (!formName.trim() || formStatements.some(s => !s.trim())) return;

    await addTruth({
      personName: formName,
      statements: formStatements,
      lieIndex: formLieIndex,
    });

    setFormName('');
    setFormStatements(['', '', '']);
    setFormLieIndex(0);
    await loadTruths();
    setPhase('menu');
  }

  async function handleDelete(id) {
    await deleteTruth(id);
    setTruths(prev => prev.filter(t => t.id !== id));
  }

  function updateStatement(index, value) {
    setFormStatements(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  const current = shuffledTruths[currentIndex];

  return (
    <div className="truths-container">
      <div className="truths-header">
        <button className="back-btn" onClick={onBack}>&larr; Back</button>
        <h2 className="truths-title">Two Truths, One Lie</h2>
        <div className="header-spacer" />
      </div>

      {/* MENU */}
      {phase === 'menu' && (
        <div className="truths-menu">
          <div className="menu-icon">🤥</div>
          <p className="menu-desc">
            Each person has 2 truths and 1 lie. Can you spot the lie?
          </p>
          <div className="menu-stats">
            <span>{truths.length} people have submitted statements</span>
          </div>
          <div className="menu-actions">
            <button
              className="play-btn"
              onClick={startGame}
              disabled={truths.length === 0}
            >
              {truths.length === 0 ? 'Add statements first' : `Play (${truths.length} rounds)`}
            </button>
            <button className="add-new-btn" onClick={() => setPhase('adding')}>
              + Add Statements
            </button>
          </div>

          {truths.length > 0 && (
            <div className="existing-list">
              <h4>Submitted:</h4>
              {truths.map(t => (
                <div key={t.id} className="existing-item">
                  <span>{t.personName}</span>
                  <button className="del-btn" onClick={() => handleDelete(t.id)}>&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADDING */}
      {phase === 'adding' && (
        <form className="add-truths-form" onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label>Who is this?</label>
            <input
              type="text"
              placeholder="Name"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              required
            />
          </div>

          <p className="form-instruction">
            Write 2 truths and 1 lie. Select which one is the lie.
          </p>

          {formStatements.map((s, i) => (
            <div key={i} className="statement-input-row">
              <button
                type="button"
                className={`lie-toggle ${formLieIndex === i ? 'is-lie' : ''}`}
                onClick={() => setFormLieIndex(i)}
                title={formLieIndex === i ? 'This is the lie' : 'Click to mark as lie'}
              >
                {formLieIndex === i ? 'LIE' : i + 1}
              </button>
              <input
                type="text"
                placeholder={`Statement ${i + 1}...`}
                value={s}
                onChange={e => updateStatement(i, e.target.value)}
                required
              />
            </div>
          ))}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setPhase('menu')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save
            </button>
          </div>
        </form>
      )}

      {/* PLAYING */}
      {phase === 'playing' && current && (
        <div className="truths-game">
          <div className="game-progress">
            Round {currentIndex + 1} of {shuffledTruths.length}
            <span className="score-display">
              Score: {score.correct}/{score.total}
            </span>
          </div>

          <div className="person-name-card">
            <div className="person-initial">
              {current.personName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span>{current.personName}</span>
          </div>

          <p className="pick-instruction">
            {!revealed ? 'Which one is the LIE?' : (selected === current.lieIndex ? 'Correct! 🎉' : 'Wrong! 😅')}
          </p>

          <div className="statements-list">
            {current.statements.map((stmt, i) => {
              let stateClass = '';
              if (revealed) {
                if (i === current.lieIndex) stateClass = 'is-the-lie';
                else stateClass = 'is-truth';
              } else if (selected === i) {
                stateClass = 'selected';
              }

              return (
                <button
                  key={i}
                  className={`statement-card ${stateClass}`}
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                >
                  <span className="stmt-number">{i + 1}</span>
                  <span className="stmt-text">{stmt}</span>
                  {revealed && i === current.lieIndex && (
                    <span className="stmt-badge lie-badge">LIE</span>
                  )}
                  {revealed && i !== current.lieIndex && (
                    <span className="stmt-badge truth-badge">TRUTH</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="game-actions">
            {!revealed && (
              <button
                className="reveal-btn"
                onClick={handleReveal}
                disabled={selected === null}
              >
                Reveal Answer
              </button>
            )}
            {revealed && (
              <button className="next-btn" onClick={handleNext}>
                {currentIndex + 1 >= shuffledTruths.length ? 'See Results' : 'Next Round →'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* FINISHED */}
      {phase === 'finished' && (
        <div className="truths-finished">
          <div className="finished-emoji">
            {score.correct === score.total ? '🏆' : score.correct > score.total / 2 ? '🎉' : '😅'}
          </div>
          <h3 className="finished-title">Game Over!</h3>
          <div className="final-score">
            <span className="score-number">{score.correct}</span>
            <span className="score-divider">/</span>
            <span className="score-number">{score.total}</span>
          </div>
          <p className="score-label">correct guesses</p>
          <div className="finished-actions">
            <button className="play-btn" onClick={startGame}>Play Again</button>
            <button className="back-to-menu-btn" onClick={() => setPhase('menu')}>Back to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}
