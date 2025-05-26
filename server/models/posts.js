const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true,
    },
    rating_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
        required: true,
        unique: true,
    },
    place_name: { type: String, maxlength: 50 },
    content: { type: String },
    location: { type: String, maxlength: 200 },
    image_url: { type: String, maxlength: 200 },
    created_at: { type: Date, default: Date.now },
    shares: { type: Number, default: 0 },
});

module.exports = mongoose.model("Post", postSchema);
