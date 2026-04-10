const getDb = require('../_lib/firebase');

module.exports = async (req, res) => {
  const db = getDb();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    await db.collection('topics').doc(id).delete();
    return res.json({ message: 'Topic deleted' });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
