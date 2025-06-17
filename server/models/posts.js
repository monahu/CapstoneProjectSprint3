const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  ratingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
    required: true,
  },
  placeName: { type: String, maxlength: 50 },
  content: { type: String },
  location: { type: String, maxlength: 200 },
  imageUrl: { type: String, maxlength: 200 },
  createdAt: { type: Date, default: Date.now },
  shareCount: { type: Number, default: 0 },
})

module.exports = mongoose.model('Post', postSchema)
