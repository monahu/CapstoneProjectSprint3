import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS } from '../../utils/graphql/post'

export const usePosts = (limit = 10, offset = 0, filter = {}, options = {}) => {
  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(
    GET_ALL_POSTS,
    {
      variables: { limit, offset, filter },
      fetchPolicy: 'cache-first', // Try cache first for faster initial render
      nextFetchPolicy: 'cache-and-network', // Background refresh after initial load
      notifyOnNetworkStatusChange: true,
      ...options,
      onError: (error) => {
        console.error('GET_ALL_POSTS error:', {
          message: error.message,
          graphQLErrors: error.graphQLErrors,
          networkError: error.networkError,
        })
      },
      // onCompleted: (data) => {
      //   // console.log('GET_ALL_POSTS completed:', data)
      // },
    }
  )

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data?.posts?.posts?.length || 0,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult

        // Store the length of the new batch to determine if there are more posts
        const newPosts = fetchMoreResult.posts?.posts || []
        const updatedResult = {
          ...previousResult,
          posts: {
            posts: [...previousResult.posts.posts, ...newPosts],
            totalCount: fetchMoreResult.posts.totalCount,
          },
          lastFetchCount: newPosts.length, // Track last fetch size
        }

        return updatedResult
      },
    })
  }

  // Filter posts by authorId (uid) if provided
  const posts =
    data?.posts?.posts?.filter((post) => {
      return !filter.authorId || post.author?.id === filter.authorId
    }) || []

  const totalCount = data?.posts?.totalCount || 0

  const isLoadingMore = networkStatus === 3 // NetworkStatus.fetchMore
  // Check if we have loaded all posts by comparing current count with total
  const hasMorePosts = posts.length < totalCount
  const showLoadMoreButton = posts.length > 0

  return {
    posts, // Return filtered posts
    loading,
    error,
    loadMore,
    refetch,
    isLoadingMore,
    hasMorePosts,
    showLoadMoreButton,
    totalCount,
  }
}
