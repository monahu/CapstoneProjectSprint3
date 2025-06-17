const admin = require('firebase-admin')
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require('../config/serviceAccountKey.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'restjam-6dd35',
  })
}

// Middleware to authenticate Firebase ID tokens
const authenticateFirebaseIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided - Unauthorized' })
  }

  const idToken = authHeader.split('Bearer ')[1]
  // console.log("idToken", idToken)
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token - Unauthorized' })
  }
}

// Smart auth that checks for public queries
const smartAuth = async (req, res, next) => {
  const query = req.body?.query || ''
  const operationName = req.body?.operationName

  // Only allow "posts" query without auth (not myPosts, searchPosts, etc.)
  const isPublicPostsQuery =
    operationName === 'posts' ||
    (query.includes('posts(') && !query.includes('myPosts')) ||
    (query.includes('posts ') && !query.includes('myPosts'))

  if (isPublicPostsQuery) {
    req.user = null
    return next()
  }

  // Everything else requires auth
  return authenticateFirebaseIdToken(req, res, next)
}

module.exports = { authenticateFirebaseIdToken, smartAuth, admin }
