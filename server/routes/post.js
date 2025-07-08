const express = require('express');
const Post = require('../models/posts');
const router = express.Router();

// Use Firebase authentication middleware
const { authenticateFirebaseIdToken } = require('../middleware/auth');

// Create a new post (with tags, ratingId, etc)
router.post('/', authenticateFirebaseIdToken, async (req, res) => {
  try {
    const { title, content, imageUrls, ratingId, placeName, location, tags } = req.body;
    // Get firebaseUid from Firebase decoded token
    const firebaseUid = req.user && (req.user.uid || req.user.id);
    if (!firebaseUid) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find the user by firebaseUid
    const User = require('../models/User');
    const userDoc = await User.findOne({ firebaseUid });
    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = userDoc._id;

    // Validate required fields
    if (!title || !content || !imageUrls || !imageUrls.desktop || !ratingId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create post
    const post = new Post({
      userId,
      title,
      content,
      imageUrls: {
        desktop: imageUrls.desktop,
        mobile: imageUrls.mobile,
        mobile2x: imageUrls.mobile2x || imageUrls['mobile@2x'],
        tablet: imageUrls.tablet,
      },
      ratingId,
      placeName,
      location,
    });
    await post.save();

    // Handle tags (array of strings)
    if (Array.isArray(tags) && tags.length > 0) {
      const Tag = require('../models/Tags');
      const PostsTags = require('../models/PostsTags');
      for (let tagName of tags) {
        tagName = tagName.trim();
        if (!tagName) continue;
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        await PostsTags.findOneAndUpdate(
          { tagId: tag._id, postId: post._id },
          { tagId: tag._id, postId: post._id },
          { upsert: true }
        );
      }
    }

    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

module.exports = router;
