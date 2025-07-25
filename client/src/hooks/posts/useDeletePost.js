import { useMutation } from '@apollo/client'
import { DELETE_POST } from '../../utils/graphql/post'
import { DEFAULT_POSTS_VARIABLES } from '../../utils/constants/posts'
import { deletePostFromCache } from '../../utils/cacheUtils'
import { showErrorToast } from '../../utils/toast'

export const useDeletePost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
  const [deletePost, { loading, error }] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost: deletedId } }) {
      deletePostFromCache(cache, deletedId, cacheVariables)
    },
    onError: (error) => {
      showErrorToast(`Failed to delete post: ${error.message}`)
    }
    // No optimistic response - wait for server confirmation for critical operations
  })

  return { deletePost, loading, error }
}