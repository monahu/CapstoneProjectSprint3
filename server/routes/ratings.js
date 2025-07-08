const express = require('express');
const Rating = require('../models/Rating');
const router = express.Router();

// GET /api/ratings - get all ratings
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find({}, '_id type description');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

module.exports = router;
