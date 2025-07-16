import { useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { usePostActions } from '../../hooks/usePostActions'
import LoadingState from '../LoadingState'
import ErrorMessage from '../ErrorMessage'
import { PostImage, PostTags, PostActions } from '../Post'
import PostMeta from './PostMeta'
import PostHeader from './PostHeader'
import PostDate from './PostDate'
import AttendeesList from './AttendeesList'
import MapView from './MapView'
import RichTextDisplay from '../Post/RichTextDisplay'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const RestaurantDetail = ({ post, loading, error, className, refetch }) => {
  const { user } = useAuth();
  const navigate = useNavigate()
  // Enhanced debug statement to check user and post ownership
  console.log('RestaurantDetail debug:', {
    user,
    userUid: user?.uid,
    userFirebaseUid: user?.firebaseUid,
    post,
    postUserId: post?.userId,
    postAuthorId: post?.author?.id,
    postIsOwner: post?.isOwner
  });

  const postActions = usePostActions({
    postId: post?.id,
    initialLikeCount: post?.likeCount || 0,
    initialShareCount: post?.shareCount || 0,
    initialWantToGoCount: post?.attendeeCount || 0,
    initialIsLiked: post?.isLiked || false,
    initialIsWantToGo: post?.isWantToGo || false,
  })

  // Loading state - use shared component
  if (loading) {
    return <LoadingState skeletonCount={1} />
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
      <PostImage
        imageUrl={post.imageUrls?.desktop || post.imageUrl}
        alt={post.placeName}
      />

      {/* Content */}
      <div className='p-4 sm:p-6'>
        {/* Edit Button for post owner - relocated for visibility */}
        {(post.isOwner ||
          (user && (
            (post.userId && (user.uid === post.userId || user.firebaseUid === post.userId)) ||
            (post.author?.id && (user.uid === post.author.id || user.firebaseUid === post.author.id))
          ))
        ) && (
          <button
            className="btn btn-sm mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded shadow hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => navigate(`/edit/${post._id || post.id}`)}
          >
            Edit
          </button>
        )}
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

        <PostActions {...postActions} />

        {/* More Info Section */}
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

        <AttendeesList attendees={post.attendees} />

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
