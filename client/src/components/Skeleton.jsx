// Reusable skeleton loading components

export const PostCardSkeleton = () => (
  <div className="card bg-base-100 shadow-xl animate-pulse">
    <div className="skeleton h-48 w-full rounded-t-2xl"></div>
    <div className="card-body">
      <div className="skeleton h-6 w-3/4 mb-2"></div>
      <div className="skeleton h-4 w-full mb-1"></div>
      <div className="skeleton h-4 w-5/6 mb-4"></div>
      <div className="flex gap-2">
        <div className="skeleton h-8 w-16"></div>
        <div className="skeleton h-8 w-20"></div>
      </div>
    </div>
  </div>
)

export const ImageSkeleton = () => (
  <div className="skeleton h-48 w-full rounded-t-2xl"></div>
)

export const PostGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <PostCardSkeleton key={index} />
    ))}
  </div>
)

export const ProfileSkeleton = () => (
  <div className="flex items-center gap-4 animate-pulse">
    <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
    <div className="flex flex-col gap-2 flex-1">
      <div className="skeleton h-4 w-32"></div>
      <div className="skeleton h-3 w-24"></div>
    </div>
  </div>
)

export const FormSkeleton = () => (
  <div className="w-full max-w-md space-y-4 animate-pulse">
    <div className="skeleton h-12 w-full"></div>
    <div className="skeleton h-12 w-full"></div>
    <div className="skeleton h-12 w-full"></div>
    <div className="skeleton h-10 w-full"></div>
  </div>
)
