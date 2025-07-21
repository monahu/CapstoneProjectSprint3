const SimpleImage = ({
  imageUrl,
  alt,
  className = 'w-full h-64 object-cover',
  priority = false,
}) => {
  // Check if it's a Cloudinary URL for optimization
  const isCloudinaryUrl = imageUrl?.includes('cloudinary.com')

  // Generate optimized Cloudinary URLs
  const getCloudinaryUrl = (transformations = '') => {
    if (!isCloudinaryUrl) return imageUrl
    return imageUrl.replace('/upload/', `/upload/${transformations}/`)
  }

  // Generate srcset for responsive images
  const srcSet = isCloudinaryUrl ? [
    `${getCloudinaryUrl('w_390,h_260,c_fill,f_webp,q_auto:eco')} 390w`,
    `${getCloudinaryUrl('w_780,h_520,c_fill,f_webp,q_auto:eco')} 780w`,
    `${getCloudinaryUrl('w_768,h_512,c_fill,f_webp,q_auto:good')} 768w`,
    `${getCloudinaryUrl('w_1024,h_683,c_fill,f_webp,q_auto:good')} 1024w`
  ].join(', ') : undefined

  return (
    <img
      src={isCloudinaryUrl ? getCloudinaryUrl('w_390,h_260,c_fill,f_webp,q_auto:eco') : imageUrl}
      srcSet={srcSet}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={(e) => {
        // Fallback to original URL if optimized version fails
        if (isCloudinaryUrl && e.target.src !== imageUrl) {
          e.target.src = imageUrl
        }
      }}
    />
  )
}

export default SimpleImage