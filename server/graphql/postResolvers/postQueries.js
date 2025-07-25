const {
    getPosts,
    getPostById,
    getPostsByUserId,
    searchPostsByTags,
    searchPosts,
} = require("../../services/postService");

/**
 * Post Query Resolvers
 * Handles all read operations for posts
 */
const postQueries = {
    /**
     * Get all posts with pagination and filtering
     */
    posts: async (_, { limit = 10, offset = 0, filter = {} }) => {
        return await getPosts(limit, offset, filter, { withCount: true });
    },

    /**
     * Get a single post by its ID
     */
    post: async (_, { id }) => {
        return await getPostById(id);
    },

    /**
     * Get all posts created by the current authenticated user
     */
    myPosts: async (_, __, { user, currentUser }) => {
        if (!user || !currentUser) {
            throw new Error("Authentication required");
        }

        return await getPostsByUserId(currentUser._id);
    },

    /**
     * Search posts by tag names
     */
    searchPostsByTags: async (_, { tags, limit = 10, offset = 0 }) => {
        return await searchPostsByTags(tags, limit, offset);
    },

    /**
     * Advanced search posts by search term, tags, and location
     * Searches in place name, content, and tag names
     */
    searchPosts: async (
        _,
        { searchTerm, tags, location, limit = 10, offset = 0 }
    ) => {
        return await searchPosts(searchTerm, tags, location, limit, offset);
    },
    myWantToGoPosts: async (_, __, { models, currentUser }) => {
        if (!currentUser) {
            throw new Error("Authentication required");
        }

        const wantToGoEntries = await models.WantToGo.find({
            userId: currentUser._id,
        });
        const postIds = wantToGoEntries.map((entry) => entry.postId);

        const posts = await models.Post.find({
            _id: { $in: postIds },
        }).populate("userId", "displayName photoURL firstName lastName email");

        return posts;
    },
};

module.exports = postQueries;
