import { useState, useRef, useEffect } from 'react'

const ProgressiveImage = ({
  imageUrl,
  alt,
  className = 'w-full h-64 object-cover',
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(priority)
  const imgRef = useRef(null)

  // Check if it's a Cloudinary URL for optimization
  const isCloudinaryUrl = imageUrl?.includes('cloudinary.com')

  // Generate optimized Cloudinary URLs
  const getCloudinaryUrl = (transformations = '') => {
    if (!isCloudinaryUrl) return imageUrl
    return imageUrl.replace('/upload/', `/upload/${transformations}/`)
  }

  // Low quality placeholder for immediate display
  const placeholderUrl = isCloudinaryUrl
    ? getCloudinaryUrl('w_50,h_50,c_fill,f_webp,q_auto:low,e_blur:300')
    : null

  // Optimized URLs for different screen sizes
  const mobileUrl = isCloudinaryUrl
    ? getCloudinaryUrl('w_480,h_320,c_fill,f_webp,q_auto:eco')
    : imageUrl
  const mobileUrl2x = isCloudinaryUrl
    ? getCloudinaryUrl('w_750,h_500,c_fill,f_webp,q_auto:eco')
    : imageUrl
  const tabletUrl = isCloudinaryUrl
    ? getCloudinaryUrl('w_768,h_512,c_fill,f_webp,q_auto:good')
    : imageUrl
  const desktopUrl = isCloudinaryUrl
    ? getCloudinaryUrl('w_1024,h_683,c_fill,f_webp,q_auto:good')
    : imageUrl

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return // Skip observer if priority loading

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = (e) => {
    // Fallback to original URL if optimized version fails
    if (isCloudinaryUrl && e.target.src !== imageUrl) {
      e.target.src = imageUrl
    }
  }

  if (!isVisible) {
    return (
      <div
        ref={imgRef}
        className={`${className} bg-gray-200 animate-pulse`}
        style={{ minHeight: '256px' }}
      />
    )
  }

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {/* Placeholder for immediate display */}
      {placeholderUrl && !isLoaded && (
        <img
          src={placeholderUrl}
          alt=""
          className={`absolute inset-0 ${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        />
      )}
      
      {/* Main responsive image */}
      <picture className="w-full h-full">
        {/* Mobile 1x (standard displays) */}
        <source
          media="(max-width: 768px) and (-webkit-max-device-pixel-ratio: 1.5)"
          srcSet={mobileUrl}
          type="image/webp"
        />
        {/* Mobile 2x (retina displays) */}
        <source
          media="(max-width: 768px) and (-webkit-min-device-pixel-ratio: 1.5)"
          srcSet={mobileUrl2x}
          type="image/webp"
        />
        {/* Tablet */}
        <source
          media="(max-width: 1024px)"
          srcSet={tabletUrl}
          type="image/webp"
        />
        {/* Desktop */}
        <source
          media="(min-width: 1025px)"
          srcSet={desktopUrl}
          type="image/webp"
        />
        {/* Fallback */}
        <img
          src={isCloudinaryUrl ? getCloudinaryUrl('w_480,h_320,c_fill,q_auto:eco') : imageUrl}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
    </div>
  )
}

export default ProgressiveImage