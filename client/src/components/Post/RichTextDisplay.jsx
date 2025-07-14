import DOMPurify from 'dompurify'

const RichTextDisplay = ({
  content,
  className = '',
  maxLines = null,
  onViewMore = null,
}) => {
  if (!content) return null

  // Sanitize HTML to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content)

  const baseClasses = 'prose prose-sm max-w-none text-gray-800 leading-relaxed'
  const lineClampClass = maxLines
    ? `line-clamp-${maxLines - 1} md:line-clamp-${maxLines}`
    : ''
  const combinedClasses = `${baseClasses} ${className} ${lineClampClass}`.trim()

  return (
    <div className='rich-text-display'>
      <div
        className={combinedClasses}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      {maxLines && content.length > 200 && onViewMore && (
        <div className='text-center'>
          <button
            onClick={onViewMore}
            className='text-blue-600 text-sm font-medium mt-2 hover:text-indigo-700 transition-colors'
          >
            💙 <span className='underline'>View Detail</span> 💙
          </button>
        </div>
      )}
    </div>
  )
}

export default RichTextDisplay
