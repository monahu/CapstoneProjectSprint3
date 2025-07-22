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
 */
const postFieldResolvers = {
  /**
   * Resolve the author of a post
   */
  author: async (parent) => {
    return await getPostAuthor(parent)
  },

  /**
   * Resolve the rating details for a post
   */
  rating: async (parent) => {
    return await getPostRating(parent.ratingId)
  },

  /**
   * Get all users who want to go to this post's location
   * Made public - anyone can see who's going to events
   */
  // attendees: async (parent, _, { user, currentUser }) => {
  attendees: async (parent) => {
    return await getPostAttendees(parent._id)
  },

  /**
   * Get the count of users who want to go to this post's location
   */
  attendeeCount: async (parent) => {
    return await getPostAttendeeCount(parent._id)
  },

  /**
   * Check if the current authenticated user wants to go to this post
   * Returns false for unauthenticated users
   */
  isWantToGo: async (parent, _, { user, currentUser }) => {
    if (!user || !currentUser) {
      return false
    }

    return await checkUserWantToGo(currentUser._id, parent._id)
  },

  /**
   * Get all users who liked this post
   */
  /*   likes: async (parent) => {
    console.log("🔍 Likes resolver - Post ID:", parent._id)

    const likeRecords = await Like.find({ postId: parent._id })
    console.log("❤️ Like records found:", likeRecords.length)

    const userIds = likeRecords.map((record) => record.userId)
    const users = await User.find({ _id: { $in: userIds } })
    console.log("👥 Users who liked:", users.length)

    return users.map((user) => ({
      id: user._id.toString(),
      displayName: user.displayName || DEFAULT_USER_DISPLAY_NAME,
      photoURL: user.photoURL || DEFAULT_USER_PHOTO_URL,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    }))
  },
 */
  /**
   * Get the count of likes for this post
   */
  likeCount: async (parent) => {
    return await getPostLikeCount(parent._id)
  },

  /**
   * Check if the current authenticated user has liked this post
   * Returns false for unauthenticated users
   */
  isLiked: async (parent, _, { user, currentUser }) => {
    if (!user || !currentUser) {
      return false
    }

    return await checkUserLiked(currentUser._id, parent._id)
  },

  /**
   * Get all tags associated with this post
   */
  tags: async (parent) => {
    return await getPostTags(parent._id)
  },

  /**
   * Check if the current authenticated user is the owner of this post
   * Used by frontend to show/hide edit controls
   * Returns false for unauthenticated users
   */
  isOwner: async (parent, _, { user, currentUser }) => {
    if (!user || !currentUser) {
      return false
    }

    return await checkPostOwner(parent, currentUser._id)
  },
}

module.exports = postFieldResolvers
