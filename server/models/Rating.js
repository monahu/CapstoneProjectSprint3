const mongoose = require('mongoose')
const validator = require('validator')
const ratingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['RECOMMENDED', 'NEW', 'SO-SO'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    validate: {
      validator: function (desc) {
        return !desc || validator.isLength(desc, { max: 200 })
      },
      message: 'Description cannot exceed 200 characters',
    },
  },
  // ... other fields if needed
})

module.exports = mongoose.model('Rating', ratingSchema)
