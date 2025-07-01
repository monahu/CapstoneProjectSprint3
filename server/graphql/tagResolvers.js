const Tag = require("../models/Tags")

/**
 * Tag Query Resolvers
 * Handles all read operations for tags
 */
const tagResolvers = {
  Query: {
    /**
     * Get all tags from the database
     */
    tags: async () => {
      try {
        return await Tag.find().sort({ name: 1 })
      } catch (error) {
        console.error("Error fetching tags:", error)
        throw new Error("Failed to fetch tags")
      }
    },
  },
}

module.exports = tagResolvers
