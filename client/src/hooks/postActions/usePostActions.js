import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useLikePost } from './useLikePost'
import { useWantToGoPost } from './useWantToGoPost'
import { useSharePost } from './useSharePost'
import { showSuccessToast, showErrorToast } from '../../utils/toast'
import { generateRestaurantUrl } from '../../utils/slugUtils'
import { useConfirmDialog } from '../useConfirmDialog'

export const usePostActions = ({
  postId,
  initialLikeCount = 0,
  initialShareCount = 0,
  initialWantToGoCount = 0,
  initialIsLiked = false,
  initialIsWantToGo = false,
  isOwner = false,
  placeName = null, // Add placeName for URL generation
}) => {
  const navigate = useNavigate()
  const isLoggedIn = useSelector((state) => state.user.data !== null)

  const { likePost } = useLikePost()
  const { wantToGoPost } = useWantToGoPost()
  const { sharePost } = useSharePost()
  const { confirm, dialogProps } = useConfirmDialog()

  // Common auth check helper
  const requireAuth = (action) => async () => {
    if (!isLoggedIn) return navigate('/login')

    try {
      await action()
    } catch (error) {
      showErrorToast(`Action failed: ${error.message}`)
    }
  }

  const handleLikeToggle = requireAuth(async () => {
    try {
      await likePost({ variables: { postId } })
      // Show appropriate toast based on previous state (action toggles it)
      if (initialIsLiked) {
        showSuccessToast('💔 Removed from favorites')
      } else {
        showSuccessToast('❤️ Added to favorites!')
      }
    } catch (error) {
      showErrorToast(`Failed to update like: ${error.message}`)
    }
  })

  const handleWantToGoToggle = requireAuth(async () => {
    try {
      await wantToGoPost({ variables: { postId } })
      // Show appropriate toast based on previous state (action toggles it)
      if (initialIsWantToGo) {
        showSuccessToast('📍 Removed from your want-to-go list')
      } else {
        showSuccessToast('🎉 Added to your want-to-go list!')
      }
    } catch (error) {
      showErrorToast(`Failed to update want-to-go: ${error.message}`)
    }
  })

  const handleShareClick = async () => {
    // Generate correct restaurant URL using placeName and postId
    const restaurantPath = generateRestaurantUrl({ id: postId, placeName })
    const postUrl = `${window.location.origin}${restaurantPath}`

    // Show confirm dialog before sharing
    const confirmed = await confirm({
      type: 'share',
      title: 'Share Restaurant Post',
      message: `Share this restaurant post? The link will be copied to your clipboard:\n\n${postUrl}`,
      confirmText: 'Share & Copy Link',
      cancelText: 'Cancel',
      showOverlay: true,
    })

    if (confirmed) {
      // Check auth only when user confirms sharing
      if (!isLoggedIn) {
        navigate('/login')
        return
      }

      try {
        await navigator.clipboard.writeText(postUrl)
        await sharePost({ variables: { postId } })
        showSuccessToast('🔗 Link copied to clipboard!')
      } catch {
        // Fallback for browsers that don't support clipboard API
        const fallbackCopy = () => {
          const textArea = document.createElement('textarea')
          textArea.value = postUrl
          document.body.appendChild(textArea)
          textArea.select()
          try {
            document.execCommand('copy')
            showSuccessToast('📋 Link copied to clipboard!')
          } catch {
            showErrorToast(
              'Failed to copy link. Please copy manually: ' + postUrl
            )
          }
          document.body.removeChild(textArea)
        }

        fallbackCopy()
        await sharePost({ variables: { postId } })
      }
    }
  }

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
    // Dialog props for ConfirmDialog component
    confirmDialogProps: dialogProps,
  }
}
