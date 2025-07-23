import { PostCardSkeleton } from './Skeleton'
import { UI_TEXT } from '../utils/constants/ui'

/*
 * LoadingState.jsx
 * This component displays a user-friendly loading state with animated skeleton cards,
 * loading messages, and a progress indicator.
 */
const LoadingState = ({
  skeletonCount = 3,
  message = UI_TEXT.loading.posts,
  showProgress = true,
}) => {
  return (
    <div className='min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        {/* Loading Header */}
        <div className='text-center mb-8'>
          <div className='flex justify-center items-center gap-3 mb-4'>
            {/* Custom loading spinner */}
            <div className='relative'>
              <div className='w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin'></div>
              <div
                className='absolute inset-0 w-8 h-8 border-4 border-transparent border-r-secondary rounded-full animate-spin animate-reverse'
                style={{ animationDuration: '1.5s' }}
              ></div>
            </div>
            <h2 className='text-xl font-semibold text-base-content/80'>
              {message}
            </h2>
          </div>

          {/* Progress dots */}
          {showProgress && (
            <div className='flex justify-center gap-2 mb-6'>
              <div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
              <div
                className='w-2 h-2 bg-primary rounded-full animate-bounce'
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className='w-2 h-2 bg-primary rounded-full animate-bounce'
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          )}

          {/* Encouraging message */}
          <p className='text-sm text-base-content/60 max-w-md mx-auto'>
            We're fetching the best restaurant reviews for you. This won't take
            long!
          </p>
        </div>

        {/* Skeleton Cards */}
        <div className='space-y-6 max-w-4xl mx-auto'>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div
              key={index}
              className='animate-pulse'
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '2s',
              }}
            >
              <PostCardSkeleton />
            </div>
          ))}
        </div>

        {/* Fun loading tips */}
        <div className='text-center mt-12'>
          <div className='bg-base-200 rounded-lg p-4 max-w-md mx-auto'>
            <p className='text-sm text-base-content/70 italic'>
              {UI_TEXT.loading.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingState
