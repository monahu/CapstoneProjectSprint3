require('dotenv').config()

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err)
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
  process.exit(1)
})

const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config/database')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const cookieParser = require('cookie-parser')
const { smartAuth } = require('./middleware/auth')
const { merge } = require('lodash')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Utilities
const { createGraphQLContext } = require('./utils/graphqlContext')
const { ensureDefaultRatings, cleanupOrphanedPosts } = require('./utils/dbSeed')

// GraphQL imports
const typeDefs = require('./graphql/typeDefs')
const userResolvers = require('./graphql/userResolvers')
const postResolvers = require('./graphql/postResolvers/index')
const dateResolvers = require('./graphql/dateResolver')
const tagResolvers = require('./graphql/tagResolvers')

// Combine all resolvers
const resolvers = merge(
  userResolvers,
  postResolvers,
  dateResolvers,
  tagResolvers
)

const app = express()

// Apply basic middleware
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    'http://127.0.0.1:5173', // Alternative localhost
    'https://localhost:4173',
    process.env.CLIENT_URL || 'https://your-deployed-client-domain.com',
    'https://studio.apollographql.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use(cors(corsOptions))

// Image upload route (Cloudinary)
const imageUploadRoute = require('./routes/imageUpload')
app.use('/api/upload-image', imageUploadRoute)

// Ratings REST route
const ratingsRouter = require('./routes/ratings')
app.use('/api/ratings', ratingsRouter)

// Post REST route
const postRoute = require('./routes/post')
app.use('/api/posts', postRoute)

// AI Search route
const aiSearchRoute = require('./routes/aiSearch')
app.use('/api', aiSearchRoute)

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const stripeRoute = require('./routes/stripe')
app.use('/api/payment', stripeRoute)

// ! Global error handler - must be defined before server starts
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message)
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' })
})

// Rate limiting for GraphQL endpoint
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
})

// Server startup function
async function startServer() {
  try {
    // Start Apollo Server
    await server.start()
    console.log('🚀 Apollo Server started')

    // Connect to database
    await connectDB()
    console.log('📊 Database connected')

    // Ensure default data exists
    await ensureDefaultRatings()
    // Clean up any orphaned posts
    await cleanupOrphanedPosts()

    // Mount Apollo middleware with authentication
    app.use(
      '/graphql',
      limiter,
      smartAuth,
      expressMiddleware(server, {
        context: createGraphQLContext,
      })
    )
    console.log('🔗 GraphQL middleware mounted')

    // Start HTTP server
    const PORT = process.env.PORT || 3500
    app.listen(PORT, () => {
      console.log(`🌟 Server running on port ${PORT}`)
      console.log(`🎯 GraphQL endpoint: http://localhost:${PORT}/graphql`)
    })

    // Graceful shutdown handlers
    async function gracefulShutdown(signal) {
      console.log(`🛑 ${signal} received, shutting down gracefully`)
      await server.stop()
      await mongoose.connection.close()
      process.exit(0)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()
