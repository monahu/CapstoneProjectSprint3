const DEFAULT_RATINGS = [
  {
    type: "RECOMMENDED",
    description: "Highly recommended place",
  },
  {
    type: "NEW",
    description: "New place to try",
  },
  {
    type: "SO-SO",
    description: "Average experience",
  },
]

const RATING_TYPES = {
  RECOMMENDED: "RECOMMENDED",
  NEW: "NEW",
  SO_SO: "SO-SO",
}

const DEFAULT_USER_DISPLAY_NAME = "Anonymous"

const DEFAULT_USER_PHOTO_URL = "https://via.placeholder.com/150"

module.exports = {
  DEFAULT_RATINGS,
  RATING_TYPES,
  DEFAULT_USER_DISPLAY_NAME,
  DEFAULT_USER_PHOTO_URL,
}
