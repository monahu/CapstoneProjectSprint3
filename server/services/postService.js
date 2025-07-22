const Post = require('../models/posts')
const PostsTags = require('../models/PostsTags')
const WantToGo = require('../models/WantToGo')
const Like = require('../models/Likes')
const Tag = require('../models/Tags')

/**
 * Post Service - Core business logic for post operations
 * Handles CRUD operations, interactions, and search functionality
 */

/**
 * Create a new post with tags
 */
const createPost = async (input, userId) => {
  const newPost = new Post({
    ...input,
    userId: userId,
    createdAt: new Date(),
  })

  const savedPost = await newPost.save()

  // Process tags if provided
  if (input.tags && input.tags.length > 0) {
    await addTagsToPost(savedPost._id, input.tags)
  }

  return savedPost
}

/**
 * Update an existing post
 */
const updatePost = async (postId, input) => {
  return await Post.findByIdAndUpdate(postId, input, { new: true })
}

/**
 * Delete a post and all associated data
 */
const deletePost = async (postId) => {
  // Delete post and all associated records in parallel
  await Promise.all([
    Post.findByIdAndDelete(postId),
    WantToGo.deleteMany({ postId: postId }),
    Like.deleteMany({ postId: postId }),
    PostsTags.deleteMany({ postId: postId }),
  ])
  return postId
}

/**
 * Get all posts with pagination and filtering
 */
const getPosts = async (limit = 10, offset = 0, filter = {}) => {
  const safeLimit = Math.min(limit, 50) // Max 50 posts per request

  return await Post.find(filter)
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .skip(offset)
    .populate('userId', 'displayName photoURL')
}

/**
 * Get a single post by ID
 */
const getPostById = async (postId) => {
  return await Post.findById(postId).populate('userId', 'displayName photoURL')
}

/**
 * Get posts by user ID
 */
const getPostsByUserId = async (userId) => {
  return await Post.find({ userId: userId })
    .sort({ createdAt: -1 })
    .populate('userId', 'displayName photoURL')
}

/**
 * Toggle user's "want to go" status for a post
 */
const toggleWantToGo = async (userId, postId) => {
  const existing = await WantToGo.findOne({
    userId: userId,
    postId: postId,
  })

  if (existing) {
    await WantToGo.findByIdAndDelete(existing._id)
  } else {
    await new WantToGo({ userId: userId, postId: postId }).save()
  }

  return await Post.findById(postId)
}

/**
 * Toggle user's like status for a post
 */
const toggleLike = async (userId, postId) => {
  const existingLike = await Like.findOne({
    userId: userId,
    postId: postId,
  })

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id)
  } else {
    try {
      await new Like({ userId: userId, postId: postId }).save()
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key error - cleanup and retry
        await Like.deleteMany({ userId: userId, postId: postId })
        await new Like({ userId: userId, postId: postId }).save()
      } else {
        throw error
      }
    }
  }

  return await Post.findById(postId)
}

/**
 * Increment share count for a post
 */
const incrementShareCount = async (postId) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new Error('Post not found')
  }

  post.shareCount += 1
  await post.save()

  return post
}

/**
 * Add tags to a post (helper for createPost)
 */
const addTagsToPost = async (postId, tagNames) => {
  for (const tagName of tagNames) {
    // Find existing tag or create new one
    let tag = await Tag.findOne({ name: tagName.trim() })
    if (!tag) {
      tag = await new Tag({ name: tagName.trim() }).save()
    }

    // Create association between post and tag if it doesn't exist
    const existing = await PostsTags.findOne({
      postId: postId,
      tagId: tag._id,
    })
    if (!existing) {
      await new PostsTags({
        postId: postId,
        tagId: tag._id,
      }).save()
    }
  }
}

/**
 * Add a single tag to a post
 */
const addTagToPost = async (postId, tagName) => {
  // Find existing tag or create new one
  let tag = await Tag.findOne({ name: tagName.trim() })
  if (!tag) {
    tag = await new Tag({ name: tagName.trim() }).save()
  }

  // Check if tag association already exists to avoid duplicates
  const existing = await PostsTags.findOne({ postId: postId, tagId: tag._id })
  if (!existing) {
    await new PostsTags({ postId: postId, tagId: tag._id }).save()
  }

  return await Post.findById(postId)
}

/**
 * Remove a tag from a post
 */
const removeTagFromPost = async (postId, tagName) => {
  // Find the tag by name
  const tag = await Tag.findOne({ name: tagName.trim() })
  if (tag) {
    await PostsTags.findOneAndDelete({ postId: postId, tagId: tag._id })
  }

  return await Post.findById(postId)
}

/**
 * Search posts by tag names
 */
const searchPostsByTags = async (tags, limit = 10, offset = 0) => {
  if (!tags || tags.length === 0) return []

  // Find tags that match the search terms (case insensitive)
  const matchingTags = await Tag.find({
    name: { $in: tags.map((tag) => new RegExp(tag.trim(), 'i')) },
  })

  if (matchingTags.length === 0) return []

  // Find post-tag associations for matching tags
  const postTagRecords = await PostsTags.find({
    tagId: { $in: matchingTags.map((tag) => tag._id) },
  })

  // Get unique post IDs
  const postIds = [...new Set(postTagRecords.map((record) => record.postId))]

  // Find and return posts
  return await Post.find({ _id: { $in: postIds } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .populate('userId', 'displayName photoURL')
}

/**
 * Advanced search posts by search term, tags, and location
 */
const searchPosts = async (searchTerm, tags, location, limit = 10, offset = 0) => {
  // If no search criteria provided, return empty array
  if (
    (!searchTerm || searchTerm.trim() === '') &&
    (!tags || tags.length === 0) &&
    (!location || location.trim() === '')
  ) {
    return []
  }

  const searchConditions = []

  // Handle search term
  if (searchTerm && searchTerm.trim() !== '') {
    const trimmedTerm = searchTerm.trim()

    // Find tags that match search term
    const matchingTags = await Tag.find({
      name: { $regex: trimmedTerm, $options: 'i' },
    })

    // Get post IDs that have matching tags
    let tagPostIds = []
    if (matchingTags.length > 0) {
      const postTagRecords = await PostsTags.find({
        tagId: { $in: matchingTags.map((tag) => tag._id) },
      })
      tagPostIds = postTagRecords.map((record) => record.postId)
    }

    // Add search term conditions
    searchConditions.push({
      $or: [
        { title: { $regex: trimmedTerm, $options: 'i' } },
        { placeName: { $regex: trimmedTerm, $options: 'i' } },
        { content: { $regex: trimmedTerm, $options: 'i' } },
        ...(tagPostIds.length > 0 ? [{ _id: { $in: tagPostIds } }] : []),
      ],
    })
  }

  // Handle specific tags filter
  if (tags && tags.length > 0) {
    const matchingTags = await Tag.find({
      name: { $in: tags.map((tag) => new RegExp(tag.trim(), 'i')) },
    })

    if (matchingTags.length > 0) {
      const postTagRecords = await PostsTags.find({
        tagId: { $in: matchingTags.map((tag) => tag._id) },
      })
      const tagPostIds = postTagRecords.map((record) => record.postId)

      if (tagPostIds.length > 0) {
        searchConditions.push({ _id: { $in: tagPostIds } })
      }
    }
  }

  // Handle location filter
  if (location && location.trim() !== '') {
    const trimmedLocation = location.trim()
    searchConditions.push({
      location: { $regex: trimmedLocation, $options: 'i' },
    })
  }

  // If no valid search conditions, return empty array
  if (searchConditions.length === 0) {
    return []
  }

  // Build final search filter
  const searchFilter =
    searchConditions.length === 1
      ? searchConditions[0]
      : { $and: searchConditions }

  return await Post.find(searchFilter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .populate('userId', 'displayName photoURL')
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
  getPostsByUserId,
  toggleWantToGo,
  toggleLike,
  incrementShareCount,
  addTagsToPost,
  addTagToPost,
  removeTagFromPost,
  searchPostsByTags,
  searchPosts,
}