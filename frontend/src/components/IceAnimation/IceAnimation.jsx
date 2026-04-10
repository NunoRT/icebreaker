import { useState, useEffect, useRef } from 'react';
import './IceAnimation.css';

export default function IceAnimation({ onComplete }) {
  const [phase, setPhase] = useState('idle');
  const [particles, setParticles] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('cracking'), 400);
    const t2 = setTimeout(() => setPhase('shatter'), 1400);
    const t3 = setTimeout(() => setPhase('done'), 2200);
    const t4 = setTimeout(() => onCompleteRef.current(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    if (phase === 'shatter') {
      const shapes = [
        'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        'polygon(50% 0%, 95% 30%, 80% 100%, 20% 100%, 5% 30%)',
        'polygon(30% 0%, 100% 20%, 70% 100%, 0% 80%)',
        'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
      ];

      setParticles(Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 40,
        y: 40 + (Math.random() - 0.5) * 25,
        rotation: Math.random() * 720 - 360,
        dx: (Math.random() - 0.5) * 350,
        dy: -Math.random() * 200 - 40,
        gravity: 500 + Math.random() * 300,
        size: Math.random() * 28 + 8,
        delay: Math.random() * 0.15,
        opacity: Math.random() * 0.4 + 0.6,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        hue: 190 + Math.random() * 30,
        lightness: 70 + Math.random() * 20,
      })));

      setSparkles(Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 50,
        y: 40 + (Math.random() - 0.5) * 30,
        size: Math.random() * 6 + 2,
        delay: Math.random() * 0.4,
      })));
    }
  }, [phase]);

  return (
    <div className={`ice-animation ${phase}`}>
      <div className="ice-bg-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="bg-snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
              fontSize: `${Math.random() * 12 + 8}px`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          >
            *
          </div>
        ))}
      </div>

      <div className="ice-block-container">
        {phase === 'shatter' && <div className="impact-flash" />}

        <div className="ice-block">
          <div className="ice-surface" />
          <div className="ice-reflection" />
          <div className="ice-crack crack-1" />
          <div className="ice-crack crack-2" />
          <div className="ice-crack crack-3" />
          <div className="ice-crack crack-4" />
          <div className="ice-crack crack-5" />
          <div className="ice-crack crack-6" />
          <div className="ice-crack crack-7" />
          <div className="ice-glow" />
        </div>

        {phase === 'shatter' && particles.map(p => (
          <div
            key={p.id}
            className="ice-shard"
            style={{
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--gravity': `${p.gravity}px`,
              '--rot': `${p.rotation}deg`,
              '--size': `${p.size}px`,
              '--delay': `${p.delay}s`,
              '--start-x': `${p.x}%`,
              '--start-y': `${p.y}%`,
              '--hue': p.hue,
              '--lightness': `${p.lightness}%`,
              opacity: p.opacity,
              clipPath: p.shape,
            }}
          />
        ))}

        {phase === 'shatter' && sparkles.map(s => (
          <div
            key={`s-${s.id}`}
            className="ice-sparkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              '--size': `${s.size}px`,
              '--delay': `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <h1 className="ice-title">
        <span className="title-lets">Let's</span>
        <span className="title-break">Break</span>
        <span className="title-the">the</span>
        <span className="title-ice">Ice</span>
      </h1>

      <p className="ice-subtitle">Get ready to know your team!</p>
    </div>
  );
}
