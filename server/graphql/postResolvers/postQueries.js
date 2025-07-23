const {
  getPosts,
  getPostById,
  getPostsByUserId,
  searchPostsByTags,
  searchPosts,
} = require('../../services/postService')

/**
 * Post Query Resolvers
 * Handles all read operations for posts
 */
const postQueries = {
  /**
   * Get all posts with pagination and filtering
   */
  posts: async (_, { limit = 10, offset = 0, filter = {} }) => {
    const posts = await getPosts(limit, offset, filter)
    const totalCount = await getPosts(null, null, filter, true) // Get total count
    return {
      posts,
      totalCount
    }
  },

  /**
   * Get a single post by its ID
   */
  post: async (_, { id }) => {
    return await getPostById(id)
  },

  /**
   * Get all posts created by the current authenticated user
   */
  myPosts: async (_, __, { user, currentUser }) => {
    if (!user || !currentUser) {
      throw new Error('Authentication required')
    }

    return await getPostsByUserId(currentUser._id)
  },

  /**
   * Search posts by tag names
   */
  searchPostsByTags: async (_, { tags, limit = 10, offset = 0 }) => {
    return await searchPostsByTags(tags, limit, offset)
  },

  /**
   * Advanced search posts by search term, tags, and location
   * Searches in place name, content, and tag names
   */
  searchPosts: async (
    _,
    { searchTerm, tags, location, limit = 10, offset = 0 }
  ) => {
    return await searchPosts(searchTerm, tags, location, limit, offset)
  },
}

module.exports = postQueries
