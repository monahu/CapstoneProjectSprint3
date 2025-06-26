import { MessageCircle } from 'lucide-react'
import { postImage } from '../../utils/constants/posts'
import RatingBubble from './RatingBubble'
import PostActions from './PostActions'
import { useNavigate } from 'react-router'
import { usePostActions } from '../../hooks/usePostActions'

const RestaurantCard = ({
  id,
  image = postImage.default,
  user,
  title,
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
  className = '',
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
  })

  const handleViewDetail = () => {
    navigate(`/post/${id}`)
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden mx-auto ${className}`}
    >
      {/* Restaurant Image */}
      <div className='relative'>
        <picture className='w-full h-full'>
          {/* Mobile */}
          <source
            media='(max-width: 768px)'
            srcSet={`${image.replace('.webp', '_mobile.webp')} 1x, ${image.replace('.webp', '_mobile@2x.webp')} 2x`}
          />
          {/* Tablet */}
          <source
            media='(max-width: 1024px)'
            srcSet={image.replace('.webp', '_tablet.webp')}
          />
          {/* Desktop - fallback */}
          <img
            src={image}
            alt={placeName}
            className='w-full h-64 object-cover'
            loading='lazy'
            decoding='async'
          />
        </picture>
      </div>

      {/* Content */}
      <div className='p-4 md:p-8'>
        {/* User Info & Like Button */}
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
            <p className='text-sm text-gray-600'>{user.location}</p>
            <h2 className='font-semibold text-3xl sm:text-2xl text-gray-900'>
              {title}
            </h2>
          </div>

          <div className='order-3 w-fit my-auto'>
            <RatingBubble rating={rating} />
          </div>
        </div>

        {/* Description */}
        <div className='mb-3 flex flex-col items-center'>
          <p className='text-gray-800 text-sm leading-relaxed line-clamp-3 md:line-clamp-2'>
            {description}
          </p>
          {description && description.length > 150 && (
            <button
              onClick={handleViewDetail}
              className='text-blue-600 text-sm font-medium mt-2 hover:text-blue-700 transition-colors mx-auto'
            >
              💙 <span className='underline'>View Detail</span> 💙
            </button>
          )}
        </div>

        {/* Date */}
        <p className='text-xs text-gray-600 mb-3'>{date}</p>

        {/* Tags */}
        <div className='flex gap-2 mb-4 flex-wrap'>
          {tags.map((tag, index) => (
            <span
              key={index}
              className='px-3 py-1 bg-primary text-white text-xs rounded-full font-medium'
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Post Actions Component */}
        <PostActions {...postActions} />
      </div>
    </div>
  )
}

export default RestaurantCard
