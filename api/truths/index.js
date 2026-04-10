const getDb = require('../_lib/firebase');

module.exports = async (req, res) => {
  const db = getDb();

  if (req.method === 'GET') {
    const snapshot = await db.collection('truths').orderBy('personName').get();
    const truths = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json(truths);
  }

  if (req.method === 'POST') {
    const { personName, statements, lieIndex } = req.body;
    if (!personName || !statements || statements.length !== 3 || lieIndex === undefined) {
      return res.status(400).json({
        error: 'Need personName, 3 statements, and lieIndex (0-2)',
      });
    }
    const docRef = await db.collection('truths').add({
      personName,
      statements,
      lieIndex: Number(lieIndex),
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ id: docRef.id, personName, statements, lieIndex });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
