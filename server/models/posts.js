const mongoose = require('mongoose')
const validator = require('validator')
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    validate: {
      validator: function (title) {
        return validator.isLength(title, { min: 3, max: 100 })
      },
      message: 'Title must be between 3 and 100 characters',
    },
  },
  ratingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating',
    required: true,
  },
  placeName: {
    type: String,
    trim: true,
    maxlength: [50, 'Place name cannot exceed 50 characters'],
    validate: {
      validator: function (name) {
        return !name || validator.isLength(name, { min: 2, max: 50 })
      },
      message: 'Place name must be between 2 and 50 characters',
    },
  },
  content: {
    type: String,
    trim: true,
    maxlength: [2000, 'Content cannot exceed 2000 characters'],
    validate: {
      validator: function (content) {
        return !content || validator.isLength(content, { max: 2000 })
      },
      message: 'Content cannot exceed 2000 characters',
    },
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters'],
    validate: {
      validator: function (location) {
        return !location || validator.isLength(location, { max: 200 })
      },
      message: 'Location cannot exceed 200 characters',
    },
  },
  imageUrls: {
    desktop: {
      type: String,
      maxlength: [300, 'Image URL cannot exceed 300 characters'],
      validate: {
        validator: function (url) {
          return !url || validator.isURL(url, { protocols: ['http', 'https'] })
        },
        message: 'Please provide a valid URL',
      },
    },
    mobile: {
      type: String,
      maxlength: [300, 'Image URL cannot exceed 300 characters'],
      validate: {
        validator: function (url) {
          return !url || validator.isURL(url, { protocols: ['http', 'https'] })
        },
        message: 'Please provide a valid URL',
      },
    },
    mobile2x: {
      type: String,
      maxlength: [300, 'Image URL cannot exceed 300 characters'],
      validate: {
        validator: function (url) {
          return !url || validator.isURL(url, { protocols: ['http', 'https'] })
        },
        message: 'Please provide a valid URL',
      },
    },
    tablet: {
      type: String,
      maxlength: [300, 'Image URL cannot exceed 300 characters'],
      validate: {
        validator: function (url) {
          return !url || validator.isURL(url, { protocols: ['http', 'https'] })
        },
        message: 'Please provide a valid URL',
      },
    },
  },
  createdAt: { type: Date, default: Date.now },
  shareCount: {
    type: Number,
    default: 0,
    min: [0, 'Share count cannot be negative'],
    validate: {
      validator: function (count) {
        return validator.isInt(count.toString(), { min: 0 })
      },
      message: 'Share count must be a non-negative integer',
    },
  },
})

module.exports = mongoose.model('Post', postSchema)
