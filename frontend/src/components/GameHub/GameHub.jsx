import './GameHub.css';

const GAMES = [
  {
    id: 'spin',
    title: 'Spin the Wheel',
    emoji: '🎰',
    description: 'Spin to pick a topic and who answers first',
    color: '#3498db',
  },
  {
    id: 'wordle',
    title: 'Dev Wordle',
    emoji: '💻',
    description: 'Guess the 5-letter dev word in 6 tries',
    color: '#2ecc71',
  },
  {
    id: 'truths',
    title: 'Two Truths, One Lie',
    emoji: '🤥',
    description: 'Guess which statement is the lie',
    color: '#e74c3c',
  },
];

export default function GameHub({ onSelectGame }) {
  return (
    <div className="hub-container">
      <div className="hub-header">
        <h1 className="hub-title">
          <span className="hub-icon">&#10052;</span>
          Ice Breaker
        </h1>
        <p className="hub-subtitle">Choose a game to break the ice!</p>
      </div>

      <div className="games-grid">
        {GAMES.map((game, i) => (
          <button
            key={game.id}
            className="game-card"
            onClick={() => onSelectGame(game.id)}
            style={{
              '--card-color': game.color,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="game-emoji">{game.emoji}</div>
            <h3 className="game-title">{game.title}</h3>
            <p className="game-description">{game.description}</p>
            <div className="game-play">Play &rarr;</div>
          </button>
        ))}
      </div>
    </div>
  );
}
