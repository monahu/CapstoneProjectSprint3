import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router'
import { TOGGLE_SHARE } from '../utils/graphql/post'
import { useLikePost, useWantToGoPost } from './usePost'
import { showSuccessToast, showErrorToast } from '../utils/toast'

export const usePostActions = ({
  postId,
  initialLikeCount = 0,
  initialShareCount = 0,
  initialWantToGoCount = 0,
  initialIsLiked = false,
  initialIsWantToGo = false,
}) => {
  // Use initial values directly since cache updates will trigger component re-renders
  // Only local state needed is for share count since it's not cached
  const [currentShareCount, setCurrentShareCount] = useState(initialShareCount)

  const navigate = useNavigate()
  const isLoggedIn = useSelector((state) => state.user.data !== null)

  // GraphQL mutations with cache updates
  const { likePost: toggleLike } = useLikePost()
  const { wantToGoPost: toggleWantToGo } = useWantToGoPost()
  const [toggleShare] = useMutation(TOGGLE_SHARE)

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    try {
      await toggleLike({ variables: { postId } })
      // TODO: add a toast to the user that the post has been liked
    } catch (error) {
      console.error('Like error:', error.message)
      showErrorToast(`Like failed: ${error.message}`)
    }
  }

  const handleWantToGoToggle = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    try {
      await toggleWantToGo({ variables: { postId } })
      // TODO: add a toast to the user that the post has been added to their want to go list
    } catch (error) {
      console.error('Want to go error:', error.message)
      showErrorToast(`Want to go failed: ${error.message}`)
    }
  }

  const handleShareClick = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    // TODO: change to an alert to the user that the link can be copied to the clipboard
    const postUrl = `${window.location.origin}/post/${postId}`

    try {
      // Copy URL to clipboard
      await navigator.clipboard.writeText(postUrl)

      // Update share count
      await toggleShare({ variables: { postId } })
      setCurrentShareCount((prev) => prev + 1)

      // Show success feedback
      showSuccessToast('🔗 Link copied to clipboard!')
    } catch (clipboardError) {
      // Fallback for browsers that don't support clipboard API
      if (clipboardError.name === 'NotAllowedError' || !navigator.clipboard) {
        // Fallback: show the URL in a prompt for manual copying
        const copied = prompt('Copy this link to share:', postUrl)
        if (copied !== null) {
          try {
            await toggleShare({ variables: { postId } })
            setCurrentShareCount((prev) => prev + 1)
            showSuccessToast('📋 Link shared!')
          } catch (shareError) {
            console.error('Share count update failed:', shareError.message)
            showErrorToast('Failed to update share count')
          }
        }
      } else {
        console.error('Clipboard copy failed:', clipboardError.message)
        showErrorToast('Failed to copy link to clipboard')
      }
    }
  }

  return {
    // State - using initial values since cache updates trigger re-renders
    currentLikeCount: initialLikeCount,
    currentShareCount,
    currentWantToGoCount: initialWantToGoCount,
    isLiked: initialIsLiked,
    isWantToGo: initialIsWantToGo,
    isLoggedIn,

    // Actions
    handleLikeToggle,
    handleWantToGoToggle,
    handleShareClick,
  }
}
