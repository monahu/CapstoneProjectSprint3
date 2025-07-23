import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import {
  GET_ALL_POSTS,
  GET_POST_BY_ID,
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  TOGGLE_LIKE,
  TOGGLE_WANT_TO_GO,
  SEARCH_POSTS,
  SEARCH_POSTS_BY_TAGS,
  GET_ALL_TAGS,
} from '../utils/graphql/post'
import { DEFAULT_POSTS_VARIABLES } from '../utils/constants/posts'

export const usePosts = (limit = 10, offset = 0, filter = {}, options = {}) => {
  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(GET_ALL_POSTS, {
    variables: { limit, offset, filter },
    notifyOnNetworkStatusChange: true,
    ...options,
    onError: (error) => {
      console.error('GET_ALL_POSTS error:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
      })
    },
    onCompleted: (data) => {
      console.log('GET_ALL_POSTS completed:', data)
    },
  })

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
            totalCount: fetchMoreResult.posts.totalCount
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

// New hook for progressive loading: loads 1 post first, then the rest
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

export const usePost = (id) => {
  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    skip: !id,
  })

  return {
    post: data?.post,
    loading,
    error,
  }
}

export const useCreatePost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      try {
        const existingPosts = cache.readQuery({
          query: GET_ALL_POSTS,
          variables: cacheVariables,
        })
        if (existingPosts) {
          cache.writeQuery({
            query: GET_ALL_POSTS,
            variables: cacheVariables,
            data: {
              posts: [createPost, ...existingPosts.posts],
            },
          })
        }
      } catch {
        console.log('Cache update failed, will refetch posts')
      }
    },
    refetchQueries: [
      {
        query: GET_ALL_POSTS,
        variables: cacheVariables,
      },
    ],
    awaitRefetchQueries: true,
  })

  return { createPost, loading, error }
}

export const useLikePost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
  const [likePost, { loading, error }] = useMutation(TOGGLE_LIKE, {
    refetchQueries: [
      {
        query: GET_ALL_POSTS,
        variables: cacheVariables,
      },
    ],
    awaitRefetchQueries: true,
  })
  return { likePost, loading, error }
}

export const useWantToGoPost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
  const [wantToGoPost, { loading, error }] = useMutation(TOGGLE_WANT_TO_GO, {
    refetchQueries: [
      {
        query: GET_ALL_POSTS,
        variables: cacheVariables,
      },
    ],
    awaitRefetchQueries: true,
  })
  return { wantToGoPost, loading, error }
}

export const useDeletePost = () => {
  const [deletePost, { loading, error }] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost: deletedId } }) {
      cache.modify({
        fields: {
          posts(existingPosts = [], { readField }) {
            return existingPosts.filter(
              (postRef) => deletedId !== readField('id', postRef)
            )
          },
        },
      })
    },
  })

  return { deletePost, loading, error }
}

// ===========================
// SEARCH HOOKS
// ===========================

export const useSearchPosts = () => {
  const [executeSearch, { data, loading, error, called }] = useLazyQuery(
    SEARCH_POSTS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
      onError: (error) => {
        console.error('SEARCH_POSTS error:', error)
      },
    }
  )

  const searchPosts = (searchTerm, options = {}) => {
    const { tags, location, limit = 20 } = options

    const hasSearchTerm = searchTerm?.trim()
    const hasTags = tags?.length > 0
    const hasLocation = location?.trim()

    if (!hasSearchTerm && !hasTags && !hasLocation) {
      return
    }

    return executeSearch({
      variables: {
        searchTerm: hasSearchTerm || null,
        tags: hasTags ? tags : null,
        location: hasLocation || null,
        limit,
      },
    })
  }

  return {
    searchPosts,
    posts: data?.searchPosts || [],
    loading,
    error,
    called,
    hasSearched: called,
  }
}

export const useSearchPostsByTags = () => {
  const { data, loading, error, called, refetch } = useQuery(
    SEARCH_POSTS_BY_TAGS,
    {
      skip: true,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
      onError: (error) => {
        console.error('SEARCH_POSTS_BY_TAGS error:', error)
      },
    }
  )

  const searchByTags = (tags, limit = 20) => {
    if (!tags || tags.length === 0) return

    return refetch({
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      limit,
    })
  }

  return {
    searchByTags,
    posts: data?.searchPostsByTags || [],
    loading,
    error,
    called,
    hasSearched: called && !loading,
  }
}

// ===========================
// TAG HOOKS
// ===========================

export const useTags = () => {
  const { data, loading, error } = useQuery(GET_ALL_TAGS, {
    onError: (error) => {
      console.error('GET_ALL_TAGS error:', error)
    },
  })

  return {
    tags: data?.tags || [],
    loading,
    error,
  }
}
