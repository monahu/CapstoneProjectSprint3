import { Utensils, MapPin } from "lucide-react"

const PostHeader = ({ title, location, placeName }) => {
  return (
    <>
      {/* Restaurant Name */}
      <div className="flex items-center gap-3 mb-4">
        <Utensils className="w-6 h-6 text-gray-600" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h1>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-blue-600 text-sm mb-4">
        <MapPin className="w-4 h-4" />
        <span>
          {location} - {placeName}
        </span>
      </div>
    </>
  )
}

export default PostHeader
