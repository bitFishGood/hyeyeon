const express = require('express');
const router = express.Router();
const Letter = require('../models/Letter');
const { authMiddleware } = require('./auth');

// Get letters for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    // Find letters where to = userId
    const letters = await Letter.find({ to: userId }).populate('from', 'name');
    // Map to include fromName (either from user name or stored fromName)
    const result = letters.map(letter => ({
      _id: letter._id,
      content: letter.content,
      fromName: letter.from ? letter.from.name : (letter.fromName || '익명'),
      fromId: letter.from ? letter.from._id : null,
      createdAt: letter.createdAt
    }));
    res.json(result);
  } catch (err) {
    console.error('Get letters error:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// Send a new letter
router.post('/', authMiddleware, async (req, res) => {
  try {
    const fromUser = req.user;
    const { to, content } = req.body;
    if (!to || !content) {
      return res.status(400).json({ message: '잘못된 요청' });
    }
    // Ensure target user exists
    // If needed, we could check User collection, but we'll assume valid ID for simplicity
    const letterData = {
      from: fromUser._id,
      fromName: fromUser.name,
      to,
      content
    };
    const newLetter = await Letter.create(letterData);
    res.json(newLetter);
  } catch (err) {
    console.error('Create letter error:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// Delete a letter by id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const letterId = req.params.id;
    const letter = await Letter.findOne({ _id: letterId, to: userId });
    if (!letter) {
      return res.status(404).json({ message: '편지를 찾을 수 없음' });
    }
    await Letter.deleteOne({ _id: letterId });
    res.sendStatus(204);
  } catch (err) {
    console.error('Delete letter error:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
