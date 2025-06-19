const User = require("../../models/User");
const Rating = require("../../models/Rating");
const WantToGo = require("../../models/WantToGo");
const Like = require("../../models/Likes");
const PostsTags = require("../../models/PostsTags");
const Tag = require("../../models/Tags");
const {
  DEFAULT_USER_DISPLAY_NAME,
  DEFAULT_USER_PHOTO_URL,
} = require("../../utils/constant");

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
    console.log(
      "🔍 Author resolver - Post ID: ----------------------------",
      parent._id
    )
    console.log("📄 userId structure:", parent.userId)

    if (parent.userId._id) {
      console.log("✅ Author already populated:", parent.userId._id)
      console.log("👾 Author displayName:", parent.userId.displayName)

      const result = {
        id: parent.userId._id.toString(),
        displayName: parent.userId.displayName || DEFAULT_USER_DISPLAY_NAME,
        photoURL: parent.userId.photoURL || DEFAULT_USER_PHOTO_URL,
      }

      console.log("📤 Returning author object:", result)
      return result
    }

    console.log("🔄 Fetching author from database")
    const user = await User.findById(parent.userId)
    return user
  },