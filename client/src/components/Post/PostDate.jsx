import { Calendar } from "lucide-react"

const PostDate = ({ createdAt }) => {
  return (
    <div className="flex items-center justify-center mb-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">
          {new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  )
}

export default PostDate
