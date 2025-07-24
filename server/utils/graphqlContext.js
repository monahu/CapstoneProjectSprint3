const User = require('../models/User');
const Post = require('../models/posts');
const WantToGo = require('../models/WantToGo'); 

const createGraphQLContext = async ({ req }) => {
  let userDbRecord = null;
  if (req.user) {
    // Fetch the full database user record once per request
    userDbRecord = await User.findByFirebaseUid(req.user.uid);
  }

  return {
    user: req.user, // Firebase user
    currentUser: userDbRecord, // Full DB user record
    models: {
      User,
      Post,
      WantToGo, 
    },
  };
};

module.exports = { createGraphQLContext };
