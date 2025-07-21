const User = require('../models/User')
const Rating = require('../models/Rating')
const WantToGo = require('../models/WantToGo')
const Like = require('../models/Likes')
const PostsTags = require('../models/PostsTags')
const Tag = require('../models/Tags')
const {
  DEFAULT_USER_DISPLAY_NAME,
  DEFAULT_USER_PHOTO_URL,
} = require('../utils/constant')

/**
 * Post Field Service - Business logic for post field resolvers
 * Handles computed fields and relationships for Post objects
 */

/**
 * Resolve the author of a post with fallback handling
 */
const getPostAuthor = async (post) => {
  try {
    // Handle different sources of user ID
    let userId

    // First, check if the post has the populated author data
    if (post.author && typeof post.author === 'object') {
      // Author is already populated (from aggregation or populate)
      return post.author
    }

    // Get userId from different possible sources
    if (post.userId) {
      userId = post.userId
    } else if (post.author && typeof post.author === 'string') {
      userId = post.author
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
    if (post.author && typeof post.author === 'object') {
      const result = {
        _id: post.author._id || userId,
        displayName: post.author.displayName || 'Unknown User',
        email: post.author.email || '',
        photoURL: post.author.photoURL || 'https://i.pravatar.cc/150?img=1',
        firstName: post.author.firstName || '',
        lastName: post.author.lastName || '',
        phone: post.author.phone || '',
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
}

/**
 * Get rating details for a post
 */
const getPostRating = async (ratingId) => {
  return await Rating.findById(ratingId)
}

/**
 * Get all users who want to go to this post's location
 */
const getPostAttendees = async (postId) => {
  const records = await WantToGo.find({ postId: postId })

  const userIds = records.map((r) => r.userId)
  const attendees = await User.find({ _id: { $in: userIds } })

  // Only return the fields defined in type - AttendeeInfo
  return attendees.map((attendee) => ({
    id: attendee._id.toString(),
    displayName: attendee.displayName,
    photoURL: attendee.photoURL,
  }))
}

/**
 * Get the count of users who want to go to this post's location
 */
const getPostAttendeeCount = async (postId) => {
  return await WantToGo.countDocuments({ postId: postId })
}

/**
 * Check if a user wants to go to this post
 */
const checkUserWantToGo = async (userId, postId) => {
  if (!userId) return false

  const wantToGo = await WantToGo.findOne({
    userId: userId,
    postId: postId,
  })

  return !!wantToGo
}

/**
 * Get the count of likes for this post
 */
const getPostLikeCount = async (postId) => {
  return await Like.countDocuments({ postId: postId })
}

/**
 * Check if a user has liked this post
 */
const checkUserLiked = async (userId, postId) => {
  if (!userId) return false

  const like = await Like.findOne({
    userId: userId,
    postId: postId,
  })

  return !!like
}

/**
 * Get all tags associated with this post
 */
const getPostTags = async (postId) => {
  const records = await PostsTags.find({ postId: postId })

  const tagIds = records.map((r) => r.tagId)
  const tags = await Tag.find({ _id: { $in: tagIds } })

  return tags.map((tag) => ({
    id: tag._id.toString(),
    name: tag.name,
  }))
}

/**
 * Check if a user is the owner of this post
 */
const checkPostOwner = async (post, userId) => {
  if (!userId) return false

  // Direct comparison using populated userId
  if (!post.userId || !post.userId._id) {
    return false
  }

  const postUserId = post.userId._id.toString()
  const currentUserId = userId.toString()

  return postUserId === currentUserId
}

module.exports = {
  getPostAuthor,
  getPostRating,
  getPostAttendees,
  getPostAttendeeCount,
  checkUserWantToGo,
  getPostLikeCount,
  checkUserLiked,
  getPostTags,
  checkPostOwner,
}