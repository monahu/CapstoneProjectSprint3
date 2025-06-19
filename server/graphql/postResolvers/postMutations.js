const Post = require("../../models/posts")
const PostsTags = require("../../models/PostsTags")
const WantToGo = require("../../models/WantToGo")
const Like = require("../../models/Likes")
const Tag = require("../../models/Tags")
const User = require("../../models/User")
const {
  getUserData,
  checkPostOwnership,
  requireAuthAndCurrentUser,
} = require("../userHelpers")

/**
 * Post Mutation Resolvers
 * Handles all write operations for posts (create, update, delete)
 * and user interactions (like, want to go, tags)
 */
const postMutations = {
  /**
   * Create a new post
   * Only authenticated users can create posts
   */
  createPost: async (_, { input }, { user, currentUser }) => {
    requireAuthAndCurrentUser(user, currentUser)

    const newPost = new Post({
      ...input,
      userId: currentUser._id,
      createdAt: new Date(),
    })

    const savedPost = await newPost.save()

    // Process tags if provided
    if (input.tags && input.tags.length > 0) {
      for (const tagName of input.tags) {
        // Find existing tag or create new one
        let tag = await Tag.findOne({ name: tagName.trim() })
        if (!tag) {
          tag = await new Tag({ name: tagName.trim() }).save()
        }

        // Create association between post and tag
        const existing = await PostsTags.findOne({
          postId: savedPost._id,
          tagId: tag._id,
        })
        if (!existing) {
          await new PostsTags({
            postId: savedPost._id,
            tagId: tag._id,
          }).save()
        }
      }
    }

    return savedPost
  },