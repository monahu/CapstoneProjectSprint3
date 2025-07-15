
const express = require('express');
const Post = require('../models/posts');
const router = express.Router();

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Populate tags for this post
    const PostsTags = require('../models/PostsTags');
    const Tag = require('../models/Tags');
    const postTags = await PostsTags.find({ postId: post._id }).populate('tagId');
    // tags array: [{ _id, name }]
    const tags = postTags.map(pt => pt.tagId ? { _id: pt.tagId._id, name: pt.tagId.name } : null).filter(Boolean);

    // Attach tags to post object (always an array)
    const postObj = post.toObject();
    postObj.tags = Array.isArray(tags) ? tags : [];

    // Ensure tags field is always present, even if empty
    if (!postObj.tags) postObj.tags = [];

    res.json(postObj);
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Failed to get post' });
  }
});

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

// Edit an existing post
router.put('/:id', authenticateFirebaseIdToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, imageUrls, ratingId, placeName, location, tags } = req.body;
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

    // Find post and check ownership
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (String(post.userId) !== String(userId)) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (imageUrls) post.imageUrls = imageUrls;
    if (ratingId) post.ratingId = ratingId;
    if (placeName) post.placeName = placeName;
    if (location) post.location = location;

    await post.save();

    // Handle tags (replace all tags for this post)
    if (Array.isArray(tags)) {
      const Tag = require('../models/Tags');
      const PostsTags = require('../models/PostsTags');
      // Remove existing tags
      await PostsTags.deleteMany({ postId: post._id });
      for (let tagName of tags) {
        tagName = tagName.trim();
        if (!tagName) continue;
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        await PostsTags.create({ tagId: tag._id, postId: post._id });
      }
    }

    // Populate tags for this post (same as GET)
    const PostsTags = require('../models/PostsTags');
    const postTags = await PostsTags.find({ postId: post._id }).populate('tagId');
    const tagsArr = postTags.map(pt => pt.tagId ? { _id: pt.tagId._id, name: pt.tagId.name } : null).filter(Boolean);
    const postObj = post.toObject();
    postObj.tags = tagsArr;

    res.json({ success: true, post: postObj });
  } catch (err) {
    console.error('Edit post error:', err);
    res.status(500).json({ error: 'Failed to edit post' });
  }
});

module.exports = router;
