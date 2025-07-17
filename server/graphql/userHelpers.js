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

// Helper to build user data from input
const buildUserDataFromInput = (input, firebaseUser) => {
  const userData = {
    firebaseUid: firebaseUser.uid,
    email: firebaseUser.email,
  }

  // Only include fields that are explicitly provided
  const optionalFields = [
    'displayName',
    'photoURL',
    'firstName',
    'lastName',
    'phone',
  ]
  optionalFields.forEach((field) => {
    if (field in input) {
      userData[field] = input[field]
    }
  })

  return userData
}

// Helper to update user fields only if changed
const updateUserFields = (existingUser, userData, inputFields) => {
  let hasChanges = false
  const changes = []

  Object.keys(userData).forEach((field) => {
    if (field in inputFields && existingUser[field] !== userData[field]) {
      existingUser[field] = userData[field]
      hasChanges = true
      changes.push(field)
    }
  })

  return { hasChanges, changes }
}

// Helper to create or update user
const upsertUser = async (userData, firebaseUser, input) => {
  console.log('🔄 Syncing user:', firebaseUser.uid)

  // Check if user already exists
  const existingUser = await User.findByFirebaseUid(firebaseUser.uid)

  if (existingUser) {
    console.log('✏️ Updating existing user')

    const { hasChanges, changes } = updateUserFields(
      existingUser,
      userData,
      input
    )

    if (hasChanges) {
      const savedUser = await existingUser.save()
      console.log('✅ Updated fields:', changes)
      return savedUser
    } else {
      console.log('ℹ️ No changes detected')
      return existingUser
    }
  } else {
    console.log('🆕 Creating new user')
    const newUser = new User(userData)
    const savedUser = await newUser.save()
    console.log('✅ User created successfully')
    return savedUser
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
  upsertUser,
  buildUpdateData,
}
