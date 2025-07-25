import {
  Heart,
  Share,
  Users,
  Check,
  CircleArrowRight,
  SendHorizontal,
} from 'lucide-react'
import { useNavigate } from 'react-router'

const PostActions = ({
  currentLikeCount,
  currentShareCount,
  currentWantToGoCount,
  isLiked,
  isWantToGo,
  isLoggedIn,
  handleLikeToggle,
  handleWantToGoToggle,
  handleShareClick,
  isOwner = true,
}) => {
  const navigate = useNavigate()

  return (
    <div className='text-center'>
      {/* Like it? text */}
      <div className='text-gray-600 text-base mb-8 divider'>
        {isOwner ? (
          <div className='badge badge-soft badge-primary'>
            Your post is popular
          </div>
        ) : (
          'Like it?'
        )}
      </div>

      <div
        className='flex flex-col sm:flex-row-reverse justify-evenly md:justify-between gap-4 px-2 lg:px-20'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Right side: Share and Like actions */}
        <div className='flex flex-col sm:my-auto gap-2'>
          {/* Top row badges */}
          <div className='flex justify-center gap-4'>
            <div className='flex flex-col items-center gap-2'>
              <div className='badge badge-outline badge-success rounded-full badge-lg gap-2 px-4 py-3 shadow-md'>
                <SendHorizontal className='w-4 h-4' />
                <span className='font-medium'>{currentShareCount}</span>
              </div>
              {/* Share button - only show when logged in */}
              {isLoggedIn && (
                <button
                  onClick={handleShareClick}
                  className='btn btn-circle btn-outline btn-success shadow-lg hover:shadow-xl transition-shadow md:my-auto'
                  aria-label='Share this post'
                >
                  <Share className='w-5 h-5' />
                </button>
              )}
            </div>
            <div className='flex flex-col items-center gap-2'>
              <div
                className={`badge badge-lg rounded-full gap-2 px-4 py-3 cursor-pointer shadow-md ${
                  isLiked ? 'badge-secondary' : 'badge-outline badge-secondary'
                }`}
                onClick={handleLikeToggle}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className='font-medium'>{currentLikeCount}</span>
              </div>
              {/* Like button - only show when logged in */}
              {isLoggedIn && (
                <button
                  onClick={handleLikeToggle}
                  className={`btn btn-circle shadow-lg hover:shadow-xl transition-shadow ${
                    isLiked ? 'btn-secondary' : 'btn-outline btn-secondary'
                  }`}
                  aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Left side: Want to GO button with count */}
        <div className='flex flex-col items-center gap-2'>
          {/* Want to go badge - always show */}
          <div className='badge badge-info badge-lg rounded-full gap-2 px-4 py-3 shadow-md'>
            <Users className='w-4 h-4' />
            <span className='font-medium '>{currentWantToGoCount}</span>
          </div>
          {/* Want to go button */}
          <button
            onClick={handleWantToGoToggle}
            className={`btn btn-md md:btn-lg rounded-full text-lg-bold text-sm md:text-base lg:text-lg whitespace-nowrap gap-2 ${
              isLoggedIn && isWantToGo
                ? 'btn-warning text-white hover:bg-warning-focus'
                : 'btn-primary text-white hover:bg-primary-focus'
            }`}
          >
            {(() => {
              const showYouAreGoing = isLoggedIn && isWantToGo

              return showYouAreGoing ? (
                <>
                  <Check className='w-6 h-6' /> You are Going
                </>
              ) : (
                <>
                  <CircleArrowRight className='w-6 h-6' />
                  {isLoggedIn ? 'Want to GO' : 'Sign in to Join'}
                </>
              )
            })()}
          </button>
        </div>
      </div>

      {/* Login prompt for non-logged users */}
      {!isLoggedIn && (
        <div className='mt-4'>
          <p className='text-gray-500 text-xs'>
            <button
              onClick={() => navigate('/login')}
              className='text-blue-600 hover:text-blue-700 underline font-medium'
            >
              Sign in
            </button>{' '}
            to like posts and join activities
          </p>
        </div>
      )}
    </div>
  )
}

export default PostActions
