import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import PostImage from './PostImage'

const ImageGallery = ({ 
  imageUrls, 
  alt, 
  className = 'w-full h-64 object-cover',
  priority = false 
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // For now, just show the single best quality image in gallery
  // TODO: In the future, this could show multiple different photos of the restaurant
  const slides = []
  const mainImageUrl = imageUrls?.desktop || imageUrls
  if (mainImageUrl) {
    slides.push({ src: mainImageUrl })
  }

  const handleImageClick = () => {
    setCurrentIndex(0)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="cursor-pointer" onClick={handleImageClick}>
        <PostImage
          imageUrl={imageUrls?.desktop || imageUrls}
          alt={alt}
          className={className}
          priority={priority}
        />
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={currentIndex}
        carousel={{
          finite: slides.length <= 1, // Disable infinite loop for single image
        }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined, // Hide prev button for single image
          buttonNext: slides.length <= 1 ? () => null : undefined, // Hide next button for single image
        }}
        controller={{
          closeOnBackdropClick: true, // Close when clicking outside image
          closeOnPullDown: true, // Close on mobile pull down gesture
          closeOnPullUp: true, // Close on mobile pull up gesture
        }}
        on={{
          click: ({ index }) => setCurrentIndex(index),
        }}
      />
    </>
  )
}

export default ImageGallery