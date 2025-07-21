import { postImage } from '../../utils/constants/posts'

const PostImage = ({
  imageUrl,
  alt,
  className = 'w-full h-64 object-cover',
  priority = false,
}) => {
  // Use default image if imageUrl is null/undefined
  const safeImageUrl = imageUrl || postImage.default
  return (
    <picture className='w-full h-full'>
      {/* Mobile */}
      <source
        media='(max-width: 768px)'
        srcSet={`${safeImageUrl.replace('.webp', '_mobile.webp')} 1x, ${safeImageUrl.replace('.webp', '_mobile@2x.webp')} 2x`}
      />
      {/* Tablet */}
      <source
        media='(max-width: 1024px)'
        srcSet={safeImageUrl.replace('.webp', '_tablet.webp')}
      />
      {/* Desktop - fallback */}
      <img
        src={safeImageUrl}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding='async'
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}

export default PostImage
