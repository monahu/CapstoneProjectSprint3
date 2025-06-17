const Rating = require("../models/Rating")
const { DEFAULT_RATINGS } = require("./constant")

const ensureDefaultRatings = async () => {
  const count = await Rating.countDocuments()
  if (count === 0) {
    await Rating.insertMany(DEFAULT_RATINGS)
    console.log("✅ Default ratings created")
  }
}

module.exports = { ensureDefaultRatings }
