const mongoose = require("mongoose")
const ratingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["RECOMMENDED", "NEW", "SO-SO"],
    required: true,
  },
  description: String,
  // ... other fields if needed
})

module.exports = mongoose.model("Rating", ratingSchema)
