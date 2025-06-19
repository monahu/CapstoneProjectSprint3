const User = require("../models/User")
const Post = require("../models/posts")
const WantToGo = require("../models/WantToGo")
const { requireAuthAndCurrentUser } = require("./userHelpers")
const { GraphQLError } = require("graphql")

const userResolvers = {
  Query: {
    // *Admins viewing others' profiles
    /* TODO:    userProfile: async (_, { firebaseUid }) => {
      return await User.findOne({ firebaseUid })
    },
 */
    // *Users viewing their own profiles
    me: async (_, __, { user, currentUser }) => {
      requireAuthAndCurrentUser(user, currentUser)

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
        .populate("userId", "displayName photoURL")

      // Get user's wantToGoPosts list with all post data populated
      const wantToGoPosts = await WantToGo.find({
        userId: currentUser._id,
      }).populate({
        path: "postId",
        populate: [
          {
            path: "userId",
            select: "displayName photoURL",
          },
          {
            path: "ratingId",
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
    },
  },

  Mutation: {
    syncUser: async (_, { input }, { user }) => {
      const userData = {
        firebaseUid: user.uid,
        email: user.email,
        displayName: input.displayName,
        photoURL: input.photoURL,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
      }

      // Upsert user - create if doesn't exist, update if exists
      return await User.findOneAndUpdate({ firebaseUid: user.uid }, userData, {
        new: true, // Return updated doc
        upsert: true, // Create if doesn't exist
        runValidators: true, // Run schema validations on update
      })
    },


  },
}

module.exports = userResolvers
