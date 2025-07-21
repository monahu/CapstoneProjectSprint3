import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect, useRef, Suspense, lazy } from 'react'

import Hero from './Hero'
import LoadingState from './LoadingState'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import { PostCardSkeleton, ImageSkeleton } from './Skeleton'
import { UI_TEXT } from '../utils/constants/ui'
import { usePosts } from '../hooks/usePost'
import heroImage from '../assets/img/restJam_hero1.webp'
import { POST_QUERY_CONFIG } from '../utils/constants/posts'

// Lazy load RestaurantCard to reduce initial bundle size
const RestaurantCard = lazy(() => import('./Post/RestaurantCard'))

const Home = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.data)
  const authInitialized = useSelector((state) => state.user.authInitialized)
  const previousUserRef = useRef(user)

  // Defer posts loading slightly to prioritize LCP
  const { posts, loading, error, refetch } = usePosts(
    POST_QUERY_CONFIG.DEFAULT_LIMIT,
    POST_QUERY_CONFIG.DEFAULT_OFFSET,
    {},
    {
      // Defer network request slightly to allow LCP to paint first
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-first', // Use cache-first for better perceived performance
    }
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

  // Always render Hero first for LCP, then handle loading states for posts
  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        buttonText={user ? UI_TEXT.hero.buttonLoggedIn : UI_TEXT.hero.button}
        onButtonClick={handleNavigateToLogin}
      />

      {/* Posts content with optimized loading */}
      {loading && !posts.length && (
        <div className='mt-10 space-y-6'>
          {Array.from({ length: 3 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && !posts.length && (
        <ErrorMessage
          error={error}
          onRetry={() => refetch()}
        />
      )}

      {!loading && !error && (!posts || posts.length === 0) && (
        <EmptyState
          onAction={handleNavigateToLogin}
          actionText='Share Your Experience'
        />
      )}

      {/* Posts List with lazy loading */}
      {posts.length > 0 && (
        <div className='space-y-10 mt-10'>
          {posts.map((post, index) => (
            <Suspense
              key={post.id}
              fallback={<PostCardSkeleton />}
            >
              <RestaurantCard
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
                className='max-w-full md:max-w-5/6 lg:max-w-3/4'
                priority={index === 0}
                loading={index > 2 ? 'lazy' : 'eager'}
              />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
