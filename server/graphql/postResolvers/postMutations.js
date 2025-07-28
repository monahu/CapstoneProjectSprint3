const { requireAuthAndCurrentUser } = require('../userHelpers')
const { checkPostOwnership } = require('../postHelpers')
const {
  createPost,
  updatePost,
  deletePost,
} = require('../../services/post/postCrudService')

const {
  toggleWantToGo,
  toggleLike,
  incrementShareCount,
} = require('../../services/post/postInteractionService')

const {
  addTagToPost,
  removeTagFromPost,
} = require('../../services/post/postTagService')

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
    return await createPost(input, currentUser._id)
  },

  /**
   * Update an existing post
   * Only the post owner can update their posts
   */
  updatePost: async (_, { id, input }, { user, currentUser }) => {
    requireAuthAndCurrentUser(user, currentUser)
    await checkPostOwnership(id, currentUser) // Throws error if not owner
    return await updatePost(id, input)
  },

  /**
   * Delete a post and all associated data
   * Only the post owner can delete their posts
   */
  deletePost: async (_, { id }, { user, currentUser }) => {
    requireAuthAndCurrentUser(user, currentUser)
    await checkPostOwnership(id, currentUser) // Throws error if not owner
    return await deletePost(id)
  },

  /**
   * Toggle user's "want to go" status for a post
   * Any authenticated user can want to go to any post
   */
  toggleWantToGo: async (_, { postId }, { user, currentUser }) => {
    requireAuthAndCurrentUser(user, currentUser)
    return await toggleWantToGo(currentUser._id, postId)
  },

  /**
   * Toggle user's like status for a post
   * Any authenticated user can like any post
   */
  toggleLike: async (_, { postId }, { user, currentUser }) => {
    requireAuthAndCurrentUser(user, currentUser)
    return await toggleLike(currentUser._id, postId)
  },

  toggleShare: async (_, { postId }, { user, currentUser }) => {
    requireAuthAndCurrentUser(user, currentUser)
    return await incrementShareCount(postId)
  },
  /**
   * Add a tag to a post
   * Only the post owner can add tags to their posts
   */
  addTagToPost: async (_, { postId, tagName }, { user, currentUser }) => {
    requireAuthAndCurrentUser(user, currentUser)
    await checkPostOwnership(postId, currentUser) // Throws error if not owner
    return await addTagToPost(postId, tagName)
  },

  /**
   * Remove a tag from a post
   * Only the post owner can remove tags from their posts
   */
  removeTagFromPost: async (_, { postId, tagName }, { user, currentUser }) => {
    requireAuthAndCurrentUser(user, currentUser)
    await checkPostOwnership(postId, currentUser) // Throws error if not owner
    return await removeTagFromPost(postId, tagName)
  },
}

module.exports = postMutations
