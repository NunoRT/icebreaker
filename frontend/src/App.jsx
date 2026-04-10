import { useState, useEffect, useCallback } from 'react';
import IceAnimation from './components/IceAnimation/IceAnimation';
import GameHub from './components/GameHub/GameHub';
import Roulette from './components/Roulette/Roulette';
import ResultCard from './components/ResultCard/ResultCard';
import ManagePanel from './components/ManagePanel/ManagePanel';
import DevWordle from './components/DevWordle/DevWordle';
import TwoTruths from './components/TwoTruths/TwoTruths';
import { fetchTopics, fetchPeople, addTopic, addPerson, deleteTopic, deletePerson } from './services/api';
import './App.css';

const SCREENS = {
  INTRO: 'intro',
  HUB: 'hub',
  SPIN_TOPIC: 'spin_topic',
  SPIN_PERSON: 'spin_person',
  SPIN_RESULT: 'spin_result',
  WORDLE: 'wordle',
  TRUTHS: 'truths',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.INTRO);
  const [topics, setTopics] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [t, p] = await Promise.all([fetchTopics(), fetchPeople()]);
      setTopics(t);
      setPeople(p);
    } catch (err) {
      setError('Could not connect to server. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleSelectGame(gameId) {
    if (gameId === 'spin') setScreen(SCREENS.SPIN_TOPIC);
    else if (gameId === 'wordle') setScreen(SCREENS.WORDLE);
    else if (gameId === 'truths') setScreen(SCREENS.TRUTHS);
  }

  function handleTopicSelected(topic) {
    setSelectedTopic(topic);
    setScreen(SCREENS.SPIN_PERSON);
  }

  function handlePersonSelected(person) {
    setSelectedPerson(person);
    setScreen(SCREENS.SPIN_RESULT);
  }

  function handleSpinReset() {
    setSelectedTopic(null);
    setSelectedPerson(null);
    setScreen(SCREENS.SPIN_TOPIC);
  }

  function goToHub() {
    setSelectedTopic(null);
    setSelectedPerson(null);
    setScreen(SCREENS.HUB);
  }

  async function handleAddTopic(topic) {
    const newTopic = await addTopic(topic);
    setTopics(prev => [...prev, newTopic]);
  }

  async function handleAddPerson(person) {
    const newPerson = await addPerson(person);
    setPeople(prev => [...prev, newPerson]);
  }

  async function handleDeleteTopic(id) {
    await deleteTopic(id);
    setTopics(prev => prev.filter(t => t.id !== id));
  }

  async function handleDeletePerson(id) {
    await deletePerson(id);
    setPeople(prev => prev.filter(p => p.id !== id));
  }

  if (screen === SCREENS.INTRO) {
    return <IceAnimation onComplete={() => setScreen(SCREENS.HUB)} />;
  }

  const showHeader = screen !== SCREENS.HUB;

  return (
    <div className="app">
      {showHeader && (
        <header className="app-header">
          <h1 className="app-logo" onClick={goToHub}>
            <span className="logo-icon">&#10052;</span> Ice Breaker
          </h1>
          <div className="header-actions">
            {(screen === SCREENS.SPIN_TOPIC || screen === SCREENS.SPIN_PERSON || screen === SCREENS.SPIN_RESULT) && (
              <button className="manage-btn" onClick={() => setShowManage(true)}>
                Manage
              </button>
            )}
          </div>
        </header>
      )}

      <main className="app-main">
        {screen === SCREENS.HUB && (
          <GameHub onSelectGame={handleSelectGame} />
        )}

        {screen === SCREENS.WORDLE && (
          <DevWordle onBack={goToHub} />
        )}

        {screen === SCREENS.TRUTHS && (
          <TwoTruths onBack={goToHub} />
        )}

        {/* Spin the Wheel flow */}
        {loading && (screen === SCREENS.SPIN_TOPIC || screen === SCREENS.SPIN_PERSON) && (
          <div className="loading-msg">Loading data...</div>
        )}

        {error && (screen === SCREENS.SPIN_TOPIC || screen === SCREENS.SPIN_PERSON) && (
          <div className="error-msg">
            <p>{error}</p>
            <button className="retry-btn" onClick={loadData}>Retry</button>
          </div>
        )}

        {!loading && !error && screen === SCREENS.SPIN_TOPIC && topics.length > 0 && (
          <div className="spin-section">
            <button className="back-link" onClick={goToHub}>&larr; Back to games</button>
            <Roulette
              items={topics}
              onResult={handleTopicSelected}
              title="Spin to pick a topic!"
              type="topic"
            />
          </div>
        )}

        {!loading && !error && screen === SCREENS.SPIN_TOPIC && topics.length === 0 && (
          <div className="empty-msg">
            <p>No topics yet! Add some in the Manage panel.</p>
            <button className="manage-btn-inline" onClick={() => setShowManage(true)}>
              Open Manage
            </button>
          </div>
        )}

        {!loading && !error && screen === SCREENS.SPIN_PERSON && people.length > 0 && (
          <div className="person-spin-section">
            <div className="selected-topic-banner">
              <span className="banner-label">Topic:</span>
              <span className="banner-text">
                {selectedTopic.emoji} {selectedTopic.text}
              </span>
            </div>
            <Roulette
              items={people}
              onResult={handlePersonSelected}
              title="Who goes first?"
              type="person"
            />
          </div>
        )}

        {!loading && !error && screen === SCREENS.SPIN_PERSON && people.length === 0 && (
          <div className="empty-msg">
            <p>No team members yet! Add some in the Manage panel.</p>
            <button className="manage-btn-inline" onClick={() => setShowManage(true)}>
              Open Manage
            </button>
          </div>
        )}

        {screen === SCREENS.SPIN_RESULT && selectedTopic && selectedPerson && (
          <ResultCard
            topic={selectedTopic}
            person={selectedPerson}
            onReset={handleSpinReset}
          />
        )}
      </main>

      {showHeader && (
        <footer className="app-footer">
          <p>Built for breaking ice, not hearts &#10052;</p>
        </footer>
      )}

      {showManage && (
        <ManagePanel
          topics={topics}
          people={people}
          onAddTopic={handleAddTopic}
          onAddPerson={handleAddPerson}
          onDeleteTopic={handleDeleteTopic}
          onDeletePerson={handleDeletePerson}
          onClose={() => setShowManage(false)}
        />
      )}
    </div>
  );
}
