const express = require('express');
const Post = require('../models/posts');
const router = express.Router();

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { title, content, imageUrls } = req.body;
    // You may want to get userId from auth middleware
    const userId = req.user ? req.user.id : null;
    if (!title || !content || !imageUrls || !imageUrls.desktop) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const post = new Post({
      userId,
      title,
      content,
      imageUrls: {
        desktop: imageUrls.desktop,
        mobile: imageUrls.mobile,
        mobile2x: imageUrls['mobile@2x'],
        tablet: imageUrls.tablet,
      },
    });
    await post.save();
    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

module.exports = router;
