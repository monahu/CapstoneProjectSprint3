const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
})

// Add composite unique index instead
likeSchema.index({ userId: 1, postId: 1 }, { unique: true })

module.exports = mongoose.model('Like', likeSchema)
