import { useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import { BASIC_SEARCH } from '../../utils/graphql/post'

export const useBasicSearch = () => {
  const [searchResults, setSearchResults] = useState(null)
  const [
    executeSearch,
    { data, loading, error, called, fetchMore, networkStatus },
  ] = useLazyQuery(BASIC_SEARCH, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('BASIC_SEARCH error:', error)
    },
    onCompleted: (data) => {
      setSearchResults(data)
    },
  })

  const searchPosts = (searchTerm, options = {}) => {
    const { limit = 10, offset = 0 } = options

    if (!searchTerm?.trim()) {
      setSearchResults(null)
      return
    }

    return executeSearch({
      variables: {
        searchTerm: searchTerm.trim(),
        limit,
        offset,
      },
    })
  }

  const loadMoreResults = (currentSearchTerm, currentOptions = {}) => {
    if (!data?.basicSearch) return

    const currentLength = data.basicSearch.length
    const { limit = 20 } = currentOptions

    return fetchMore({
      variables: {
        searchTerm: currentSearchTerm?.trim(),
        limit,
        offset: currentLength,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult

        return {
          basicSearch: [
            ...(previousResult.basicSearch || []),
            ...(fetchMoreResult.basicSearch || []),
          ],
        }
      },
    })
  }

  const posts = searchResults?.basicSearch || []
  const isLoadingMore = networkStatus === 3
  const hasMoreResults = posts.length > 0 && posts.length % 20 === 0

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