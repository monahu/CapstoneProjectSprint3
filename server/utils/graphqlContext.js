const User = require('../models/User')

const createGraphQLContext = async ({ req }) => {
  let userDbRecord = null
  if (req.user) {
    // Fetch the full database user record once per request using encrypted field lookup
    userDbRecord = await User.findByFirebaseUid(req.user.uid)
  }

  return {
    user: req.user, // Firebase user (for auth)
    currentUser: userDbRecord, // Full DB user record (for queries)
  }
}

module.exports = { createGraphQLContext }
