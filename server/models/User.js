const mongoose = require('mongoose')
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
      required: true,
      unique: true,
    },
    displayName: String,
    photoURL: String,
    firstName: String,
    lastName: String,
    phone: String,
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
