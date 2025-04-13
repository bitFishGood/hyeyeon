const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { authMiddleware } = require('./auth');

// Get items (inventory and placed) for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await Item.find({ owner: userId });
    const inventory = items.filter(item => !item.placed);
    const placed = items.filter(item => item.placed);
    res.json({ inventory, placed });
  } catch (err) {
    console.error('Get items error:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// Gain a new item (add to inventory)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: '아이템 이름 필요' });
    const newItem = await Item.create({ name, owner: userId, placed: false });
    res.json(newItem);
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// Place or remove an item
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;
    const { placed } = req.body;
    const item = await Item.findOne({ _id: itemId, owner: userId });
    if (!item) {
      return res.status(404).json({ message: '아이템을 찾을 수 없음' });
    }
    item.placed = placed;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error('Update item error:', err);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;
