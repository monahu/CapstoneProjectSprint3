const User = require('../models/User')
const { syncUserToDatabase } = require('./userHelpers')
const { getUserProfile } = require('../services/userService')

const userResolvers = {
  Query: {
    me: async (parent, args, { currentUser }) => {
      if (!currentUser) {
        throw new Error('Authentication required')
      }

      return await getUserProfile(currentUser)
    },
  },
  Mutation: {
    syncUser: async (parent, { input }, { user }) => {
      if (!user) {
        // Just return error without logging
        throw new Error('Authentication required')
      }

      try {
        const firebaseUser = {
          uid: user.uid,
          email: input.email || user.email,
        }

        const syncedUser = await syncUserToDatabase(firebaseUser, input)
        return syncedUser
      } catch (error) {
        throw new Error(`Sync failed: ${error.message}`)
      }
    },

    updateUserProfile: async (parent, { input }, { currentUser }) => {
      if (!currentUser) {
        throw new Error('Authentication required')
      }

      // Update user profile
      const updatedUser = await User.findByIdAndUpdate(currentUser._id, input, {
        new: true,
      })

      return updatedUser
    },
  },
}

module.exports = userResolvers
