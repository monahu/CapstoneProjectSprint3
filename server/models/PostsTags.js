const mongoose = require('mongoose')

const postsTagsSchema = new mongoose.Schema({
  tagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
})

postsTagsSchema.index({ tagId: 1, postId: 1 }, { unique: true }) // Composite key

module.exports = mongoose.model('PostsTags', postsTagsSchema)
