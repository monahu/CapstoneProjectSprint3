import { GET_ALL_POSTS, GET_POST_BY_ID, GET_ALL_TAGS } from './graphql/post'

/**
 * Updates post cache with new field values
 * @param {Object} cache - Apollo Client cache
 * @param {string} postId - Post ID to update
 * @param {Object} fields - Fields to update with their new values
 */
export const updatePostCache = (cache, postId, fields) => {
  cache.modify({
    id: cache.identify({ __typename: 'Post', id: postId }),
    fields,
  })
}

/**
 * Triggers cache updates for all relevant queries containing the post
 * @param {Object} cache - Apollo Client cache
 * @param {string} postId - Post ID to refresh
 * @param {Object} cacheVariables - Variables for cache queries
 */
export const refreshPostQueries = (cache, postId, cacheVariables = {}) => {
  const queriesToUpdate = [
    { query: GET_ALL_POSTS, variables: cacheVariables },
    { query: GET_POST_BY_ID, variables: { id: postId } },
  ]

  queriesToUpdate.forEach(({ query, variables }) => {
    try {
      const existingData = cache.readQuery({ query, variables })
      if (existingData) {
        cache.writeQuery({
          query,
          variables,
          data: existingData, // Trigger cache update notification
        })
      }
    } catch (e) {
      // Query not in cache, skip silently
    }
  })
}

/**
 * Complete cache update utility that combines field updates and query refresh
 * @param {Object} cache - Apollo Client cache
 * @param {string} postId - Post ID to update
 * @param {Object} fields - Fields to update
 * @param {Object} cacheVariables - Variables for cache queries
 */
export const updatePostCacheAndQueries = (
  cache,
  postId,
  fields,
  cacheVariables = {}
) => {
  updatePostCache(cache, postId, fields)
  refreshPostQueries(cache, postId, cacheVariables)
}

/**
 * Removes a post from cache completely (for delete operations)
 * @param {Object} cache - Apollo Client cache
 * @param {string} postId - Post ID to remove
 */
export const evictPostFromCache = (cache, postId) => {
  // Remove the individual post from cache
  cache.evict({
    id: cache.identify({ __typename: 'Post', id: postId }),
  })

  // Remove from all posts lists
  cache.modify({
    fields: {
      posts(existingPosts = [], { readField }) {
        // Handle nested posts structure (like { posts: [...] })
        if (existingPosts?.posts && Array.isArray(existingPosts.posts)) {
          return {
            ...existingPosts,
            posts: existingPosts.posts.filter(
              (postRef) => postId !== readField('id', postRef)
            ),
          }
        }

        // Handle direct array structure
        if (Array.isArray(existingPosts)) {
          return existingPosts.filter(
            (postRef) => postId !== readField('id', postRef)
          )
        }

        // Return as-is if unexpected structure
        return existingPosts
      },
    },
  })
}

/**
 * Updates total count in posts queries after create/delete operations
 * @param {Object} cache - Apollo Client cache
 * @param {number} countChange - Change in count (+1 for create, -1 for delete)
 * @param {Object} cacheVariables - Variables for cache queries
 */
export const updatePostCount = (cache, countChange, cacheVariables = {}) => {
  try {
    const existingData = cache.readQuery({
      query: GET_ALL_POSTS,
      variables: cacheVariables,
    })

    if (existingData?.posts) {
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: cacheVariables,
        data: {
          ...existingData,
          posts: {
            ...existingData.posts,
            totalCount: Math.max(
              0,
              (existingData.posts.totalCount || 0) + countChange
            ),
          },
        },
      })
    }
  } catch (e) {
    // Query not in cache, skip
  }
}

/**
 * Complete post deletion from cache with count update
 * @param {Object} cache - Apollo Client cache
 * @param {string} postId - Post ID to delete
 * @param {Object} cacheVariables - Variables for cache queries
 */
export const deletePostFromCache = (cache, postId, cacheVariables = {}) => {
  evictPostFromCache(cache, postId)
  updatePostCount(cache, -1, cacheVariables)

  // Invalidate tags cache since deleting posts may affect available tags
  try {
    cache.evict({ fieldName: 'tags' })
  } catch (e) {
    // Ignore if tags field doesn't exist in cache
  }

  // Garbage collect to remove orphaned references
  cache.gc()
}

/**
 * Adds a new post to cache (for create operations)
 * @param {Object} cache - Apollo Client cache
 * @param {Object} newPost - New post data
 * @param {Object} cacheVariables - Variables for cache queries
 */
export const addPostToCache = (cache, newPost, cacheVariables = {}) => {
  try {
    const existingData = cache.readQuery({
      query: GET_ALL_POSTS,
      variables: cacheVariables,
    })

    if (existingData?.posts) {
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: cacheVariables,
        data: {
          posts: {
            ...existingData.posts,
            posts: [newPost, ...existingData.posts.posts],
            totalCount: (existingData.posts.totalCount || 0) + 1,
          },
        },
      })
    }
  } catch (error) {
    console.log('Cache update failed:', error.message)
    // Cache update failed, but the operation still succeeded
  }
}
