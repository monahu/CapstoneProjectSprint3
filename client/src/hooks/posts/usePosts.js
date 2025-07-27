import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS } from '../../utils/graphql/post'
import { generateRestaurantUrl } from '../../utils/slugUtils'
import { DEFAULT_POSTS_VARIABLES } from '../../utils/constants/posts'

export const usePosts = (
  limit = DEFAULT_POSTS_VARIABLES.limit,
  offset = DEFAULT_POSTS_VARIABLES.offset,
  filter = DEFAULT_POSTS_VARIABLES.filter,
  options = {}
) => {
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

  // Only show loading for initial load or when there's no cached data
  const isActuallyLoading = loading && (!data || !data.posts)

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

  // Add URLs to posts
  const posts = (data?.posts?.posts || []).map((post) => ({
    ...post,
    url: generateRestaurantUrl(post),
  }))

  const totalCount = data?.posts?.totalCount || 0

  const isLoadingMore = networkStatus === 3 // NetworkStatus.fetchMore
  // Check if we have loaded all posts by comparing current count with total
  const hasMorePosts = posts.length < totalCount
  const showLoadMoreButton = posts.length > 0

  return {
    posts, // Return filtered posts
    loading: isActuallyLoading, // Use smart loading state
    error,
    loadMore,
    refetch,
    isLoadingMore,
    hasMorePosts,
    showLoadMoreButton,
    totalCount,
  }
}
