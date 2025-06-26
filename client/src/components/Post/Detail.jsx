import { useParams, useNavigate } from "react-router"
import { usePost } from "../../hooks/usePost"
import heroImage from "../../assets/img/restJam_hero1.webp"
import Hero from "../Hero"
import { PostCardSkeleton, ImageSkeleton } from "../Skeleton"
import RestaurantDetail from "./RestaurantDetail"

const Detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { post, loading, error } = usePost(id)

  if (loading) {
    return (
      <div className="min-h-screen">
        <ImageSkeleton />
        <div className="container mx-auto px-4 py-8 space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Hero
          heroImage={heroImage}
          showButton={false}
        />
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
        <Hero
          heroImage={heroImage}
          showButton={false}
        />
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
    <div className="min-h-screen">
      <Hero
        heroImage={heroImage}
        showButton={false}
        className="min-h-[30vh]"
      />
      <RestaurantDetail
        post={post}
        loading={loading}
        error={error}
        className="mt-10 max-w-full md:max-w-5/6"
      />
    </div>
  )
}

export default Detail
