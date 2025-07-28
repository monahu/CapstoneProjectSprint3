const admin = require('firebase-admin')
require('dotenv').config()

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: 'googleapis.com',
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}

// Middleware to authenticate Firebase ID tokens
const authenticateFirebaseIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No valid authorization header')
    return res.status(401).json({ error: 'No token provided - Unauthorized' })
  }

  const idToken = authHeader.split('Bearer ')[1]
  if (idToken.length < 10) {
    console.log('❌ Token length:', idToken?.length || 0)
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
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

  /*   console.log("🔍 Smart Auth Debug:")
  console.log("Operation Name:", operationName)
  console.log("Auth Header:", authHeader ? "Present" : "Missing") */

  // Only allow specific public queries by operation name
  const isPublicQuery =
    operationName?.toLowerCase() === 'posts' ||
    operationName === 'GetAllPosts' ||
    operationName === 'GetPostById' || // Allow visitors to view post details
    operationName === 'GetAllTags' ||
    operationName === 'IntrospectionQuery'

  if (isPublicQuery) {
    // console.log('✅ Public query detected')

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

module.exports = { smartAuth, admin, authenticateFirebaseIdToken }
