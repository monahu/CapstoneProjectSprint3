import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS } from '../../utils/graphql/post'

// Hook for progressive loading: loads 1 post first, then the rest
export const useProgressivePosts = (
  totalLimit = 10,
  filter = {},
  options = {}
) => {
  // First query: load just 1 post
  const {
    data: firstPostData,
    loading: firstLoading,
    error: firstError,
    refetch: refetchFirst,
  } = useQuery(GET_ALL_POSTS, {
    variables: { limit: 1, offset: 0, filter },
    notifyOnNetworkStatusChange: true,
    ...options,
    onError: (error) => {
      console.error('GET_FIRST_POST error:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
      })
    },
  })

  // Second query: load remaining posts (skip first one)
  const {
    data: remainingPostsData,
    loading: remainingLoading,
    error: remainingError,
    refetch: refetchRemaining,
  } = useQuery(GET_ALL_POSTS, {
    variables: { limit: totalLimit - 1, offset: 1, filter },
    notifyOnNetworkStatusChange: true,
    skip: !firstPostData?.posts?.length, // Wait until first post loads
    ...options,
    onError: (error) => {
      console.error('GET_REMAINING_POSTS error:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
      })
    },
  })

  // Combine posts
  const firstPost = firstPostData?.posts?.[0] || null
  const remainingPosts = remainingPostsData?.posts || []
  const allPosts = firstPost ? [firstPost, ...remainingPosts] : []

  // Filter posts by authorId if provided
  const posts = allPosts.filter((post) => {
    return !filter.authorId || post.author?.id === filter.authorId
  })

  const refetch = async (options = {}) => {
    const refetchOptions = { fetchPolicy: 'network-only', ...options }
    await Promise.all([
      refetchFirst(refetchOptions),
      refetchRemaining(refetchOptions),
    ])
  }

  return {
    posts,
    firstPost,
    remainingPosts,
    loading: firstLoading, // Show loading only for first post
    remainingLoading,
    error: firstError || remainingError,
    hasFirstPost: !!firstPost,
    refetch,
  }
}