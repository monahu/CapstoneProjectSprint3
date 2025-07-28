import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { usePostActions } from '../../hooks/usePostActions'
import LoadingState from '../LoadingState'
import ErrorMessage from '../ErrorMessage'
import { UI_TEXT } from '../../utils/constants/ui'
import { PostTags, PostActions } from '../Post'
import ImageGallery from '../Post/ImageGallery'
import PostMeta from './PostMeta'
import PostHeader from './PostHeader'
import PostDate from './PostDate'
import AttendeesList from './AttendeesList'
import MapView from './MapView'
import RichTextDisplay from '../Post/RichTextDisplay'
import PostManipulation from './PostManipulation'
import ConfirmDialog from '../ConfirmDialog'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const RestaurantDetail = ({ post, loading, error, className, refetch }) => {
  const navigate = useNavigate()
  const user = useSelector((store) => store.user.data)
  const isLoggedIn = !!user

  const postActions = usePostActions({
    postId: post?.id,
    initialLikeCount: post?.likeCount || 0,
    initialShareCount: post?.shareCount || 0,
    initialWantToGoCount: post?.attendeeCount || 0,
    initialIsLiked: post?.isLiked || false,
    initialIsWantToGo: post?.isWantToGo || false,
    isOwner: post?.isOwner || false,
    placeName: post?.placeName, // Pass placeName for URL generation
  })

  // Loading state - use shared component
  if (loading) {
    return (
      <LoadingState
        type={UI_TEXT.loadingTypes.MINIMAL}
        skeletonCount={1}
      />
    )
  }

  // Error state - use shared component
  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={refetch}
      />
    )
  }

  // No post found
  if (!post) {
    return (
      <ErrorMessage
        error={{
          message: "The restaurant post you're looking for doesn't exist.",
        }}
        onRetry={() => navigate(-1)}
      />
    )
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden mx-auto cursor-pointer hover:shadow-xl transition-shadow ${className}`}
    >
      {/* Restaurant Image */}
      <ImageGallery
        imageUrls={post.imageUrls || post.imageUrl}
        alt={post.placeName}
      />

      {/* Content */}
      <div className='p-4 sm:p-6'>
        <PostHeader
          title={post.title}
          location={post.location}
          placeName={post.placeName}
        />

        <PostTags tags={post.tags} />

        {/* Rich Text Content */}
        <div className='mb-6 px-2 lg:px-20'>
          <RichTextDisplay
            content={post.content}
            className='text-sm sm:text-base'
          />
        </div>

        <PostDate createdAt={post.createdAt} />

        {/* Only show post manipulation for logged-in users */}
        {isLoggedIn && (
          <PostManipulation
            isOwner={post.isOwner || false}
            postId={post._id || post.id}
            navigate={navigate}
          />
        )}

        <PostActions {...postActions} />

        {/* Confirm Dialog for Share and other actions */}
        <ConfirmDialog {...postActions.confirmDialogProps} />

        {/* Call-to-Action for Visitors */}
        {!isLoggedIn && (
          <div className='mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200'>
            <h3 className='text-xl font-semibold text-gray-900 mb-3 text-center'>
              Join RestJAM to Connect with Food Lovers!
            </h3>
            <p className='text-gray-600 text-center mb-4'>
              Sign up to like posts, join restaurant visits, and share your own
              food experiences.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <button
                onClick={() => navigate('/login')}
                className='btn btn-primary text-white px-6 py-2 rounded-lg hover:bg-primary-focus transition-colors'
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className='btn btn-outline btn-primary px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors'
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* More Info Section - Always show basic info */}
        <div className='mt-12'>
          <div className='text-gray-600 text-base mb-4 divider'>More Info</div>
          <h3 className='text-lg font-semibold text-gray-900 mb-3 px-2 lg:px-20'>
            Poster
          </h3>
          <PostMeta
            author={post.author}
            rating={post.rating?.type}
          />
        </div>

        {/* Only show attendees for logged-in users */}
        {isLoggedIn && <AttendeesList attendees={post.attendees} />}

        {/* Attendees teaser for visitors */}
        {!isLoggedIn && post.attendees && post.attendees.length > 0 && (
          <div className='mt-6 px-2 lg:px-20'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              {post.attendees.length}{' '}
              {post.attendees.length === 1 ? 'Person' : 'People'} Want to Go
            </h3>
            <div className='p-4 bg-gray-50 rounded-lg text-center'>
              <p className='text-gray-600 mb-3'>
                See who else is interested in this restaurant
              </p>
              <button
                onClick={() => navigate('/login')}
                className='btn btn-sm btn-primary text-white'
              >
                Sign In to View
              </button>
            </div>
          </div>
        )}

        <MapView
          placeName={post.placeName}
          location={post.location}
          apiKey={apiKey}
        />
      </div>
    </div>
  )
}

export default RestaurantDetail
