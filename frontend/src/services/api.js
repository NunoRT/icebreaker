const API_BASE = '/api';

export async function fetchTopics() {
  const res = await fetch(`${API_BASE}/topics`);
  if (!res.ok) throw new Error('Failed to fetch topics');
  return res.json();
}

export async function fetchPeople() {
  const res = await fetch(`${API_BASE}/people`);
  if (!res.ok) throw new Error('Failed to fetch people');
  return res.json();
}

export async function addTopic(topic) {
  const res = await fetch(`${API_BASE}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topic),
  });
  if (!res.ok) throw new Error('Failed to add topic');
  return res.json();
}

export async function addPerson(person) {
  const res = await fetch(`${API_BASE}/people`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person),
  });
  if (!res.ok) throw new Error('Failed to add person');
  return res.json();
}

export async function deleteTopic(id) {
  const res = await fetch(`${API_BASE}/topics/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete topic');
  return res.json();
}

export async function deletePerson(id) {
  const res = await fetch(`${API_BASE}/people/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete person');
  return res.json();
}

// Two Truths One Lie
export async function fetchTruths() {
  const res = await fetch(`${API_BASE}/truths`);
  if (!res.ok) throw new Error('Failed to fetch truths');
  return res.json();
}

export async function addTruth(truth) {
  const res = await fetch(`${API_BASE}/truths`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(truth),
  });
  if (!res.ok) throw new Error('Failed to add truth');
  return res.json();
}

export async function deleteTruth(id) {
  const res = await fetch(`${API_BASE}/truths/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete truth');
  return res.json();
}
