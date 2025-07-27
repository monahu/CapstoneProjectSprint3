/**
 * Utility functions for generating restaurant-based URLs
 */

/**
 * Generate a URL-friendly slug from text
 */
export const generateSlug = (text) => {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30)
}

/**
 * Generate restaurant URL from post data
 */
export const generateRestaurantUrl = (post) => {
  if (!post?.id) return '/restaurant/post'
  
  // Just use restaurant name - keep it simple
  const placeSlug = generateSlug(post.placeName || 'restaurant')
  
  // Keep ID for reliable lookup
  return `/restaurant/${placeSlug}-${post.id}`
}

/**
 * Extract post ID from restaurant URL
 */
export const extractIdFromRestaurantUrl = (slug) => {
  if (!slug) return null
  
  // Extract the ID from the end of the slug
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  
  // Check if last part looks like a MongoDB ObjectId (24 hex chars) or number
  if (/^[a-f\d]{24}$/i.test(lastPart) || /^\d+$/.test(lastPart)) {
    return lastPart
  }
  
  return null
}