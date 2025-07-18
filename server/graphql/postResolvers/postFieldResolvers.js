const User = require('../../models/User')
const Rating = require('../../models/Rating')
const WantToGo = require('../../models/WantToGo')
const Likes = require('../../models/Likes')
const PostsTags = require('../../models/PostsTags')
const Tag = require('../../models/Tags')
const {
  DEFAULT_USER_DISPLAY_NAME,
  DEFAULT_USER_PHOTO_URL,
} = require('../../utils/constant')

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
    try {
      // Handle different sources of user ID
      let userId

      // First, check if the parent has the populated author data
      if (parent.author && typeof parent.author === 'object') {
        // Author is already populated (from aggregation or populate)
        return parent.author
      }

      // Get userId from different possible sources
      if (parent.userId) {
        userId = parent.userId
      } else if (parent.author && typeof parent.author === 'string') {
        userId = parent.author
      }

      if (!userId) {
        return {
          _id: null,
          displayName: 'Unknown User',
          email: '',
          photoURL: 'https://i.pravatar.cc/150?img=1',
        }
      }

      // Try to get fresh user data from database
      const freshUser = await User.findById(userId)

      if (freshUser) {
        return freshUser
      }

      // Check if author is populated but doesn't have all needed fields
      if (parent.author && typeof parent.author === 'object') {
        const result = {
          _id: parent.author._id || userId,
          displayName: parent.author.displayName || 'Unknown User',
          email: parent.author.email || '',
          photoURL: parent.author.photoURL || 'https://i.pravatar.cc/150?img=1',
          firstName: parent.author.firstName || '',
          lastName: parent.author.lastName || '',
          phone: parent.author.phone || '',
        }

        if (!result.displayName || result.displayName === 'Unknown User') {
          console.log('⚠️ Using fallback populated data:', result)
        }

        return result
      }

      console.log('❌ User not found, returning default author')
      return {
        _id: userId,
        displayName: 'Unknown User',
        email: '',
        photoURL: 'https://i.pravatar.cc/150?img=1',
      }
    } catch (error) {
      console.error('❌ Error resolving author:', error)
      return {
        _id: null,
        displayName: 'Unknown User',
        email: '',
        photoURL: 'https://i.pravatar.cc/150?img=1',
      }
    }
  },

  /**
   * Resolve the rating details for a post
   */
  rating: async (parent) => {
    const rating = await Rating.findById(parent.ratingId)

    return rating
  },

  /**
   * Get all users who want to go to this post's location
   * Made public - anyone can see who's going to events
   */
  // attendees: async (parent, _, { user, currentUser }) => {
  attendees: async (parent) => {
    /*     if (!user || !currentUser) {
      console.log("❌ No authenticated/current user, returning empty array")
      return []
    } */

    const records = await WantToGo.find({ postId: parent._id })

    const userIds = records.map((r) => r.userId)
    const attendees = await User.find({ _id: { $in: userIds } })

    // Only return the fields defined in type - AttendeeInfo
    return attendees.map((attendee) => ({
      id: attendee._id.toString(),
      displayName: attendee.displayName,
      photoURL: attendee.photoURL,
    }))
  },

  /**
   * Get the count of users who want to go to this post's location
   */
  attendeeCount: async (parent) => {
    return await WantToGo.countDocuments({ postId: parent._id })
  },

  /**
   * Check if the current authenticated user wants to go to this post
   * Returns false for unauthenticated users
   */
  isWantToGo: async (parent, _, { user, currentUser }) => {
    if (!user || !currentUser) {
      return false
    }

    const wantToGo = await WantToGo.findOne({
      userId: currentUser._id,
      postId: parent._id,
    })

    return !!wantToGo
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
    return await Likes.countDocuments({ postId: parent._id })
  },

  /**
   * Check if the current authenticated user has liked this post
   * Returns false for unauthenticated users
   */
  isLiked: async (parent, _, { user, currentUser }) => {
    if (!user || !currentUser) {
      return false
    }

    const like = await Likes.findOne({
      userId: currentUser._id,
      postId: parent._id,
    })

    return !!like
  },

  /**
   * Get all tags associated with this post
   */
  tags: async (parent) => {
    const records = await PostsTags.find({ postId: parent._id })

    const tagIds = records.map((r) => r.tagId)
    const tags = await Tag.find({ _id: { $in: tagIds } })

    return tags.map((tag) => ({
      id: tag._id.toString(),
      name: tag.name,
    }))
  },

  /**
   * Check if the current authenticated user is the owner of this post
   * Used by frontend to show/hide edit controls
   * Returns false for unauthenticated users
   */
  isOwner: async (parent, _, { user, currentUser }) => {
    if (!user) {
      return false
    }

    if (!currentUser) {
      return false
    }

    // Direct comparison using populated userId
    if (!parent.userId || !parent.userId._id) {
      return false
    }

    const postUserId = parent.userId._id.toString()
    const currentUserId = currentUser._id.toString()

    const isOwner = postUserId === currentUserId

    return isOwner
  },
}

module.exports = postFieldResolvers

/*  
  likes: async (parent, _, { user, currentUser }) => {
    console.log("🔍 Likes resolver - Post ID:", parent._id)
    console.log("👤 User context:", user ? "Present" : "Missing")

    if (!user || !currentUser) {
      console.log("❌ No user, returning empty array")
      return []
    }

    const records = await Like.find({ postId: parent._id })
    console.log("❤️ Like records found:", records.length)

    const userIds = records.map((r) => r.userId)
    const likers = await User.find({ _id: { $in: userIds } })
    console.log("👥 Likers found:", likers.length)

    return likers.map((liker) => ({
      id: liker._id.toString(),
      displayName: liker.displayName,
      photoURL: liker.photoURL,
      email: liker.email,
      firstName: liker.firstName,
      lastName: liker.lastName,
      phone: liker.phone,
    }))
  } */
