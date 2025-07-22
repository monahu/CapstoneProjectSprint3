import { useApolloClient } from '@apollo/client'
import { GET_ALL_POSTS } from '../utils/graphql/post'
import { DEFAULT_POSTS_VARIABLES } from '../utils/constants/posts'

/**
 * Custom hook for managing Apollo cache refreshes
 * Provides reusable functions for refreshing post-related queries
 */
export const useCacheRefresh = () => {
  const client = useApolloClient()

  /**
   * Refresh the main posts query used by Home component
   * @param {Object} variables - Optional custom variables, defaults to HOME component variables
   */
  const refreshPosts = async (variables = DEFAULT_POSTS_VARIABLES) => {
    try {
      await client.refetchQueries({
        include: [
          {
            query: GET_ALL_POSTS,
            variables,
          },
        ],
      })
    } catch (error) {
      console.warn('Cache refresh failed:', error.message)
    }
  }

  /**
   * Update cache for create/update operations
   * @param {Object} newPost - The new post data to add to cache
   * @param {Object} variables - Query variables to target
   */
  const updatePostsCache = (newPost, variables = DEFAULT_POSTS_VARIABLES) => {
    try {
      const existingPosts = client.readQuery({
        query: GET_ALL_POSTS,
        variables,
      })

      if (existingPosts) {
        client.writeQuery({
          query: GET_ALL_POSTS,
          variables,
          data: {
            posts: [newPost, ...existingPosts.posts],
          },
        })
      }
    } catch (error) {
      console.warn('Cache update failed, will refetch instead:', error.message)
      // Fallback to refresh if cache update fails
      refreshPosts(variables)
    }
  }

  /**
   * Remove post from cache
   * @param {string} postId - ID of post to remove
   * @param {Object} variables - Query variables to target
   */
  const removePostFromCache = (postId, variables = DEFAULT_POSTS_VARIABLES) => {
    try {
      client.cache.modify({
        fields: {
          posts(existingPosts = [], { readField }) {
            return existingPosts.filter(
              (postRef) => postId !== readField('id', postRef)
            )
          },
        },
      })
    } catch (error) {
      console.warn('Cache removal failed, will refetch instead:', error.message)
      refreshPosts(variables)
    }
  }

  return {
    refreshPosts,
    updatePostsCache,
    removePostFromCache,
  }
}
