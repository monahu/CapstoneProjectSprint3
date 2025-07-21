import { postImage } from '../../utils/constants/posts'
import SimpleImage from './SimpleImage'

const PostImage = ({
  imageUrl,
  alt,
  className = 'w-full h-64 object-cover',
  priority = false,
}) => {
  // Use default image if imageUrl is null/undefined
  const safeImageUrl = imageUrl || postImage.default
  
  return (
    <SimpleImage
      imageUrl={safeImageUrl}
      alt={alt}
      className={className}
      priority={priority}
    />
  )
}

export default PostImage
