const PostTags = ({ tags, variant = "detail" }) => {
  if (!tags || tags.length === 0) return null

  const tagClasses = variant === "card" ? " text-xs" : " text-base "

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`px-3 py-1 bg-primary rounded-full font-medium text-white ${tagClasses}`}
        >
          {tag.name || tag}
        </span>
      ))}
    </div>
  )
}

export default PostTags
