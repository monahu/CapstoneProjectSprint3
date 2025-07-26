const Post = require('../models/posts')
const PostsTags = require('../models/PostsTags')
const WantToGo = require('../models/WantToGo')
const Like = require('../models/Likes')
const Tag = require('../models/Tags')
const mongoose = require('mongoose')
const { buildPostAggregationPipeline } = require('../utils/aggregationPipelines')

/**
 * Post Service - Core business logic for post operations
 * Handles CRUD operations, interactions, and search functionality
 */


/**
 * Create a new post with tags
 */
const createPost = async (input, userId) => {
  const session = await mongoose.startSession()
  
  try {
    let savedPost
    await session.withTransaction(async () => {
      const newPost = new Post({
        ...input,
        userId: userId,
        createdAt: new Date(),
      })

      savedPost = await newPost.save({ session })

      // Process tags if provided
      if (input.tags && input.tags.length > 0) {
        await addTagsToPost(savedPost._id, input.tags, session)
      }
    })

    return savedPost
  } finally {
    await session.endSession()
  }
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
  const session = await mongoose.startSession()
  
  try {
    await session.withTransaction(async () => {
      // Get tag IDs associated with this post before deletion
      const postTagRecords = await PostsTags.find({ postId: postId }).session(session)
      const tagIds = postTagRecords.map((record) => record.tagId)

      // Delete post and all associated records
      await Promise.all([
        Post.findByIdAndDelete(postId).session(session),
        WantToGo.deleteMany({ postId: postId }).session(session),
        Like.deleteMany({ postId: postId }).session(session),
        PostsTags.deleteMany({ postId: postId }).session(session),
      ])

      // Clean up orphaned tags
      if (tagIds.length > 0) {
        for (const tagId of tagIds) {
          const remainingReferences = await PostsTags.countDocuments({
            tagId: tagId,
          }).session(session)
          if (remainingReferences === 0) {
            await Tag.findByIdAndDelete(tagId).session(session)
          }
        }
      }
    })

    return postId
  } finally {
    await session.endSession()
  }
}

/**
 * Get all posts with pagination and filtering using aggregation pipeline
 * This fetches all related data in a single query to avoid N+1 problems
 */
const getPosts = async (limit = 10, offset = 0, filter = {}, options = {}) => {
  const { countOnly = false, withCount = false, currentUserId = null } = options;
  
  if (countOnly) {
    return await Post.countDocuments(filter);
  }

  const safeLimit = Math.min(limit, 50); // Max 50 posts per request
  
  // Use shared aggregation pipeline builder
  const pipeline = buildPostAggregationPipeline(
    filter, 
    currentUserId, 
    { limit: safeLimit, offset }
  );

  const posts = await Post.aggregate(pipeline);

  if (withCount) {
    const totalCount = await Post.countDocuments(filter);
    return { posts, totalCount };
  }

  return posts;
}

/**
 * Get a single post by ID using aggregation pipeline
 */
const getPostById = async (postId, currentUserId = null) => {
  const pipeline = buildPostAggregationPipeline(
    { _id: new mongoose.Types.ObjectId(postId) },
    currentUserId,
    { skipPagination: true }
  );

  const posts = await Post.aggregate(pipeline);
  return posts.length > 0 ? posts[0] : null;
}

/**
 * Get posts by user ID using aggregation pipeline
 */
const getPostsByUserId = async (userId, currentUserId = null) => {
  const pipeline = buildPostAggregationPipeline(
    { userId: new mongoose.Types.ObjectId(userId) },
    currentUserId,
    { skipPagination: true }
  );

  return await Post.aggregate(pipeline);
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
const addTagsToPost = async (postId, tagNames, session = null) => {
  for (const tagName of tagNames) {
    // Find existing tag or create new one
    let tag = await Tag.findOne({ name: tagName.trim() }).session(session)
    if (!tag) {
      tag = await new Tag({ name: tagName.trim() }).save({ session })
    }

    // Create association between post and tag if it doesn't exist
    const existing = await PostsTags.findOne({
      postId: postId,
      tagId: tag._id,
    }).session(session)
    if (!existing) {
      await new PostsTags({
        postId: postId,
        tagId: tag._id,
      }).save({ session })
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
 * Search posts by tag names using aggregation pipeline
 */
const searchPostsByTags = async (tags, limit = 10, offset = 0, currentUserId = null) => {
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

  if (postIds.length === 0) return []

  // Use aggregation pipeline with post IDs filter
  const pipeline = buildPostAggregationPipeline(
    { _id: { $in: postIds } },
    currentUserId,
    { limit, offset }
  );

  return await Post.aggregate(pipeline);
}

/**
 * Advanced search posts by search term, tags, and location using aggregation pipeline
 */
const searchPosts = async (
  searchTerm,
  tags,
  location,
  limit = 10,
  offset = 0,
  currentUserId = null
) => {
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

  // Use aggregation pipeline with search filter
  const pipeline = buildPostAggregationPipeline(
    searchFilter,
    currentUserId,
    { limit, offset }
  );

  return await Post.aggregate(pipeline);
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
