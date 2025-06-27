import Hero from './Hero'
import heroImage from '../assets/img/restJam_hero1.webp'
import RestaurantCard from './Post/RestaurantCard'
import { PostCardSkeleton, ImageSkeleton } from './Skeleton'
import { useNavigate } from 'react-router'
import { UI_TEXT } from '../utils/constants/ui'
import { usePosts } from '../hooks/usePost'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { useDispatch } from 'react-redux'
import { addUser, removeUser } from '../utils/userSlice'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [authInitialized, setAuthInitialized] = useState(false)

  // Always fetch posts, but refetch when auth changes
  const { posts, loading, error, refetch } = usePosts(10, 0)

  const handleNavigateToLogin = () => {
    navigate(UI_TEXT.hero.buttonLink)
  }

  // Listen for auth state changes
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

  if (loading) {
    return (
      <div className='min-h-screen'>
        <ImageSkeleton />
        <div className='container mx-auto px-4 py-8 space-y-6'>
          {Array.from({ length: 4 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen'>
        <Hero
          heroImage={heroImage}
          onButtonClick={handleNavigateToLogin}
        />
        <div className='text-center py-20'>
          <p className='text-red-500'>Error loading posts: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        onButtonClick={handleNavigateToLogin}
      />
      {posts.map((post) => (
        <RestaurantCard
          key={post.id}
          id={post.id}
          image={post.imageUrl}
          user={{
            name: post.author.displayName,
            avatar:
              post.author.photoURL ||
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
