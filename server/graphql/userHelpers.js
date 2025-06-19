const User = require("../models/User");
const Post = require("../models/posts");
const { GraphQLError } = require("graphql");

const checkPostOwnership = async (postId, currentUser) => {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    if (post.userId.toString() !== currentUser._id.toString()) {
        throw new Error("Only the post owner can perform this action");
    }
    return { currentUser, post };
};

module.exports = { checkPostOwnership };
