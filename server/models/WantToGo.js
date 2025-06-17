const mongoose = require('mongoose')

const wantToGoSchema = new mongoose.Schema({
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

module.exports = mongoose.model('WantToGo', wantToGoSchema)
