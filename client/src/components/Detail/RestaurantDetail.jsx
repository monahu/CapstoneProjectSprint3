import { useNavigate } from "react-router"
import { usePostActions } from "../../hooks/usePostActions"
import { PostCardSkeleton } from "../Skeleton"
import { PostImage, PostTags, PostActions } from "../Post"
import PostMeta from "./PostMeta"
import PostHeader from "./PostHeader"
import PostDate from "./PostDate"
import AttendeesList from "./AttendeesList"
import MapView from "./MapView"

const apiKey =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  "AIzaSyBVlQTh9Q_24hXDsANsF4cBLTQF5edIMTg"

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-8">
    <div className="max-w-2xl mx-auto">
      <PostCardSkeleton />
    </div>
  </div>
)

const ErrorState = ({ error, navigate }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
      <p className="text-gray-600 mb-6">
        {error?.message ||
          "The restaurant post you're looking for doesn't exist."}
      </p>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-primary"
      >
        Go Back
      </button>
    </div>
  </div>
)

const RestaurantDetail = ({ post, loading, error, className }) => {
  const navigate = useNavigate()

  const postActions = usePostActions({
    postId: post?.id,
    initialLikeCount: post?.likeCount || 0,
    initialShareCount: post?.shareCount || 0,
    initialWantToGoCount: post?.attendeeCount || 0,
    initialIsLiked: post?.isLiked || false,
    initialIsWantToGo: post?.isWantToGo || false,
  })

  if (loading) return <LoadingState />
  if (error || !post)
    return (
      <ErrorState
        error={error}
        navigate={navigate}
      />
    )

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden mx-auto cursor-pointer hover:shadow-xl transition-shadow ${className}`}
    >
      {/* Restaurant Image */}
      <PostImage
        imageUrl={post.imageUrl}
        alt={post.placeName}
      />

      {/* Content */}
      <div className="p-4 sm:p-6">
        <PostHeader
          title={post.title}
          location={post.location}
          placeName={post.placeName}
        />

        <PostTags tags={post.tags} />

        {/* Description */}
        <div className="mb-6 px-2 lg:px-20">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {post.content}
          </p>
        </div>

        <PostDate createdAt={post.createdAt} />

        <PostActions {...postActions} />

        {/* More Info Section */}
        <div className="mt-12">
          <div className="text-gray-600 text-base mb-4 divider">More Info</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 px-2 lg:px-20">
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
