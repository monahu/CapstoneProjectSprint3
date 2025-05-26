const wantToGoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true,
    },
    posts_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("WantToGo", wantToGoSchema);
