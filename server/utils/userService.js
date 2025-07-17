const Post = require('../models/posts')
const WantToGo = require('../models/WantToGo')

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

  // Get user's posts with author info
  const posts = await Post.find({ userId: currentUser._id })
    .sort({ createdAt: -1 })
    .populate('userId', 'displayName photoURL')

  // Get user's wantToGoPosts list with all post data populated
  const wantToGoPosts = await WantToGo.find({
    userId: currentUser._id,
  }).populate({
    path: 'postId',
    populate: [
      {
        path: 'userId',
        select: 'displayName photoURL',
      },
      {
        path: 'ratingId',
      },
    ],
  })

  return {
    ...userInfo,
    posts,
    wantToGoPosts: wantToGoPosts.map((item) => ({
      id: item._id,
      userId: item.userId._id,
      postId: item.postId._id,
      post: {
        id: item.postId._id,
        title: item.postId.title,
        user: {
          displayName: item.postId.userId.displayName,
        },
      },
    })),
  }
}

module.exports = {
  getUserProfile,
}
