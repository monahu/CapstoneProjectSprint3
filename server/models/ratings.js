const ratingSchema = new mongoose.Schema({
    value: { type: Number, min: 0, max: 5, required: true },
});

module.exports = mongoose.model("Rating", ratingSchema);
