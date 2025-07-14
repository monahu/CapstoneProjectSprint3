import { PostCardSkeleton, ImageSkeleton } from './Skeleton'

/*
 * LoadingState.jsx
 * This component displays a loading state with a specified number of skeleton cards.
 * It's used to show a loading state while the posts are being fetched.
 */
const LoadingState = ({ skeletonCount = 4 }) => {
  return (
    <div className='min-h-screen'>
      <ImageSkeleton />
      <div className='container mx-auto px-4 py-8 space-y-6'>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

export default LoadingState
