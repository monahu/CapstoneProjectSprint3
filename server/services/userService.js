const Post = require('../models/posts')
const WantToGo = require('../models/WantToGo')
const { buildPostAggregationPipeline } = require('../utils/aggregationPipelines')

// Service to get user profile with posts and wantToGo data
const getUserProfile = async (currentUser) => {
  // Get user's basic info
  const userInfo = {
    id: currentUser._id,
    firebaseUid: currentUser.firebaseUid,
    email: currentUser.email,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    phone: currentUser.phone,
    createdAt: currentUser.createdAt,
    updatedAt: currentUser.updatedAt,
  }

  // Get user's posts with all related data using aggregation pipeline
  const posts = await Post.aggregate(
    buildPostAggregationPipeline(
      { userId: currentUser._id }, 
      currentUser._id, 
      { skipPagination: true }
    )
  )

  // Get user's wantToGoPosts with full post data using aggregation pipeline
  const wantToGoEntries = await WantToGo.find({
    userId: currentUser._id,
  })
  
  let wantToGoPosts = []
  if (wantToGoEntries.length > 0) {
    const postIds = wantToGoEntries.map((entry) => entry.postId)
    
    // Get full post data using aggregation pipeline
    wantToGoPosts = await Post.aggregate(
      buildPostAggregationPipeline(
        { _id: { $in: postIds } },
        currentUser._id,
        { skipPagination: true }
      )
    )
  }

  return {
    ...userInfo,
    posts,
    wantToGoPosts,
  }
}

module.exports = {
  getUserProfile,
}
