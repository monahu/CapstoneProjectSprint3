import { useEffect, useState, useMemo, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { useBasicSearch, useSearchPostsByTags, useTags } from './usePost'
import { useClassNames } from './useClassNames'
import { useTagSelection } from './useTagSelection'
import { TAGS_CONFIG } from '../utils/constants/tags'

export const useExplore = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Basic text search hook
  const basicSearch = useBasicSearch()

  // Tag-based search hook
  const tagSearch = useSearchPostsByTags()

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

  // Determine which search type to use based on URL parameters
  const searchType = searchTerm ? 'text' : tags.length > 0 ? 'tags' : 'none'

  // Execute search when search parameters change
  useEffect(() => {
    // Create a key for current search parameters
    const currentSearchKey = JSON.stringify({ searchTerm, tags })

    // Only search if parameters have actually changed
    if (currentSearchKey !== lastSearchRef.current) {
      lastSearchRef.current = currentSearchKey

      if (searchTerm.trim()) {
        // Use basic text search
        basicSearch.searchPosts(searchTerm)
      } else if (tags.length > 0) {
        // Use tag-based search with pagination support
        tagSearch.searchByTags(tags)
      } else {
        // Clear both search results when no search criteria
        basicSearch.searchPosts('')
        tagSearch.searchByTags([])
      }
    }
  }, [searchTerm, tags])

  const hasActiveSearch = !!(searchTerm || tags.length > 0)

  // Get the appropriate search results based on search type
  const currentSearch = searchType === 'text' ? basicSearch : tagSearch
  const posts = currentSearch.posts || []
  const loading = currentSearch.loading
  const error = currentSearch.error
  const hasSearched = currentSearch.hasSearched

  // Handle clearing all filters
  const clearAllFilters = () => {
    lastSearchRef.current = null
    navigate('/explore', { replace: true })
  }

  // Handle load more results
  const handleLoadMore = () => {
    if (searchType === 'text') {
      basicSearch.loadMoreResults(searchTerm)
    } else if (searchType === 'tags') {
      tagSearch.loadMoreResults(tags)
    }
  }

  // Get tags for display (limit to 10 unless showing all)
  const tagsToDisplay = showAllTags
    ? dbTags
    : dbTags.slice(0, TAGS_CONFIG.DISPLAY_LIMIT)
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
    searchType,

    // Pagination state (for both text and tag search)
    isLoadingMore: currentSearch.isLoadingMore || false,
    hasMoreResults: currentSearch.hasMoreResults || false,
    showLoadMoreButton: currentSearch.showLoadMoreButton || false,

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
    searchPosts: basicSearch.searchPosts, // For manual triggering
    handleLoadMore,
    classNames,
  }
}
