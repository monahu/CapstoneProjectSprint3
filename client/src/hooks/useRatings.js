import { useQuery, gql } from '@apollo/client'

const GET_ALL_RATINGS = gql`
  query GetAllRatings {
    ratings {
      id
      type
      description
    }
  }
`

export default function useRatings() {
  const { data, loading, error } = useQuery(GET_ALL_RATINGS)
  return {
    ratings: data?.ratings || [],
    loading,
    error,
  }
}
