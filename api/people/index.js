const getDb = require('../_lib/firebase');

module.exports = async (req, res) => {
  const db = getDb();

  if (req.method === 'GET') {
    const snapshot = await db.collection('people').orderBy('name').get();
    const people = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json(people);
  }

  if (req.method === 'POST') {
    const { name, role, avatar } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const docRef = await db.collection('people').add({
      name,
      role: role || '',
      avatar: avatar || '',
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ id: docRef.id, name, role, avatar });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
