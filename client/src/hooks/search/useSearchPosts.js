import { useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import { SEARCH_POSTS } from '../../utils/graphql/post'

export const useSearchPosts = () => {
  const [searchResults, setSearchResults] = useState(null)
  const [
    executeSearch,
    { data, loading, error, called, fetchMore, networkStatus },
  ] = useLazyQuery(SEARCH_POSTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('SEARCH_POSTS error:', error)
    },
    onCompleted: (data) => {
      setSearchResults(data)
    },
  })

  const searchPosts = (searchTerm, options = {}) => {
    const { tags, location, limit = 20, offset = 0 } = options

    const hasSearchTerm = searchTerm?.trim()
    const hasTags = tags?.length > 0
    const hasLocation = location?.trim()

    if (!hasSearchTerm && !hasTags && !hasLocation) {
      // Clear results when no search criteria
      setSearchResults(null)
      return
    }

    return executeSearch({
      variables: {
        searchTerm: hasSearchTerm || null,
        tags: hasTags ? tags : null,
        location: hasLocation || null,
        limit,
        offset,
      },
    })
  }

  const loadMoreResults = (currentSearchTerm, currentOptions = {}) => {
    if (!data?.searchPosts) return

    const currentLength = data.searchPosts.length
    const { tags, location, limit = 20 } = currentOptions

    return fetchMore({
      variables: {
        searchTerm: currentSearchTerm?.trim() || null,
        tags: tags?.length > 0 ? tags : null,
        location: location?.trim() || null,
        limit,
        offset: currentLength,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult

        return {
          searchPosts: [
            ...(previousResult.searchPosts || []),
            ...(fetchMoreResult.searchPosts || []),
          ],
        }
      },
    })
  }

  const posts = searchResults?.searchPosts || []
  const isLoadingMore = networkStatus === 3
  const hasMoreResults = posts.length > 0 && posts.length % 20 === 0 // Assuming limit of 20

  return {
    searchPosts,
    loadMoreResults,
    posts,
    loading,
    error,
    called,
    hasSearched: called,
    isLoadingMore,
    hasMoreResults,
    showLoadMoreButton: posts.length > 0 && hasMoreResults,
  }
}