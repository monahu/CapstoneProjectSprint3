const User = require('../models/User')

const createGraphQLContext = async ({ req }) => {
  console.log('📋 GraphQL Context - User:', req.user ? 'Present' : 'Missing')

  let userDbRecord = null
  if (req.user) {
    console.log('👤 User UID:', req.user.uid)
    // Fetch the full database user record once per request using encrypted field lookup
    userDbRecord = await User.findByFirebaseUid(req.user.uid)
    console.log('💾 User DB record found:', userDbRecord ? 'Yes' : 'No')
  }

  return {
    user: req.user, // Firebase user (for auth)
    currentUser: userDbRecord, // Full DB user record (for queries)
  }
}

module.exports = { createGraphQLContext }
