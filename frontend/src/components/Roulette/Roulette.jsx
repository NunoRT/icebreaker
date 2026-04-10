import { useState, useRef } from 'react';
import './Roulette.css';

const COLORS = [
  '#e74c3c', '#2ecc71', '#3498db', '#f39c12',
  '#9b59b6', '#1abc9c', '#e67e22', '#2980b9',
  '#e91e63', '#00bcd4', '#ff5722', '#4caf50',
  '#673ab7', '#ff9800', '#009688', '#795548',
  '#607d8b', '#8bc34a', '#03a9f4', '#f44336',
];

const WHEEL_SIZE = 380;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 4;

function polarToXY(angleDeg, r) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

function segmentPath(startAngle, endAngle) {
  const start = polarToXY(startAngle, RADIUS);
  const end = polarToXY(endAngle, RADIUS);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export default function Roulette({ items, onResult, title, type }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const wheelRef = useRef(null);

  const segmentAngle = 360 / items.length;

  function spin() {
    if (spinning || items.length === 0) return;

    setSpinning(true);
    setWinner(null);

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + extraSpins * 360 + randomAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      const normalizedAngle = ((totalRotation % 360) + 360) % 360;
      const pointerAngle = (360 - normalizedAngle) % 360;
      const winnerIndex = Math.floor(pointerAngle / segmentAngle) % items.length;

      setWinner(items[winnerIndex]);
      setSpinning(false);
    }, 4500);
  }

  function getLabel(item) {
    if (type === 'topic') return item.emoji ? `${item.emoji} ${item.text}` : item.text;
    return item.name;
  }

  function getShortLabel(item) {
    if (type === 'topic') {
      return item.emoji || '💬';
    }
    return item.name;
  }

  return (
    <div className="roulette-container">
      <h2 className="roulette-title">{title}</h2>

      <div className="wheel-wrapper">
        <div className="wheel-pointer" />
        <div
          ref={wheelRef}
          className="wheel"
          style={{
            width: WHEEL_SIZE,
            height: WHEEL_SIZE,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
          }}
        >
          <svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            {items.map((item, i) => {
              const startAngle = segmentAngle * i;
              const endAngle = segmentAngle * (i + 1);
              const midAngle = startAngle + segmentAngle / 2;
              const color = COLORS[i % COLORS.length];
              const textPos = polarToXY(midAngle, RADIUS * 0.62);

              return (
                <g key={item.id}>
                  <path
                    d={segmentPath(startAngle, endAngle)}
                    fill={color}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="1"
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fill="white"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)', pointerEvents: 'none' }}
                  >
                    {getShortLabel(item)}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx={CENTER} cy={CENTER} r="32" fill="url(#centerGrad)" stroke="#80deea" strokeWidth="3" />
            <text
              x={CENTER}
              y={CENTER}
              fill="#80deea"
              fontSize="14"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Fredoka One', cursive"
            >
              {spinning ? '...' : 'SPIN'}
            </text>
            <defs>
              <radialGradient id="centerGrad">
                <stop offset="0%" stopColor="#1a2a4a" />
                <stop offset="100%" stopColor="#0d1b2a" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <button
          className={`spin-button ${spinning ? 'disabled' : ''}`}
          onClick={spin}
          disabled={spinning || items.length === 0}
        >
          {spinning ? 'Spinning...' : 'Spin the wheel!'}
        </button>
      </div>

      {winner && (
        <div className="winner-reveal">
          <div className="winner-card">
            <div className="winner-label">Selected:</div>
            <div className="winner-text">{getLabel(winner)}</div>
            {type === 'person' && winner.role && (
              <div className="winner-role">{winner.role}</div>
            )}
          </div>
          <button
            className="continue-button"
            onClick={() => onResult(winner)}
          >
            Continue &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
