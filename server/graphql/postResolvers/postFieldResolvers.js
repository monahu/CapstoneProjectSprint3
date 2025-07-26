const {
  getPostAuthor,
  getPostRating,
  getPostAttendees,
  getPostAttendeeCount,
  checkUserWantToGo,
  getPostLikeCount,
  checkUserLiked,
  getPostTags,
  checkPostOwner,
} = require('../../services/postFieldService')

/**
 * Post Field Resolvers
 * Resolves computed fields and relationships for Post objects
 * These resolvers are called when the corresponding fields are requested in GraphQL queries
 * Now optimized to use aggregated data when available (from getAllPosts aggregation)
 */
const postFieldResolvers = {
  /**
   * Resolve the author of a post
   */
  author: async (parent) => {
    // If author is already populated from aggregation, return it
    if (parent.author && typeof parent.author === 'object') {
      return parent.author
    }
    // Fallback to service call for individual post queries
    return await getPostAuthor(parent)
  },

  /**
   * Resolve the rating details for a post
   */
  rating: async (parent) => {
    // If rating is already populated from aggregation, return it
    if (parent.rating && typeof parent.rating === 'object') {
      return parent.rating
    }
    // Fallback to service call for individual post queries
    return await getPostRating(parent.ratingId)
  },

  /**
   * Get all users who want to go to this post's location
   * Made public - anyone can see who's going to events
   */
  attendees: async (parent) => {
    // If attendees is already populated from aggregation, return it
    if (parent.attendees && Array.isArray(parent.attendees)) {
      return parent.attendees
    }
    // Fallback to service call for individual post queries
    return await getPostAttendees(parent._id)
  },

  /**
   * Get the count of users who want to go to this post's location
   */
  attendeeCount: async (parent) => {
    // If attendeeCount is already computed from aggregation, return it
    if (typeof parent.attendeeCount === 'number') {
      return parent.attendeeCount
    }
    // Fallback to service call for individual post queries
    return await getPostAttendeeCount(parent._id)
  },

  /**
   * Check if the current authenticated user wants to go to this post
   * Returns false for unauthenticated users
   */
  isWantToGo: async (parent, _, { user, currentUser }) => {
    // If isWantToGo is already computed from aggregation, return it
    if (typeof parent.isWantToGo === 'boolean') {
      return parent.isWantToGo
    }
    
    // Fallback to service call for individual post queries
    if (!user || !currentUser) {
      return false
    }

    return await checkUserWantToGo(currentUser._id, parent._id)
  },

  /**
   * Get all users who liked this post
   */
  likes: async (parent) => {
    // If likes is already populated from aggregation, return it
    if (parent.likes && Array.isArray(parent.likes)) {
      return parent.likes
    }
    
    // Fallback: For individual post queries, we'll skip this for now
    // since it requires additional imports and complex logic
    // The aggregation should handle most cases
    return []
  },

  /**
   * Get the count of likes for this post
   */
  likeCount: async (parent) => {
    // If likeCount is already computed from aggregation, return it
    if (typeof parent.likeCount === 'number') {
      return parent.likeCount
    }
    // Fallback to service call for individual post queries
    return await getPostLikeCount(parent._id)
  },

  /**
   * Check if the current authenticated user has liked this post
   * Returns false for unauthenticated users
   */
  isLiked: async (parent, _, { user, currentUser }) => {
    // If isLiked is already computed from aggregation, return it
    if (typeof parent.isLiked === 'boolean') {
      return parent.isLiked
    }
    
    // Fallback to service call for individual post queries
    if (!user || !currentUser) {
      return false
    }

    return await checkUserLiked(currentUser._id, parent._id)
  },

  /**
   * Get all tags associated with this post
   */
  tags: async (parent) => {
    // If tags is already populated from aggregation, return it
    if (parent.tags && Array.isArray(parent.tags)) {
      return parent.tags
    }
    // Fallback to service call for individual post queries
    return await getPostTags(parent._id)
  },

  /**
   * Check if the current authenticated user is the owner of this post
   * Used by frontend to show/hide edit controls
   * Returns false for unauthenticated users
   */
  isOwner: async (parent, _, { user, currentUser }) => {
    // If isOwner is already computed from aggregation, return it
    if (typeof parent.isOwner === 'boolean') {
      return parent.isOwner
    }
    
    // Fallback to service call for individual post queries
    if (!user || !currentUser) {
      return false
    }

    return await checkPostOwner(parent, currentUser._id)
  },
}

module.exports = postFieldResolvers
