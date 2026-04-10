const express = require('express');
const router = express.Router();
const db = require('../firebase');

const COLLECTION = 'truths';

// GET all statements (grouped by person)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('personName').get();
    const truths = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(truths);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new set of statements for a person
router.post('/', async (req, res) => {
  try {
    const { personName, statements, lieIndex } = req.body;
    if (!personName || !statements || statements.length !== 3 || lieIndex === undefined) {
      return res.status(400).json({
        error: 'Need personName, 3 statements, and lieIndex (0-2)',
      });
    }

    const docRef = await db.collection(COLLECTION).add({
      personName,
      statements,
      lieIndex: Number(lieIndex),
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ id: docRef.id, personName, statements, lieIndex });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a set of statements
router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Statements deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
