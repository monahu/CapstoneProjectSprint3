const Post = require('../../models/posts')
const mongoose = require('mongoose')
const {
  buildPostAggregationPipeline,
} = require('../../utils/aggregationPipelines')
const { addTagsToPost } = require('./postTagService')

/**
 * Post CRUD Service - Core post operations
 * Handles create, read, update, delete operations for posts
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
    return await session.withTransaction(async () => {
      // Get the post first to verify it exists
      const post = await Post.findById(postId).session(session)
      if (!post) {
        throw new Error('Post not found')
      }

      // Import models that depend on this post
      const PostsTags = require('../../models/PostsTags')
      const WantToGo = require('../../models/WantToGo')
      const Like = require('../../models/Likes')

      // Delete all associations
      await PostsTags.deleteMany({ postId: postId }).session(session)
      await WantToGo.deleteMany({ postId: postId }).session(session)
      await Like.deleteMany({ postId: postId }).session(session)

      // Delete the post itself
      await Post.findByIdAndDelete(postId).session(session)

      return postId
    })
  } finally {
    await session.endSession()
  }
}

/**
 * Get posts with pagination and filtering
 */
const getPosts = async (limit = 10, offset = 0, filter = {}, options = {}) => {
  const { currentUserId = null, withCount = false } = options

  const pipeline = buildPostAggregationPipeline(filter, currentUserId, {
    limit,
    offset,
  })

  const posts = await Post.aggregate(pipeline)

  if (withCount) {
    const totalCount = await Post.countDocuments(filter)
    return { posts, totalCount }
  }

  return posts
}

/**
 * Get a single post by ID with user-specific data
 */
const getPostById = async (postId, currentUserId = null) => {
  const pipeline = buildPostAggregationPipeline(
    { _id: new mongoose.Types.ObjectId(postId) },
    currentUserId
  )

  const posts = await Post.aggregate(pipeline)
  return posts.length > 0 ? posts[0] : null
}

/**
 * Get posts by user ID
 */
const getPostsByUserId = async (userId, currentUserId = null) => {
  const pipeline = buildPostAggregationPipeline(
    { userId: new mongoose.Types.ObjectId(userId) },
    currentUserId
  )

  return await Post.aggregate(pipeline)
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
  getPostsByUserId,
}
