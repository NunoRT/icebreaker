const express = require('express');
const router = express.Router();
const db = require('../firebase');

const COLLECTION = 'people';

// GET all people
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('name').get();
    const people = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new person
router.post('/', async (req, res) => {
  try {
    const { name, role, avatar } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const docRef = await db.collection(COLLECTION).add({
      name,
      role: role || '',
      avatar: avatar || '',
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ id: docRef.id, name, role, avatar });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE person
router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Person deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
