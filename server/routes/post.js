const express = require('express');
const Post = require('../models/posts');
const PostsTags = require('../models/PostsTags');
const User = require('../models/User');
const router = express.Router();
const { authenticateFirebaseIdToken } = require('../middleware/auth');

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const Tag = require('../models/Tags');
    const postTags = await PostsTags.find({ postId: post._id }).populate('tagId');
    const tags = postTags.map(pt => pt.tagId ? { _id: pt.tagId._id, name: pt.tagId.name } : null).filter(Boolean);

    const postObj = post.toObject();
    postObj.tags = Array.isArray(tags) ? tags : [];

    res.json(postObj);
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Failed to get post' });
  }
});

// Create a new post
router.post('/', authenticateFirebaseIdToken, async (req, res) => {
  try {
    const { title, content, imageUrls, ratingId, placeName, location, tags } = req.body;
    const firebaseUid = req.user && (req.user.uid || req.user.id);
    if (!firebaseUid) return res.status(401).json({ error: 'User not authenticated' });

    const userDoc = await User.findByFirebaseUid(firebaseUid);
    if (!userDoc) return res.status(404).json({ error: 'User not found' });

    if (!title || !content || !imageUrls || !imageUrls.desktop || !ratingId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = new Post({
      userId: userDoc._id,
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

    if (Array.isArray(tags) && tags.length > 0) {
      const Tag = require('../models/Tags');
      for (let tagName of tags) {
        tagName = tagName.trim();
        if (!tagName) continue;
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) tag = await Tag.create({ name: tagName });
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
    const userDoc = await User.findByFirebaseUid(firebaseUid);
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

    // Update fields if provided
    if (title) post.title = title;
    if (content) post.content = content;

    // Updated imageUrls mapping to handle multiple sizes
    if (imageUrls && typeof imageUrls === 'object') {
      post.imageUrls = {
        desktop: imageUrls.desktop || '',
        mobile: imageUrls.mobile || '',
        mobile2x: imageUrls.mobile2x || imageUrls['mobile@2x'] || '',
        tablet: imageUrls.tablet || '',
      };
    }

    if (ratingId) post.ratingId = ratingId;
    if (placeName) post.placeName = placeName;
    if (location) post.location = location;

    // Save updated post
    await post.save();

    // Handle tags (replace all tags for this post)
    if (Array.isArray(tags)) {
      const Tag = require('../models/Tags');
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

    // Populate tags for this post
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
