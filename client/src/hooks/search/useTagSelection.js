import { useLocation, useNavigate } from 'react-router'

/**
 * Reusable hook for tag selection behavior
 * When a tag is clicked, it clears the search text and location, keeping only tags
 */
export const useTagSelection = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Extract current tags from URL
  const searchParams = new URLSearchParams(location.search)
  const currentTags = searchParams.get('tags')?.split(',').filter(Boolean) || []

  /**
   * Handle tag click to add/remove from selection
   * Clears search text when a tag is clicked (consistent behavior)
   */
  const handleTagClick = (tagName) => {
    let newTags
    if (currentTags.includes(tagName)) {
      // Remove tag if already selected
      newTags = currentTags.filter((tag) => tag !== tagName)
    } else {
      // Add tag if not selected
      newTags = [...currentTags, tagName]
    }

    // Build new URL - clear search term and location, keep only tags
    const newSearchParams = new URLSearchParams()

    // Set tags if any are selected
    if (newTags.length > 0) {
      newSearchParams.set('tags', newTags.join(','))
    }

    // Navigate to explore page with only tag filters
    const newUrl = `/explore${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`
    navigate(newUrl, { replace: true })
  }

  /**
   * Check if a tag is currently selected
   */
  const isTagSelected = (tagName) => {
    return currentTags.includes(tagName)
  }

  return {
    currentTags,
    handleTagClick,
    isTagSelected,
  }
}