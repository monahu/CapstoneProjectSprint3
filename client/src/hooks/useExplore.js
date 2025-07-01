import { useEffect, useState, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { useSearchPosts, useTags } from "./usePost"
import { useClassNames } from "./useClassNames"

export const useExplore = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { searchPosts, posts, loading, error, hasSearched } = useSearchPosts()
  const { tags: dbTags } = useTags()
  const { classNames } = useClassNames()
  const [isInitialized, setIsInitialized] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)

  // Extract search parameters from URL
  const searchTerm = searchParams.get("q") || ""
  const tagsParam = searchParams.get("tags") || ""
  const location = searchParams.get("location") || ""

  // Memoize tags array to prevent unnecessary re-renders
  const tags = useMemo(() => {
    return tagsParam
      ? tagsParam
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : []
  }, [tagsParam])

  // Execute search when component mounts or search params change
  useEffect(() => {
    const hasSearchParams = searchTerm || tags.length > 0 || location

    if (hasSearchParams && !isInitialized) {
      searchPosts(searchTerm, { tags, location })
      setIsInitialized(true)
    }
  }, [searchTerm, tags, location, searchPosts, isInitialized])

  const hasActiveSearch = !!(searchTerm || tags.length > 0 || location)

  // Handle clearing all filters
  const clearAllFilters = () => {
    navigate("/explore", { replace: true })
    setIsInitialized(false)
  }

  // Handle tag click to add/remove from selection
  const handleTagClick = (tagName) => {
    const currentTagsArray = tags || []
    let newTags
    if (currentTagsArray.includes(tagName)) {
      // Remove tag if already selected
      newTags = currentTagsArray.filter((tag) => tag !== tagName)
    } else {
      // Add tag if not selected
      newTags = [...currentTagsArray, tagName]
    }

    // Build new URL
    const newSearchParams = new URLSearchParams(searchParams)
    if (newTags.length > 0) {
      newSearchParams.set("tags", newTags.join(","))
    } else {
      newSearchParams.delete("tags")
    }

    const newUrl = `/explore${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`
    navigate(newUrl, { replace: true })
    setIsInitialized(false)
  }

  // Get tags for display (limit to 10 unless showing all)
  const tagsToDisplay = showAllTags ? dbTags : dbTags.slice(0, 10)
  const hasMoreTags = dbTags.length > 10

  return {
    // Search state
    searchTerm,
    tags,
    location,
    posts,
    loading,
    error,
    hasSearched,
    hasActiveSearch,

    // Tag management
    dbTags,
    tagsToDisplay,
    hasMoreTags,
    showAllTags,
    setShowAllTags,

    // Actions
    navigate,
    clearAllFilters,
    handleTagClick,
    classNames,
  }
}
