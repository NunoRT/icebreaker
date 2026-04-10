import './ResultCard.css';

export default function ResultCard({ topic, person, onReset }) {
  return (
    <div className="result-container">
      <div className="result-card-main">
        <div className="result-header">
          <h2>Ice Broken!</h2>
          <div className="result-snowflakes">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="result-flake" style={{ animationDelay: `${i * 0.2}s` }}>
                *
              </span>
            ))}
          </div>
        </div>

        <div className="result-body">
          <div className="result-section">
            <div className="result-label">Topic</div>
            <div className="result-value topic-value">
              {topic.emoji && <span className="topic-emoji">{topic.emoji}</span>}
              {topic.text}
            </div>
            {topic.category && (
              <span className="result-badge">{topic.category}</span>
            )}
          </div>

          <div className="result-divider">
            <span className="divider-icon">&#10052;</span>
          </div>

          <div className="result-section">
            <div className="result-label">Starts answering</div>
            <div className="result-value person-value">{person.name}</div>
            {person.role && (
              <div className="result-role">{person.role}</div>
            )}
          </div>
        </div>

        <button className="reset-button" onClick={onReset}>
          Break more ice!
        </button>
      </div>
    </div>
  );
}
