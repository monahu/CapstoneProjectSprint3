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
  console.log('🔑 Auth Header:', authHeader ? 'Present' : 'Missing')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No valid authorization header')
    return res.status(401).json({ error: 'No token provided - Unauthorized' })
  }

  const idToken = authHeader.split('Bearer ')[1]
  console.log('🎫 Token length:', idToken?.length || 0)

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    console.log('✅ Token verified for user:', decodedToken.uid)
    req.user = decodedToken
    next()
  } catch (error) {
    console.log('❌ Token verification failed:', error.message)
    return res.status(401).json({ error: 'Invalid token - Unauthorized' })
  }
}

// Smart auth that checks for public queries
const smartAuth = async (req, res, next) => {
  const query = req.body?.query || ''
  const operationName = req.body?.operationName
  const authHeader = req.headers.authorization

  console.log('🔍 Smart Auth Debug:')
  console.log('Operation Name:', operationName)
  console.log('Auth Header:', authHeader ? 'Present' : 'Missing')

  // Only allow specific public queries by operation name
  const isPublicQuery =
    operationName?.toLowerCase() === 'posts' ||
    operationName === 'IntrospectionQuery'

  if (isPublicQuery) {
    console.log('✅ Public query detected')

    // If user has token, authenticate them for better experience
    if (authHeader && authHeader.startsWith('Bearer ')) {
      console.log('🔐 Token present, authenticating for enhanced experience')
      return authenticateFirebaseIdToken(req, res, next)
    } else {
      console.log('👤 No token, allowing anonymous access')
      req.user = null
      return next()
    }
  }

  console.log('🔐 Protected query, requiring auth')
  // Everything else requires auth
  return authenticateFirebaseIdToken(req, res, next)
}

module.exports = { smartAuth, admin }
