import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

import Hero from './Hero'
import LoadingState from './LoadingState'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import RestaurantCard from './Post/RestaurantCard'
import LoadMoreSection from './LoadMoreSection'
import { UI_TEXT } from '../utils/constants/ui'
import { usePosts } from '../hooks/usePost'
import { POST_QUERY_CONFIG } from '../utils/constants/posts'
import heroImage from '../assets/img/restJam_hero1.webp'

import { useLocation } from 'react-router-dom'
import { useState } from 'react'


const Home = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.data)
  const authInitialized = useSelector((state) => state.user.authInitialized)
  const previousUserRef = useRef(user)

  const location = useLocation()
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '')

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])


  const {
    posts,
    loading,
    error,
    loadMore,
    refetch,
    isLoadingMore,
    hasMorePosts,
    showLoadMoreButton,
    totalCount,
  } = usePosts(
    POST_QUERY_CONFIG.DEFAULT_LIMIT,
    POST_QUERY_CONFIG.DEFAULT_OFFSET,
    POST_QUERY_CONFIG.DEFAULT_FILTER
  )

  useEffect(() => {
    if (authInitialized && previousUserRef.current !== user && refetch) {
      setTimeout(() => {
        refetch({ fetchPolicy: 'network-only' })
      }, UI_TEXT.defaults.authDelay)
      previousUserRef.current = user
    }
  }, [user, authInitialized, refetch])

  const heroButtonText = user
    ? UI_TEXT.hero.buttonLoggedIn
    : UI_TEXT.hero.button
  const heroButtonLink = user
    ? UI_TEXT.hero.buttonLinkLoggedIn
    : UI_TEXT.hero.buttonLink
  const handleHeroClick = () => navigate(heroButtonLink)
  const handleEmptyStateAction = () => navigate(heroButtonLink)

  const heroProps = {
    heroImage,
    buttonText: heroButtonText,
    onButtonClick: handleHeroClick,
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingState type={UI_TEXT.loadingTypes.FULL} />
    }

    if (error) {
      return (
        <ErrorMessage
          error={error}
          onRetry={refetch}
        />
      )
    }

    if (!posts?.length) {
      return (
        <EmptyState
          onAction={handleEmptyStateAction}
          actionText={UI_TEXT.defaults.emptyStateActionText}
        />
      )
    }

    return (
      <>
        {posts.map((post, index) => (
          <RestaurantCard
            key={post.id}
            id={post.id}
            image={post.imageUrls?.desktop || post.imageUrl}
            user={{
              name: post.author?.displayName || UI_TEXT.defaults.userName,
              avatar: post.author?.photoURL || UI_TEXT.defaults.userAvatar,
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
            isOwner={post.isOwner || false}
            className='mt-10 max-w-full md:max-w-5xl lg:max-w-4xl'
            priority={index === 0}
          />
        ))}

        <LoadMoreSection
          currentCount={posts.length}
          totalCount={totalCount}
          onLoadMore={loadMore}
          isLoading={isLoadingMore}
          hasMore={hasMorePosts}
          showButton={showLoadMoreButton}
          countText={totalCount === 1 ? 'post' : 'posts'}
        />
      </>
    )
  }

  return (
    <div className='min-h-screen'>
      <Hero {...heroProps} />
   
      {successMessage && (
        <div className='mx-auto max-w-xl mt-4 px-4 py-2 rounded-md bg-green-100 text-green-800 font-medium text-center shadow-md border border-green-300'>
          {successMessage}
        </div>
      )}
      {renderContent()}
    </div>
  )
}

export default Home
