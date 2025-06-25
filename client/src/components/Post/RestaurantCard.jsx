import {
  Heart,
  Share,
  SendHorizontal,
  Check,
  CircleArrowRight,
  Users,
  MessageCircle,
} from 'lucide-react'
import { useState } from 'react'
import { postImage } from '../../utils/constants/posts'
import RatingBubble from './RatingBubble'
import { useNavigate } from 'react-router'

const RestaurantCard = ({
  id,
  image = postImage.default,
  user,
  restaurantName,
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
  // Local state for counts and status
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount)
  const [currentWantToGoCount, setCurrentWantToGoCount] =
    useState(wantToGoCount)
  const [liked, setLiked] = useState(isLiked)
  const [wantToGo, setWantToGo] = useState(isWantToGo)

  const navigate = useNavigate()

  const handleViewDetail = () => {
    navigate(`/post/${id}`)
  }

  const handleLikeToggle = () => {
    if (liked) {
      setCurrentLikeCount((prev) => prev - 1)
      setLiked(false)
    } else {
      setCurrentLikeCount((prev) => prev + 1)
      setLiked(true)
    }
  }

  const handleWantToGoToggle = () => {
    if (wantToGo) {
      setCurrentWantToGoCount((prev) => prev - 1)
      setWantToGo(false)
    } else {
      setCurrentWantToGoCount((prev) => prev + 1)
      setWantToGo(true)
    }
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
            alt={restaurantName}
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
            <h2 className='font-semibold text-gray-900'>{restaurantName}</h2>
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
        {/* Social Actions */}
        <div className='text-center'>
          {/* Like it? text */}
          <div className='text-gray-600 text-sm mb-4 divider'>Like it?</div>

          <div className='flex flex-col sm:flex-row-reverse sm:justify-around gap-2 sm:gap-4'>
            {/* Right side: Share and Like actions */}
            <div className='flex flex-col sm:my-auto gap-2'>
              {/* Top row badges */}
              <div className='flex justify-center gap-4'>
                <div className='flex flex-col items-center gap-2'>
                  <div className='badge badge-outline badge-success rounded-full badge-lg gap-2 px-4 py-3 shadow-md'>
                    <SendHorizontal className='w-4 h-4' />
                    <span className='font-medium'>{shareCount}</span>
                  </div>
                  <button className='btn btn-circle btn-outline btn-success shadow-lg hover:shadow-xl transition-shadow md:my-auto'>
                    <Share className='w-5 h-5' />
                  </button>
                </div>
                <div className='flex flex-col items-center gap-2'>
                  <div
                    className={`badge badge-lg rounded-full gap-2 px-4 py-3 cursor-pointer shadow-md ${
                      liked
                        ? 'badge-secondary'
                        : 'badge-outline badge-secondary'
                    }`}
                    onClick={handleLikeToggle}
                  >
                    <Heart
                      className={`w-4 h-4 ${liked ? 'fill-current' : ''}`}
                    />
                    <span className='font-medium'>{currentLikeCount}</span>
                  </div>
                  <button
                    onClick={handleLikeToggle}
                    className={`btn btn-circle shadow-lg hover:shadow-xl transition-shadow ${
                      liked ? 'btn-secondary' : 'btn-outline btn-secondary'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${liked ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Bottom row circular buttons */}
              <div className='flex justify-center gap-4'></div>
            </div>

            {/* Left side: Want to GO button with count */}
            <div className='flex flex-col items-center gap-2'>
              <div className='badge badge-info badge-lg rounded-full gap-2 px-4 py-3 shadow-md'>
                <Users className='w-4 h-4' />
                <span className='font-medium'>{currentWantToGoCount}</span>
              </div>
              <button
                onClick={handleWantToGoToggle}
                className={`btn btn-md md:btn-lg rounded-full text-lg-bold gap-2 ${
                  wantToGo
                    ? 'btn-warning text-white hover:bg-warning-focus'
                    : 'btn-primary text-white hover:bg-primary-focus'
                }`}
              >
                {wantToGo ? (
                  <>
                    <Check className='w-6 h-6' /> You are Going
                  </>
                ) : (
                  <>
                    <CircleArrowRight className='w-6 h-6' /> Want to GO
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard
