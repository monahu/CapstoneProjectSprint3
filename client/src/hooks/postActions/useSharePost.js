import { useMutation } from '@apollo/client'
import { TOGGLE_SHARE } from '../../utils/graphql/post'
import { DEFAULT_POSTS_VARIABLES } from '../../utils/constants/posts'
import { updatePostCache } from '../../utils/cacheUtils'
import { showErrorToast } from '../../utils/toast'

export const useSharePost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
  const [sharePost, { loading, error }] = useMutation(TOGGLE_SHARE, {
    update(cache, { data: { toggleShare } }) {
      if (!toggleShare) return

      // Update cache using shared utility (share doesn't need query refresh)
      updatePostCache(cache, toggleShare.id, {
        shareCount: () => toggleShare.shareCount
      })
    },
    onError: (error) => {
      showErrorToast(`Failed to share post: ${error.message}`)
    }
  })
  
  return { sharePost, loading, error }
}