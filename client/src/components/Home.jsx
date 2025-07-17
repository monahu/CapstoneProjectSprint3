import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'

import Hero from './Hero'
import LoadingState from './LoadingState'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import RestaurantCard from './Post/RestaurantCard'
import { PostCardSkeleton, ImageSkeleton } from './Skeleton'
import { UI_TEXT } from '../utils/constants/ui'
import { usePosts } from '../hooks/usePost'
import { auth } from '../utils/firebase'
import { addUser, removeUser } from '../utils/userSlice'
import heroImage from '../assets/img/restJam_hero1.webp'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [authInitialized, setAuthInitialized] = useState(false)

  // Always fetch posts, but refetch when auth changes
  const { posts, loading, error, refetch } = usePosts(10, 0)

  // hero button link to login or share post
  const handleNavigateToLogin = () => {
    navigate(user ? UI_TEXT.hero.buttonLinkLoggedIn : UI_TEXT.hero.buttonLink)
  }

  // ===========================
  // AUTH STATE MANAGEMENT
  // ===========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Auth state changed:', user ? 'Logged in' : 'Logged out')

      if (user) {
        // User is signed in
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        )
      } else {
        // User is signed out
        dispatch(removeUser())
      }

      // Refetch posts when auth state changes to update isLiked/isWantToGo
      if (authInitialized && refetch) {
        console.log('🔄 Refetching posts with fresh network data')
        // Use refetch with fetchPolicy to force network request
        refetch({
          fetchPolicy: 'network-only',
        })
      }

      // Mark auth as initialized after first check
      if (!authInitialized) {
        setAuthInitialized(true)
      }
    })

    return () => unsubscribe()
  }, [dispatch, authInitialized, refetch])

  // ===========================
  // RENDER LOGIC
  // ===========================

  // Loading state
  if (loading) {
    return <LoadingState />
  }

  // Main layout with Hero
  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        buttonText={user ? UI_TEXT.hero.buttonLoggedIn : UI_TEXT.hero.button}
        onButtonClick={handleNavigateToLogin}
      />
      {/* Content based on state */}
      {error && (
        <ErrorMessage
          error={error}
          onRetry={() => refetch()}
        />
      )}
      {!error && (!posts || posts.length === 0) && (
        <EmptyState
          onAction={handleNavigateToLogin}
          actionText='Share Your Experience'
        />
      )}
      {/* Posts List */}
      {posts.map((post) => (
        <RestaurantCard
          key={post.id}
          id={post.id}
          image={post.imageUrls?.desktop || post.imageUrl}
          user={{
            name: post.author?.displayName || 'Anonymous User',
            avatar:
              post.author?.photoURL ||
              'https://img.daisyui.com/images/profile/demo/2@94.webp',
          }}
          location={post.location}
          title={post.title}
          placeName={post.placeName}
          description={post.content}
          date={new Date(post.createdAt).toLocaleDateString()}
          tags={post.tags?.map((tag) => tag.name) || []}
          rating={post.rating?.type}
          likeCount={post.likeCount}
          shareCount={post.shareCount || 0}
          wantToGoCount={post.attendeeCount}
          isWantToGo={post.isWantToGo}
          isLiked={post.isLiked}
          className='mt-10 max-w-full md:max-w-5/6 lg:max-w-3/4'
        />
      ))}
    </div>
  )
}

export default Home
