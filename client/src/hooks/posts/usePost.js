import { useQuery } from '@apollo/client'
import { GET_POST_BY_ID } from '../../utils/graphql/post'
import { generateRestaurantUrl } from '../../utils/slugUtils'

export const usePost = (id) => {
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-first", // Try cache first for faster render
    nextFetchPolicy: "cache-and-network", // Background refresh for user-specific data
    notifyOnNetworkStatusChange: true,
    skip: !id,
  })

  // Only show loading for initial load (not for background refetches)
  const isActuallyLoading = loading && (!data?.post || networkStatus === 1)

  // Add URL to post data
  const post = data?.post ? {
    ...data.post,
    url: generateRestaurantUrl(data.post)
  } : null

  return {
    post,
    loading: isActuallyLoading,
    error,
    refetch,
  }
}