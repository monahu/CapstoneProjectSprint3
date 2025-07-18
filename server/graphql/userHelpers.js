const User = require('../models/User')
const { GraphQLError } = require('graphql')

const requireAuthAndCurrentUser = (user, currentUser) => {
  if (!user) {
    throw new GraphQLError('You must be logged in to perform this action', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    })
  }

  if (!currentUser) {
    throw new GraphQLError('User profile not found', {
      extensions: {
        code: 'USER_NOT_FOUND',
        http: { status: 404 },
      },
    })
  }
}

/**
 * Build user data from input, handling partial updates
 */
const buildUserDataFromInput = (input) => {
  const userData = {}

  // Only include fields that are explicitly provided and not undefined
  if (input.firebaseUid !== undefined) userData.firebaseUid = input.firebaseUid
  if (input.email !== undefined) userData.email = input.email
  if (input.displayName !== undefined) userData.displayName = input.displayName
  if (input.photoURL !== undefined) userData.photoURL = input.photoURL
  if (input.firstName !== undefined) userData.firstName = input.firstName
  if (input.lastName !== undefined) userData.lastName = input.lastName
  if (input.phone !== undefined) userData.phone = input.phone

  return userData
}

/**
 * Update user fields, preserving existing data
 */
const updateUserFields = (existingUser, newData) => {
  const changes = {}

  // Only update fields that are provided and different
  Object.keys(newData).forEach((key) => {
    if (newData[key] !== undefined && existingUser[key] !== newData[key]) {
      changes[key] = newData[key]
      existingUser[key] = newData[key]
    }
  })

  return changes
}

/**
 * Sync Firebase user to database with smart data preservation
 */
const syncUserToDatabase = async (firebaseUser, additionalData = {}) => {
  try {
    // Find existing user
    const existingUser = await User.findByFirebaseUid(firebaseUser.uid)

    if (existingUser) {
      // Prepare update data (only explicit fields)
      const updateData = buildUserDataFromInput({
        ...additionalData,
        email: firebaseUser.email,
      })

      // Update only changed fields
      const changes = updateUserFields(existingUser, updateData)

      if (Object.keys(changes).length > 0) {
        await existingUser.save()
      }

      return existingUser
    } else {
      // Create new user with all available data
      const userData = buildUserDataFromInput({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        ...additionalData,
      })

      return await User.create(userData)
    }
  } catch (error) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      // Race condition - user was created by another process
      return await User.findByFirebaseUid(firebaseUser.uid)
    }
    throw error
  }
}

// Helper to build safe update data
const buildUpdateData = (input) => {
  const updateData = {}
  const allowedFields = [
    'displayName',
    'photoURL',
    'firstName',
    'lastName',
    'phone',
  ]

  allowedFields.forEach((field) => {
    if (input[field] !== undefined && input[field] !== null) {
      updateData[field] = input[field]
    }
  })

  return updateData
}

module.exports = {
  requireAuthAndCurrentUser,
  buildUserDataFromInput,
  updateUserFields,
  syncUserToDatabase,
  buildUpdateData,
}
