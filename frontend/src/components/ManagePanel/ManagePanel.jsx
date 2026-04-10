import { useState } from 'react';
import './ManagePanel.css';

export default function ManagePanel({
  topics,
  people,
  onAddTopic,
  onAddPerson,
  onDeleteTopic,
  onDeletePerson,
  onClose,
}) {
  const [tab, setTab] = useState('topics');
  const [topicText, setTopicText] = useState('');
  const [topicCategory, setTopicCategory] = useState('');
  const [topicEmoji, setTopicEmoji] = useState('');
  const [personName, setPersonName] = useState('');
  const [personRole, setPersonRole] = useState('');

  function handleAddTopic(e) {
    e.preventDefault();
    if (!topicText.trim()) return;
    onAddTopic({ text: topicText, category: topicCategory || 'General', emoji: topicEmoji || '💬' });
    setTopicText('');
    setTopicCategory('');
    setTopicEmoji('');
  }

  function handleAddPerson(e) {
    e.preventDefault();
    if (!personName.trim()) return;
    onAddPerson({ name: personName, role: personRole });
    setPersonName('');
    setPersonRole('');
  }

  return (
    <div className="manage-overlay">
      <div className="manage-panel">
        <div className="manage-header">
          <h2>Manage</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="manage-tabs">
          <button
            className={`tab-btn ${tab === 'topics' ? 'active' : ''}`}
            onClick={() => setTab('topics')}
          >
            Topics ({topics.length})
          </button>
          <button
            className={`tab-btn ${tab === 'people' ? 'active' : ''}`}
            onClick={() => setTab('people')}
          >
            People ({people.length})
          </button>
        </div>

        {tab === 'topics' && (
          <div className="manage-content">
            <form className="add-form" onSubmit={handleAddTopic}>
              <input
                type="text"
                placeholder="Topic question..."
                value={topicText}
                onChange={e => setTopicText(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={topicCategory}
                onChange={e => setTopicCategory(e.target.value)}
                className="small-input"
              />
              <input
                type="text"
                placeholder="Emoji"
                value={topicEmoji}
                onChange={e => setTopicEmoji(e.target.value)}
                className="emoji-input"
              />
              <button type="submit" className="add-btn">Add</button>
            </form>
            <div className="item-list">
              {topics.map(t => (
                <div key={t.id} className="item-row">
                  <span className="item-emoji">{t.emoji}</span>
                  <span className="item-text">{t.text}</span>
                  <span className="item-category">{t.category}</span>
                  <button className="delete-btn" onClick={() => onDeleteTopic(t.id)}>&times;</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'people' && (
          <div className="manage-content">
            <form className="add-form" onSubmit={handleAddPerson}>
              <input
                type="text"
                placeholder="Name"
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={personRole}
                onChange={e => setPersonRole(e.target.value)}
                className="small-input"
              />
              <button type="submit" className="add-btn">Add</button>
            </form>
            <div className="item-list">
              {people.map(p => (
                <div key={p.id} className="item-row">
                  <div className="person-avatar">
                    {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="item-text">{p.name}</span>
                  <span className="item-category">{p.role}</span>
                  <button className="delete-btn" onClick={() => onDeletePerson(p.id)}>&times;</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
