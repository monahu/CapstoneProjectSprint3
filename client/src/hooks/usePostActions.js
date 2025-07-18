import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router'
import { TOGGLE_SHARE } from '../utils/graphql/post'
import { useLikePost, useWantToGoPost } from './usePost'

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
    } catch (error) {
      console.error('Like error:', error.message)
      alert(`Like failed: ${error.message}`)
    }
  }

  const handleWantToGoToggle = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    try {
      await toggleWantToGo({ variables: { postId } })
    } catch (error) {
      console.error('Want to go error:', error.message)
      alert(`Want to go failed: ${error.message}`)
    }
  }

  const handleShareClick = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    const postUrl = `${window.location.origin}/post/${postId}`

    if (window.confirm(`Share this post?\n\n${postUrl}`)) {
      try {
        await toggleShare({ variables: { postId } })
        setCurrentShareCount((prev) => prev + 1)
      } catch (error) {
        console.error('Share error:', error.message)
        alert(`Share failed: ${error.message}`)
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
