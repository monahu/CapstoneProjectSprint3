const Post = require('../../models/posts')
const PostsTags = require('../../models/PostsTags')
const Tag = require('../../models/Tags')

/**
 * Post Tag Service - Tag management for posts
 * Handles adding, removing, and managing post-tag associations
 */

/**
 * Add multiple tags to a post (used in transactions)
 */
const addTagsToPost = async (postId, tagNames, session = null) => {
  for (const tagName of tagNames) {
    // Find existing tag or create new one
    let tag = await Tag.findOne({ name: tagName.trim() }).session(session)
    if (!tag) {
      tag = await new Tag({ name: tagName.trim() }).save({ session })
    }

    // Create association between post and tag if it doesn't exist
    const existing = await PostsTags.findOne({
      postId: postId,
      tagId: tag._id,
    }).session(session)
    if (!existing) {
      await new PostsTags({
        postId: postId,
        tagId: tag._id,
      }).save({ session })
    }
  }
}

/**
 * Add a single tag to a post
 */
const addTagToPost = async (postId, tagName) => {
  // Find existing tag or create new one
  let tag = await Tag.findOne({ name: tagName.trim() })
  if (!tag) {
    tag = await new Tag({ name: tagName.trim() }).save()
  }

  // Create association between post and tag if it doesn't exist
  const existing = await PostsTags.findOne({
    postId: postId,
    tagId: tag._id,
  })
  if (!existing) {
    await new PostsTags({
      postId: postId,
      tagId: tag._id,
    }).save()
  }

  return await Post.findById(postId)
}

/**
 * Remove a tag from a post
 */
const removeTagFromPost = async (postId, tagName) => {
  const tag = await Tag.findOne({ name: tagName.trim() })
  if (!tag) {
    throw new Error('Tag not found')
  }

  await PostsTags.deleteOne({
    postId: postId,
    tagId: tag._id,
  })

  return await Post.findById(postId)
}

module.exports = {
  addTagsToPost,
  addTagToPost,
  removeTagFromPost,
}