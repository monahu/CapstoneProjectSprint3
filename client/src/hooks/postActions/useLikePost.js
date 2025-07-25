import { useMutation } from '@apollo/client'
import { TOGGLE_LIKE } from '../../utils/graphql/post'
import { DEFAULT_POSTS_VARIABLES } from '../../utils/constants/posts'
import { updatePostCacheAndQueries } from '../../utils/cacheUtils'
import { showErrorToast } from '../../utils/toast'

export const useLikePost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
  const [likePost, { loading, error }] = useMutation(TOGGLE_LIKE, {
    update(cache, { data: { toggleLike } }) {
      if (!toggleLike) return

      // Update cache using shared utility
      updatePostCacheAndQueries(
        cache,
        toggleLike.id,
        {
          likeCount: () => toggleLike.likeCount,
          isLiked: () => toggleLike.isLiked,
          likes: () => toggleLike.likes || []
        },
        cacheVariables
      )
    },
    onError: (error) => {
      showErrorToast(`Failed to like post: ${error.message}`)
    }
  })
  
  return { likePost, loading, error }
}