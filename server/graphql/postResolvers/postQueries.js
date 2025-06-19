const Post = require("../../models/posts");
const Tag = require("../../models/Tags");
const PostsTags = require("../../models/PostsTags");

/**
 * Post Query Resolvers
 * Handles all read operations for posts
 */
const postQueries = {
  /**
   * Get all posts with pagination and filtering
   */
  posts: async (_, { limit = 10, offset = 0, filter = {} }) => {
    const safeLimit = Math.min(limit, 50); // Max 50 posts per request

    return await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .skip(offset)
      .populate("userId", "displayName photoURL");
  },

  /**
   * Get a single post by its ID
   */
  post: async (_, { id }) => {
    return await Post.findById(id).populate("userId", "displayName photoURL");
  },

  /**
   * Get all posts created by the current authenticated user
   */
  myPosts: async (_, __, { user, currentUser }) => {
    if (!user || !currentUser) {
      throw new Error("Authentication required");
    }

    return await Post.find({ userId: currentUser._id })
      .sort({ createdAt: -1 })
      .populate("userId", "displayName photoURL");
  },

  /**
   * Search posts by tag names
   */
  searchPostsByTags: async (_, { tags, limit = 10, offset = 0 }) => {
    if (!tags || tags.length === 0) return [];

    // Find tags that match the search terms (case insensitive)
    const matchingTags = await Tag.find({
      name: { $in: tags.map((tag) => new RegExp(tag.trim(), "i")) },
    });

    if (matchingTags.length === 0) return [];

    // Find post-tag associations for matching tags
    const postTagRecords = await PostsTags.find({
      tagId: { $in: matchingTags.map((tag) => tag._id) },
    });

    // Get unique post IDs
    const postIds = [...new Set(postTagRecords.map((record) => record.postId))];

    // Find and return posts
    return await Post.find({ _id: { $in: postIds } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .populate("userId", "displayName photoURL");
  },

  /**
   * Simple search posts by search term
   * Searches in place name, content, and tag names
   */
  searchPosts: async (_, { searchTerm, limit = 10, offset = 0 }) => {
    if (!searchTerm || searchTerm.trim() === "") return [];

    const trimmedTerm = searchTerm.trim();

    // Find tags that match search term
    const matchingTags = await Tag.find({
      name: { $regex: trimmedTerm, $options: "i" },
    });

    // Get post IDs that have matching tags
    let tagPostIds = [];
    if (matchingTags.length > 0) {
      const postTagRecords = await PostsTags.find({
        tagId: { $in: matchingTags.map((tag) => tag._id) },
      });
      tagPostIds = postTagRecords.map((record) => record.postId);
    }

    // Search posts by placeName, content, or tag associations
    const searchFilter = {
      $or: [
        { title: { $regex: trimmedTerm, $options: "i" } },
        { placeName: { $regex: trimmedTerm, $options: "i" } },
        { content: { $regex: trimmedTerm, $options: "i" } },
        ...(tagPostIds.length > 0 ? [{ _id: { $in: tagPostIds } }] : []),
      ],
    };

    return await Post.find(searchFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .populate("userId", "displayName photoURL");
  },
};

module.exports = postQueries;
