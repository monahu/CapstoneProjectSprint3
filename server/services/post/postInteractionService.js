const Post = require('../../models/posts')
const WantToGo = require('../../models/WantToGo')
const Like = require('../../models/Likes')

/**
 * Post Interaction Service - User interactions with posts
 * Handles likes, want-to-go, and sharing functionality
 */

/**
 * Toggle user's want-to-go status for a post
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

  post.shareCount = (post.shareCount || 0) + 1
  return await post.save()
}

module.exports = {
  toggleWantToGo,
  toggleLike,
  incrementShareCount,
}