import { useEffect, useState, useMemo, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { useSearchPosts, useTags } from './usePost'
import { useClassNames } from './useClassNames'
import { useTagSelection } from './useTagSelection'
import { TAGS_CONFIG } from '../utils/constants/tags'

export const useExplore = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const {
    searchPosts,
    loadMoreResults,
    posts,
    loading,
    error,
    hasSearched,
    isLoadingMore,
    hasMoreResults,
    showLoadMoreButton,
  } = useSearchPosts()
  const { tags: dbTags } = useTags()
  const { classNames } = useClassNames()
  const [showAllTags, setShowAllTags] = useState(false)
  const lastSearchRef = useRef(null)
  const { handleTagClick } = useTagSelection()

  // Extract search parameters from URL
  const searchTerm = searchParams.get('q') || ''
  const tagsParam = searchParams.get('tags') || ''
  const location = searchParams.get('location') || ''

  // Memoize tags array to prevent unnecessary re-renders
  const tags = useMemo(() => {
    return tagsParam
      ? tagsParam
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []
  }, [tagsParam])

  // Execute search when search parameters change
  useEffect(() => {
    // Create a key for current search parameters
    const currentSearchKey = JSON.stringify({ searchTerm, tags, location })

    // Only search if parameters have actually changed
    if (currentSearchKey !== lastSearchRef.current) {
      lastSearchRef.current = currentSearchKey
      // Always call searchPosts, even with empty params to trigger clear logic
      searchPosts(searchTerm, { tags, location })
    }
  }, [searchTerm, tags, location])

  const hasActiveSearch = !!(searchTerm || tags.length > 0 || location)

  // Handle clearing all filters
  const clearAllFilters = () => {
    lastSearchRef.current = null
    navigate('/explore', { replace: true })
  }

  // Handle load more results
  const handleLoadMore = () => {
    loadMoreResults(searchTerm, { tags, location })
  }

  // Get tags for display (limit to 10 unless showing all)
  const tagsToDisplay = showAllTags ? dbTags : dbTags.slice(0, TAGS_CONFIG.DISPLAY_LIMIT)
  const hasMoreTags = dbTags.length > TAGS_CONFIG.DISPLAY_LIMIT

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

    // Pagination state
    isLoadingMore,
    hasMoreResults,
    showLoadMoreButton,

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
    searchPosts,
    handleLoadMore,
    classNames,
  }
}
