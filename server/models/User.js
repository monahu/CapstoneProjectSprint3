const mongoose = require('mongoose')
const validator = require('validator')
const encryptionPlugin = require('../utils/encryptionPlugin')

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    firebaseUidHash: {
      type: String,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address',
      },
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
      validate: {
        validator: function (name) {
          return (
            !name ||
            (validator.isLength(name, { min: 2 }) &&
              validator.isAlphanumeric(name, 'en-US', { ignore: " -'" }))
          )
        },
        message:
          'Display name must be at least 2 characters and contain only letters, numbers, spaces, hyphens, and apostrophes',
      },
    },
    photoURL: {
      type: String,
      validate: {
        validator: function (url) {
          return !url || validator.isURL(url, { protocols: ['http', 'https'] })
        },
        message: 'Please provide a valid URL',
      },
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [30, 'First name cannot exceed 30 characters'],
      validate: {
        validator: function (name) {
          return (
            !name ||
            (validator.isLength(name, { min: 1 }) &&
              validator.isAlpha(name, 'en-US', { ignore: " -'" }))
          )
        },
        message:
          'First name can only contain letters, spaces, hyphens, and apostrophes',
      },
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [30, 'Last name cannot exceed 30 characters'],
      validate: {
        validator: function (name) {
          return (
            !name ||
            (validator.isLength(name, { min: 1 }) &&
              validator.isAlpha(name, 'en-US', { ignore: " -'" }))
          )
        },
        message:
          'Last name can only contain letters, spaces, hyphens, and apostrophes',
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (phone) {
          return (
            !phone ||
            validator.isMobilePhone(phone, 'any', { strictMode: false })
          )
        },
        message: 'Please provide a valid phone number',
      },
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
)

// Apply encryption to sensitive fields
userSchema.plugin(encryptionPlugin, {
  fields: ['firebaseUid'], // Only firebaseUid gets hash field for lookups
  encryptOnly: ['email', 'phone'], // These get encrypted but no hash
})

// Virtual fields for posts and wantToGo
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'userId',
})

userSchema.virtual('wantToGo', {
  ref: 'WantToGo',
  localField: '_id',
  foreignField: 'userId',
})

// Enable virtual fields in JSON output
userSchema.set('toJSON', { virtuals: true })
// Enable virtual fields in object output
userSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('User', userSchema)
