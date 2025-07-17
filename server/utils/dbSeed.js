const Rating = require('../models/Rating')
const User = require('../models/User')
const Post = require('../models/posts')
const { DEFAULT_RATINGS } = require('./constant')

const ensureDefaultRatings = async () => {
  try {
    const existingRatings = await Rating.find()

    if (existingRatings.length === 0) {
      await Rating.insertMany(DEFAULT_RATINGS)
      console.log('✅ Default ratings created')
    } else {
      console.log('⚠️ Default ratings already exist, skipping creation')
    }
  } catch (error) {
    console.error('❌ Error ensuring default ratings:', error)
  }
}

const cleanupOrphanedPosts = async () => {
  try {
    // Find all posts
    const posts = await Post.find()
    let orphanedCount = 0

    for (const post of posts) {
      // Check if the user still exists
      const userExists = await User.findById(post.userId)
      if (!userExists) {
        console.log(`❌ Found orphaned post: ${post.title} (ID: ${post._id})`)
        // Optionally delete the orphaned post or assign to a default user
        // TODO For now, just log it - you can uncomment the next line to delete
        // await Post.findByIdAndDelete(post._id)
        orphanedCount++
      }
    }
    // Log the total number of orphaned posts found
    if (orphanedCount === 0) {
      console.log('✅ No orphaned posts found')
    } else {
      console.log(`⚠️  Found ${orphanedCount} orphaned posts`)
    }
  } catch (error) {
    console.error('❌ Error cleaning up orphaned ratings:', error)
  }
}

module.exports = { ensureDefaultRatings, cleanupOrphanedPosts }
