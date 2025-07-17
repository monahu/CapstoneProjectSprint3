const {
  requireAuthAndCurrentUser,
  buildUserDataFromInput,
  upsertUser,
  buildUpdateData,
} = require('./userHelpers')
const { getUserProfile } = require('../utils/userService')

const userResolvers = {
  Query: {
    // *Users viewing their own profiles
    me: async (_, __, { user, currentUser }) => {
      requireAuthAndCurrentUser(user, currentUser)
      return await getUserProfile(currentUser)
    },
  },

  Mutation: {
    syncUser: async (_, { input }, { user }) => {
      // Add null check to prevent "Cannot use 'in' operator to search for 'firebaseUid' in undefined"
      if (!user) {
        console.log('❌ syncUser: No authenticated user found')
        throw new Error('Authentication required for user sync')
      }

      try {
        const userData = buildUserDataFromInput(input, user)
        return await upsertUser(userData, user, input)
      } catch (error) {
        console.error('❌ syncUser error:', error)
        throw error
      }
    },

    updateUserProfile: async (_, { input }, { user, currentUser }) => {
      requireAuthAndCurrentUser(user, currentUser)

      console.log('✏️ Updating user profile:', currentUser._id)
      const updateData = buildUpdateData(input)

      console.log('📦 Fields to update:', updateData)
      Object.assign(currentUser, updateData)

      const updatedUser = await currentUser.save()
      console.log('✅ Profile updated successfully')
      return updatedUser
    },
  },
}

module.exports = userResolvers
