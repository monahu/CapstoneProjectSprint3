import { useNavigate } from "react-router"
import { MapPin, Utensils, Calendar } from "lucide-react"
import { usePostActions } from "../../hooks/usePostActions"
import { PostCardSkeleton } from "../Skeleton"
import PostActions from "./PostActions"
import RatingBubble from "./RatingBubble"

const apiKey =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  "AIzaSyBVlQTh9Q_24hXDsANsF4cBLTQF5edIMTg"

const RestaurantDetail = ({ post, loading, error, className }) => {
  // API key loaded successfully
  const navigate = useNavigate()

  const postActions = usePostActions({
    postId: post.id,
    initialLikeCount: post?.likeCount || 0,
    initialShareCount: post?.shareCount || 0,
    initialWantToGoCount: post?.attendeeCount || 0,
    initialIsLiked: post?.isLiked || false,
    initialIsWantToGo: post?.isWantToGo || false,
  })

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <PostCardSkeleton />
        </div>
      </div>
    )

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The restaurant post you're looking for doesn't exist.
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
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden mx-auto cursor-pointer hover:shadow-xl transition-shadow ${className}`}
    >
      {/* Restaurant Image */}
      <div className="">
        <picture className="w-full h-full">
          {/* Mobile */}
          <source
            media="(max-width: 768px)"
            srcSet={`${post.imageUrl.replace(".webp", "_mobile.webp")} 1x, ${post.imageUrl.replace(".webp", "_mobile@2x.webp")} 2x`}
          />
          {/* Tablet */}
          <source
            media="(max-width: 1024px)"
            srcSet={post.imageUrl.replace(".webp", "_tablet.webp")}
          />
          {/* Desktop - fallback */}
          <img
            src={post.imageUrl}
            alt={post.placeName}
            className="w-full h-64 object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      {/* Content */}
      <div className="">
        <div className="p-4 sm:p-6">
          {/* Restaurant Name */}
          <div className="flex items-center gap-3 mb-4">
            <Utensils className="w-6 h-6 text-gray-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {post.title}
            </h1>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags &&
              post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium"
                >
                  {tag.name}
                </span>
              ))}
          </div>

          {/* Location & Date */}
          <div className="flex items-center gap-1 text-blue-600 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>
              {post.location} - {post.placeName}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {post.content}
            </p>
          </div>

          {/* Beautiful date display */}
          <div className="flex items-center justify-center mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Post Actions */}
          <PostActions {...postActions} />

          {/* Poster and rating */}
          <div className="mt-12">
            {/* more info text */}
            <div className="text-gray-600 text-base mb-4 divider">
              More Info
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Poster</h3>
            <div className=" mb-3 flex justify-center sm:justify-evenly md:justify-start align-center w-full gap-6 ">
              <div className="order-2 md:order-1 avatar w-fit flex-col items-center my-auto">
                <div className="w-12 sm:w-13 md:w-14 rounded-full">
                  <img
                    src={post.author.photoURL}
                    alt={post.author.displayName}
                  />
                </div>
                <p className="text-sm text-base-content text-black font-medium">
                  {post.author.displayName}
                </p>
              </div>

              <div className="order-3 w-fit my-auto">
                <RatingBubble rating={post.rating?.type} />
              </div>
            </div>
          </div>

          {/* Attendees */}
          {post.attendees && post.attendees.length > 0 && (
            <div className="my-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Attendees
              </h3>
              <div className="avatar-group -space-x-6">
                {/* Show first 3 attendees */}
                {post.attendees.slice(0, 3).map((attendee, index) => (
                  <div
                    key={index}
                    className="avatar"
                  >
                    <div className="w-12">
                      <img
                        src={
                          attendee.photoURL ||
                          "https://img.daisyui.com/images/profile/demo/3@94.webp"
                        }
                        alt={attendee.displayName || `User ${index + 1}`}
                      />
                    </div>
                  </div>
                ))}

                {/* Show count if more than 3 attendees */}
                {post.attendees.length > 3 && (
                  <div className="avatar avatar-placeholder">
                    <div className="bg-neutral text-neutral-content w-12">
                      <span>+{post.attendees.length - 3}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Address
            </h3>
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{post.placeName}</span>
            </div>

            {/* Dynamic Map */}
            <div className="relative overflow-hidden rounded-lg shadow-md">
              {!apiKey ? (
                // Fallback when no API key
                <div className="w-full h-40 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-500 mb-2" />
                  <div className="text-center">
                    <p className="font-medium text-gray-700">
                      {post.placeName}
                    </p>
                    <p className="text-sm text-gray-500">{post.location}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Map API key not configured
                    </p>
                  </div>
                </div>
              ) : (
                <iframe
                  width="100%"
                  height="160"
                  className="rounded-lg shadow-md"
                  src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(post.location + " " + post.placeName)}&zoom=15`}
                  allowFullScreen
                />
              )}

              {/* Map overlay controls (like Google Maps) */}
              <div className="absolute top-2 left-2 bg-white rounded shadow-md overflow-hidden text-xs">
                <button className="px-3 py-1 bg-white text-gray-700 border-r border-gray-200 hover:bg-gray-50">
                  Map
                </button>
                <button className="px-3 py-1 bg-white text-gray-700 hover:bg-gray-50">
                  Satellite
                </button>
              </div>

              {/* Google attribution */}
              <div className="absolute bottom-1 right-1 bg-white/80 px-1 text-xs text-gray-600 rounded">
                Google
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetail
