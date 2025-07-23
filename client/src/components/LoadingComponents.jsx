import { PostCardSkeleton } from './Skeleton'
import { UI_TEXT } from '../utils/constants/ui'

// Loading Spinner Component
export const LoadingSpinner = () => (
  <div className='relative'>
    <div className='w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin'></div>
    <div
      className='absolute inset-0 w-8 h-8 border-4 border-transparent border-r-secondary rounded-full animate-spin animate-reverse'
      style={{ animationDuration: '1.5s' }}
    ></div>
  </div>
)

// Progress Dots Component
export const ProgressDots = () => (
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
)

// Loading Header Component
export const LoadingHeader = ({ message, showProgress, showFullMessage }) => (
  <div className='text-center mb-8'>
    <div className='flex justify-center items-center gap-3 mb-4'>
      <LoadingSpinner />
      <h2 className='text-xl font-semibold text-base-content/80'>
        {message}
      </h2>
    </div>

    {showProgress && <ProgressDots />}

    {showFullMessage && (
      <p className='text-sm text-base-content/60 max-w-md mx-auto'>
        We're fetching the best restaurant reviews for you. This won't take long!
      </p>
    )}
  </div>
)

// Skeleton Cards Component
export const SkeletonCards = ({ count, className = '' }) => (
  <div className={`space-y-6 max-w-4xl mx-auto ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
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
)

// Loading Tips Component
export const LoadingTips = () => {
  const randomTip = UI_TEXT.loading.tips[Math.floor(Math.random() * UI_TEXT.loading.tips.length)]
  
  return (
    <div className='text-center mt-12'>
      <div className='bg-base-200 rounded-lg p-4 max-w-md mx-auto'>
        <p className='text-sm text-base-content/70 italic'>
          {randomTip}
        </p>
      </div>
    </div>
  )
}