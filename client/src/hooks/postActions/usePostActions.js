import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useLikePost } from './useLikePost'
import { useWantToGoPost } from './useWantToGoPost'
import { useSharePost } from './useSharePost'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

export const usePostActions = ({
  postId,
  initialLikeCount = 0,
  initialShareCount = 0,
  initialWantToGoCount = 0,
  initialIsLiked = false,
  initialIsWantToGo = false,
  isOwner = false,
}) => {
  const navigate = useNavigate()
  const isLoggedIn = useSelector((state) => state.user.data !== null)

  const { likePost } = useLikePost()
  const { wantToGoPost } = useWantToGoPost()
  const { sharePost } = useSharePost()

  // Common auth check helper
  const requireAuth = (action) => async () => {
    if (!isLoggedIn) return navigate('/login')

    try {
      await action()
    } catch (error) {
      showErrorToast(`Action failed: ${error.message}`)
    }
  }

  const handleLikeToggle = requireAuth(() =>
    likePost({ variables: { postId } })
  )
  const handleWantToGoToggle = requireAuth(() =>
    wantToGoPost({ variables: { postId } })
  )

  const handleShareClick = requireAuth(async () => {
    const postUrl = `${window.location.origin}/post/${postId}`

    try {
      await navigator.clipboard.writeText(postUrl)
      await sharePost({ variables: { postId } })
      showSuccessToast('🔗 Link copied to clipboard!')
    } catch {
      const copied = prompt('Copy this link to share:', postUrl)
      if (copied !== null) {
        await sharePost({ variables: { postId } })
        showSuccessToast('📋 Link shared!')
      }
    }
  })

  return {
    currentLikeCount: initialLikeCount,
    currentShareCount: initialShareCount,
    currentWantToGoCount: initialWantToGoCount,
    isLiked: initialIsLiked,
    isWantToGo: initialIsWantToGo,
    isOwner,
    isLoggedIn,
    handleLikeToggle,
    handleWantToGoToggle,
    handleShareClick,
  }
}
