import { useQuery } from '@apollo/client'
import { SEARCH_POSTS_BY_TAGS } from '../../utils/graphql/post'

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