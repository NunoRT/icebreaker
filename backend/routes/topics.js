const express = require('express');
const router = express.Router();
const db = require('../firebase');

const COLLECTION = 'topics';

// GET all topics
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('category').get();
    const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new topic
router.post('/', async (req, res) => {
  try {
    const { text, category, emoji } = req.body;
    if (!text) return res.status(400).json({ error: 'Topic text is required' });

    const docRef = await db.collection(COLLECTION).add({
      text,
      category: category || 'General',
      emoji: emoji || '💬',
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ id: docRef.id, text, category, emoji });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE topic
router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
