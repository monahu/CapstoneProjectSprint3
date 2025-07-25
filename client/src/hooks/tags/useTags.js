import { useQuery } from '@apollo/client'
import { GET_ALL_TAGS } from '../../utils/graphql/post'

export const useTags = () => {
  const { data, loading, error } = useQuery(GET_ALL_TAGS, {
    fetchPolicy: "cache-first", // Try cache first for faster render
    nextFetchPolicy: "cache-and-network", // Background refresh
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