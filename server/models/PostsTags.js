const postsTagsSchema = new mongoose.Schema({
    tag_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
});

postsTagsSchema.index({ tag_id: 1, post_id: 1 }, { unique: true }); // Composite key

module.exports = mongoose.model("PostsTags", postsTagsSchema);
