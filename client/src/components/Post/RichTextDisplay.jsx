import DOMPurify from "dompurify"

const RichTextDisplay = ({
  content,
  className = "",
  maxLines = null,
  onViewMore = null,
}) => {
  if (!content) return null

  // Sanitize HTML to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content)

  const baseClasses = "prose prose-sm max-w-none text-gray-700 leading-relaxed"
  const lineClampClass = maxLines ? `line-clamp-${maxLines}` : ""
  const combinedClasses = `${baseClasses} ${lineClampClass} ${className}`.trim()

  return (
    <div className="rich-text-display">
      <div
        className={combinedClasses}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      {maxLines && content.length > 200 && onViewMore && (
        <button
          onClick={onViewMore}
          className="text-blue-600 text-sm font-medium mt-2 hover:text-indigo-700 transition-colors"
        >
          💙 <span className="underline">View Detail</span> 💙
        </button>
      )}
    </div>
  )
}

export default RichTextDisplay
