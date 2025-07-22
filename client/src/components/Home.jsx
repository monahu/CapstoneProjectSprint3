import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

import Hero from './Hero'
import LoadingState from './LoadingState'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import RestaurantCard from './Post/RestaurantCard'
import { PostCardSkeleton } from './Skeleton'
import { UI_TEXT } from '../utils/constants/ui'
import { useProgressivePosts } from '../hooks/usePost'
import heroImage from '../assets/img/restJam_hero1.webp'
import { POST_QUERY_CONFIG } from '../utils/constants/posts'

const Home = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.data)
  const authInitialized = useSelector((state) => state.user.authInitialized)
  const previousUserRef = useRef(user)

  // Progressive loading: load first post quickly, then remaining posts
  const {
    posts,
    firstPost,
    remainingPosts,
    loading,
    remainingLoading,
    error,
    hasFirstPost,
    refetch,
  } = useProgressivePosts(
    POST_QUERY_CONFIG.DEFAULT_LIMIT,
    POST_QUERY_CONFIG.DEFAULT_FILTER
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
      {/* Posts List - Progressive Loading */}
      {/* First post loads immediately */}
      {firstPost && (
        <RestaurantCard
          key={firstPost.id}
          id={firstPost.id}
          image={firstPost.imageUrls?.desktop || firstPost.imageUrl}
          user={{
            name: firstPost.author?.displayName || 'Anonymous User',
            avatar:
              firstPost.author?.photoURL ||
              'https://img.daisyui.com/images/profile/demo/2@94.webp',
          }}
          location={firstPost.location}
          title={firstPost.title}
          placeName={firstPost.placeName}
          description={firstPost.content}
          date={new Date(firstPost.createdAt).toLocaleDateString()}
          tags={firstPost.tags?.map((tag) => tag.name) || []}
          rating={firstPost.rating?.type}
          likeCount={firstPost.likeCount}
          shareCount={firstPost.shareCount || 0}
          wantToGoCount={firstPost.attendeeCount}
          isWantToGo={firstPost.isWantToGo}
          isLiked={firstPost.isLiked}
          className='mt-10 max-w-full md:max-w-5xl lg:max-w-4xl'
          priority={true}
        />
      )}

      {/* Show loading skeleton while remaining posts load */}
      {hasFirstPost && remainingLoading && (
        <div className='mt-10 max-w-full md:max-w-5xl lg:max-w-4xl mx-auto'>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      )}

      {/* Remaining posts */}
      {remainingPosts.map((post) => (
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
          className='mt-10 max-w-full md:max-w-5xl lg:max-w-4xl'
          priority={false}
        />
      ))}
    </div>
  )
}

export default Home
