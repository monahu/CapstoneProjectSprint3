import { useQuery } from '@apollo/client'
import { GET_POST_BY_ID } from '../../utils/graphql/post'

export const usePost = (id) => {
  const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-first", // Try cache first for faster render
    nextFetchPolicy: "cache-and-network", // Background refresh
    skip: !id,
  })

  return {
    post: data?.post,
    loading,
    error,
    refetch,
  }
}