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

  const handleNavigateToLogin = () => {
    navigate(user ? UI_TEXT.hero.buttonLinkLoggedIn : UI_TEXT.hero.buttonLink)
  }

  const getPostProps = (post, isPriority = false) => ({
    key: post.id,
    id: post.id,
    image: post.imageUrls?.desktop || post.imageUrl,
    user: {
      name: post.author?.displayName || UI_TEXT.defaults.userName,
      avatar: post.author?.photoURL || UI_TEXT.defaults.userAvatar
    },
    location: post.location,
    title: post.title,
    placeName: post.placeName,
    description: post.content,
    date: new Date(post.createdAt).toLocaleDateString(),
    tags: post.tags?.map((tag) => tag.name) || [],
    rating: post.rating?.type,
    likeCount: post.likeCount,
    shareCount: post.shareCount || 0,
    wantToGoCount: post.attendeeCount,
    isWantToGo: post.isWantToGo,
    isLiked: post.isLiked,
    className: 'mt-10 max-w-full md:max-w-5xl lg:max-w-4xl',
    priority: isPriority
  })

  useEffect(() => {
    if (authInitialized && previousUserRef.current !== user && refetch) {
      setTimeout(() => {
        refetch({ fetchPolicy: 'network-only' })
      }, UI_TEXT.defaults.authDelay)
      previousUserRef.current = user
    }
  }, [user, authInitialized, refetch])

  const renderPostsContent = () => {
    if (loading) {
      return <LoadingState type={UI_TEXT.loadingTypes.FULL} />
    }

    if (error) {
      return <ErrorMessage error={error} onRetry={() => refetch()} />
    }
    
    if (!posts || posts.length === 0) {
      return (
        <EmptyState
          onAction={handleNavigateToLogin}
          actionText={UI_TEXT.defaults.emptyStateActionText}
        />
      )
    }

    return (
      <>
        {firstPost && <RestaurantCard {...getPostProps(firstPost, true)} />}
        
        {hasFirstPost && remainingLoading && (
          <div className='mt-10 max-w-full md:max-w-5xl lg:max-w-4xl mx-auto'>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        )}
        
        {remainingPosts.map((post) => (
          <RestaurantCard {...getPostProps(post)} />
        ))}
      </>
    )
  }

  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        buttonText={user ? UI_TEXT.hero.buttonLoggedIn : UI_TEXT.hero.button}
        onButtonClick={handleNavigateToLogin}
      />
      {renderPostsContent()}
    </div>
  )
}

export default Home
