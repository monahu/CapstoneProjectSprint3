const Post = require("../../models/posts")
const Tag = require("../../models/Tags")
const PostsTags = require("../../models/PostsTags")

/**
 * Post Query Resolvers
 * Handles all read operations for posts
 */
const postQueries = {
  /**
   * Get all posts with pagination and filtering
   */
  posts: async (_, { limit = 10, offset = 0, filter = {} }) => {
    const safeLimit = Math.min(limit, 50) // Max 50 posts per request

    return await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .skip(offset)
      .populate("userId", "displayName photoURL")
  },
  
  /**
   * Get a single post by its ID
   */
  post: async (_, { id }) => {
    return await Post.findById(id).populate("userId", "displayName photoURL")
  },

  /**
   * Get all posts created by the current authenticated user
   */
  myPosts: async (_, __, { user, currentUser }) => {
    if (!user || !currentUser) {
      throw new Error("Authentication required")
    }

    return await Post.find({ userId: currentUser._id })
      .sort({ createdAt: -1 })
      .populate("userId", "displayName photoURL")
  },