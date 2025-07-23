import { useApolloClient } from '@apollo/client'
import { GET_ALL_POSTS } from '../utils/graphql/post'

/**
 * Simple cache refresh hook - just refetches all posts queries
 */
export const useCacheRefresh = () => {
  const client = useApolloClient()

  /**
   * Refresh all posts queries - aggressive approach to ensure cache invalidation
   */
  const refreshPosts = async () => {
    try {
      // Method 1: Refetch all GET_ALL_POSTS queries
      await client.refetchQueries({
        include: [GET_ALL_POSTS],
        optimistic: false
      })
      
      // Method 2: Also evict posts cache entries to be extra sure
      client.cache.evict({ fieldName: 'posts' })
      client.cache.gc()
      
    } catch (error) {
      console.error('Cache refresh failed:', error.message)
      throw error
    }
  }

  /**
   * Nuclear option - reset entire cache (use if regular refresh fails)
   */
  const resetCache = async () => {
    try {
      console.log('💥 Resetting entire Apollo cache...')
      await client.resetStore()
      console.log('✅ Cache reset complete')
    } catch (error) {
      console.error('❌ Cache reset failed:', error.message)
    }
  }

  /**
   * Simple cache invalidation - just refresh everything
   */
  const invalidateCache = () => {
    refreshPosts()
  }

  return {
    refreshPosts,
    resetCache,
    invalidateCache,
  }
}
