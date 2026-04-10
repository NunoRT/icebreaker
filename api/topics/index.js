const getDb = require('../_lib/firebase');

module.exports = async (req, res) => {
  try {
    const db = getDb();

    if (req.method === 'GET') {
      const snapshot = await db.collection('topics').orderBy('category').get();
      const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json(topics);
    }

    if (req.method === 'POST') {
      const { text, category, emoji } = req.body;
      if (!text) return res.status(400).json({ error: 'Topic text is required' });
      const docRef = await db.collection('topics').add({
        text,
        category: category || 'General',
        emoji: emoji || '💬',
        createdAt: new Date().toISOString(),
      });
      return res.status(201).json({ id: docRef.id, text, category, emoji });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
