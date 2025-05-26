const tagSchema = new mongoose.Schema({
    tag_name: { type: String, required: true, maxlength: 100 },
});

module.exports = mongoose.model("Tag", tagSchema);
