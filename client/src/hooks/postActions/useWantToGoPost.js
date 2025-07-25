import { useMutation } from '@apollo/client'
import { TOGGLE_WANT_TO_GO } from '../../utils/graphql/post'
import { DEFAULT_POSTS_VARIABLES } from '../../utils/constants/posts'
import { updatePostCacheAndQueries } from '../../utils/cacheUtils'
import { showErrorToast } from '../../utils/toast'

export const useWantToGoPost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
  const [wantToGoPost, { loading, error }] = useMutation(TOGGLE_WANT_TO_GO, {
    update(cache, { data: { toggleWantToGo } }) {
      if (!toggleWantToGo) return

      // Update cache using shared utility
      updatePostCacheAndQueries(
        cache,
        toggleWantToGo.id,
        {
          attendeeCount: () => toggleWantToGo.attendeeCount,
          isWantToGo: () => toggleWantToGo.isWantToGo,
          attendees: () => toggleWantToGo.attendees || []
        },
        cacheVariables
      )
    },
    onError: (error) => {
      showErrorToast(`Failed to update want-to-go status: ${error.message}`)
    }
  })
  
  return { wantToGoPost, loading, error }
}