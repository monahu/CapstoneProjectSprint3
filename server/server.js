require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./config/database")
const { ApolloServer } = require("@apollo/server")
const { expressMiddleware } = require("@apollo/server/express4")
const cookieParser = require("cookie-parser")
const { smartAuth } = require("./middleware/auth")
const { merge } = require("lodash")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

// Utilities
const { createGraphQLContext } = require("./utils/graphqlContext")
const { ensureDefaultRatings } = require("./utils/dbSeed")

// GraphQL imports
const typeDefs = require("./graphql/typeDefs")
const userResolvers = require("./graphql/userResolvers")
const postResolvers = require("./graphql/postResolvers/index")
const dateResolvers = require("./graphql/dateResolver")

// Combine all resolvers
const resolvers = merge(userResolvers, postResolvers, dateResolvers)

const app = express()

// Apply basic middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
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
    console.log("🚀 Apollo Server started")

    // Connect to database
    await connectDB()
    console.log("📊 Database connected")

    // Ensure default data exists
    await ensureDefaultRatings()

    // Mount Apollo middleware with authentication
    app.use(
      "/graphql",
      limiter,
      smartAuth,
      expressMiddleware(server, {
        context: createGraphQLContext,
      })
    )
    console.log("🔗 GraphQL middleware mounted")

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

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Start the server
startServer()

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message)
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" })
})
