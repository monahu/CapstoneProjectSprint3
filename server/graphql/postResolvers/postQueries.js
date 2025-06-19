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