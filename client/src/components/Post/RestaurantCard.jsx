import { postImage } from '../../utils/constants/posts'
import RatingBubble from './RatingBubble'
import PostActions from './PostActions'
import PostImage from './PostImage'
import PostTags from './PostTags'
import RichTextDisplay from './RichTextDisplay'
import { useNavigate } from 'react-router'
import { usePostActions } from '../../hooks/usePostActions'
import ConfirmDialog from '../ConfirmDialog'

const RestaurantCard = ({
  id,
  image,
  user,
  title,
  location,
  placeName,
  description,
  date,
  tags = [],
  rating,
  likeCount = 0,
  shareCount = 0,
  wantToGoCount = 0,
  isWantToGo = false,
  isLiked = false,
  isOwner = false,
  className = '',
  priority = false,
  url, // New prop for the restaurant URL
}) => {
  const navigate = useNavigate()

  // Use the custom hook for post interactions
  const postActions = usePostActions({
    postId: id,
    initialLikeCount: likeCount,
    initialShareCount: shareCount,
    initialWantToGoCount: wantToGoCount,
    initialIsLiked: isLiked,
    initialIsWantToGo: isWantToGo,
    isOwner: isOwner || false,
    placeName: placeName, // Add placeName for URL generation
  })

  const handleViewDetail = () => {
    navigate(url)
  }

  // Prefer imageUrls.desktop if available, fallback to image, then default
  const mainImage = image?.desktop || image || postImage.default

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden mx-auto cursor-pointer hover:shadow-xl transition-shadow ${className}`}
      onClick={handleViewDetail}
    >
      {/* Restaurant Image */}
      <PostImage
        imageUrl={mainImage}
        alt={placeName}
        priority={priority}
      />

      {/* Content */}
      <div className='p-4 md:p-8'>
        {/* Author Info & Rating */}
        <div className=' mb-3 flex justify-evenly align-center w-full gap-3 sm:gap-6 flex-wrap md:flex-nowrap'>
          <div className='order-2 md:order-1 avatar w-fit flex-col items-center my-auto'>
            <div className='w-12 md:w-16 rounded-full'>
              <img
                src={user.avatar}
                alt={user.name}
              />
            </div>
            <p className='text-sm text-base-content text-black font-medium'>
              {user.name}
            </p>
          </div>
          <div className='order-1 text-center md:text-left md:order-2 w-full h-fit my-auto'>
            <p className='text-sm md:text-base text-gray-600'>{location}</p>
            <h2 className='font-semibold text-3xl md:text-4xl text-gray-900'>
              {title}
            </h2>
          </div>
          <div className='order-3 w-fit my-auto'>
            <RatingBubble rating={rating} />
          </div>
        </div>

        {/* Rich Text Description */}
        <div className='mb-3 flex flex-col items-center'>
          <div className='w-full'>
            <RichTextDisplay
              content={description}
              className='text-sm '
              maxLines={4}
              onViewMore={handleViewDetail}
            />
          </div>
        </div>

        {/* Date */}
        <p className='text-xs text-gray-600 mb-3'>{date}</p>

        <PostTags
          tags={tags}
          variant='card'
        />

        <PostActions {...postActions} />

        {/* Confirm Dialog for Share and other actions */}
        <ConfirmDialog {...postActions.confirmDialogProps} />
      </div>
    </div>
  )
}

export default RestaurantCard
