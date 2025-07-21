import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

import Hero from './Hero'
import LoadingState from './LoadingState'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import RestaurantCard from './Post/RestaurantCard'
import { PostCardSkeleton, ImageSkeleton } from './Skeleton'
import { UI_TEXT } from '../utils/constants/ui'
import { usePosts } from '../hooks/usePost'
import heroImage from '../assets/img/restJam_hero1.webp'
import { POST_QUERY_CONFIG } from '../utils/constants/posts'

const Home = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.data)
  const authInitialized = useSelector((state) => state.user.authInitialized)
  const previousUserRef = useRef(user)

  // Always fetch posts, but refetch when auth changes
  const { posts, loading, error, refetch } = usePosts(
    POST_QUERY_CONFIG.DEFAULT_LIMIT,
    POST_QUERY_CONFIG.DEFAULT_OFFSET
  )

  // hero button link to login or share post
  const handleNavigateToLogin = () => {
    navigate(user ? UI_TEXT.hero.buttonLinkLoggedIn : UI_TEXT.hero.buttonLink)
  }

  // Refetch posts when user auth state changes (login/logout)
  useEffect(() => {
    if (authInitialized && previousUserRef.current !== user && refetch) {
      // Add a small delay to ensure auth token is ready
      setTimeout(() => {
        refetch({
          fetchPolicy: 'network-only',
        })
      }, 100)
      previousUserRef.current = user
    }
  }, [user, authInitialized, refetch])

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
      {posts.map((post, index) => (
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
          priority={index === 0}
        />
      ))}
    </div>
  )
}

export default Home
