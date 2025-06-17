require("dotenv").config()
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Import all models to ensure they're registered with mongoose
    const User = require("../models/User")
    /*     const Post = require("../models/posts")
    const Rating = require("../models/Rating")
    const WantToGo = require("../models/WantToGo") */
    const Like = require("../models/Likes")

    const PostsTags = require("../models/PostsTags")

    // Create indexes
    await User.createIndexes()
    await Like.createIndexes() // has compound index
    await PostsTags.createIndexes() // has compound index
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
