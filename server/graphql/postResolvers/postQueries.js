const {
  getPosts,
  getPostById,
  getPostsByUserId,
} = require('../../services/post/postCrudService')

const {
  searchPostsByTags,
  basicSearch,
} = require('../../services/post/postSearchService')
/**
 * Post Query Resolvers
 * Handles all read operations for posts
 */
const postQueries = {
  /**
   * Get all posts with pagination and filtering
   */
  posts: async (
    _,
    { limit = 10, offset = 0, filter = {} },
    { currentUser }
  ) => {
    return await getPosts(limit, offset, filter, {
      withCount: true,
      currentUserId: currentUser?._id,
    })
  },

  /**
   * Get a single post by its ID
   */
  post: async (_, { id }, { currentUser }) => {
    return await getPostById(id, currentUser?._id)
  },

  /**
   * Get all posts created by the current authenticated user
   */
  myPosts: async (_, __, { user, currentUser }) => {
    if (!user || !currentUser) {
      throw new Error('Authentication required')
    }

    return await getPostsByUserId(currentUser._id, currentUser._id)
  },

  /**
   * Search posts by tag names
   */
  searchPostsByTags: async (
    _,
    { tags, limit = 10, offset = 0 },
    { currentUser }
  ) => {
    return await searchPostsByTags(tags, limit, offset, currentUser?._id)
  },

  myWantToGoPosts: async (_, __, { models, currentUser }) => {
    if (!currentUser) {
      throw new Error('Authentication required')
    }

    const wantToGoEntries = await models.WantToGo.find({
      userId: currentUser._id,
    })
    const postIds = wantToGoEntries.map((entry) => entry.postId)

    if (postIds.length === 0) return []

    // Use aggregation pipeline for want-to-go posts
    const {
      buildPostAggregationPipeline,
    } = require('../../utils/aggregationPipelines')
    const pipeline = buildPostAggregationPipeline(
      { _id: { $in: postIds } },
      currentUser._id,
      { skipPagination: true }
    )

    return await models.Post.aggregate(pipeline)
  },

  /**
   * Basic search posts by search term only
   * Searches in title, place name, content, and tag names
   */
  basicSearch: async (
    _,
    { searchTerm, limit = 10, offset = 0 },
    { currentUser }
  ) => {
    return await basicSearch(searchTerm, limit, offset, currentUser?._id)
  },
}

module.exports = postQueries
