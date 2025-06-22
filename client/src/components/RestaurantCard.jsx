import { Heart, Share, MessageCircle, Users } from 'lucide-react'
import { useState } from 'react'
import { postImage } from '../utils/constants/posts'
import RatingBubble from './Post/RatingBubble'

const RestaurantCard = ({
  image = postImage.default,
  user,
  restaurantName,
  description,
  date,
  tags = [],
  rating,
  likes = 0,
  comments = 0,
  wantToGoCount = 0,
  className = '',
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [wantToGo, setWantToGo] = useState(false)

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
        <div className=' mb-3 flex justify-evenly align-center w-full gap-6 flex-wrap md:flex-nowrap'>
          <div className='order-2 md:order-1 avatar w-fit flex-col items-center my-auto'>
            <div className='w-12 md:w-16 rounded-full'>
              <img
                src={user.avatar}
                alt={user.name}
              />
            </div>
            <p className='text-sm text-base-content text-black font-medium'>{user.name}</p>
          </div>
          <div className='order-1 md:order-2 w-full h-fit my-auto'>
            <p className='text-sm text-gray-600'>{user.location}</p>
            <h2 className='font-semibold text-gray-900'>{restaurantName}</h2>
          </div>

          <div className='order-3 w-fit my-auto'>
            <RatingBubble rating={rating} />
          </div>
        </div>

        {/* Description */}
        <p className='text-gray-800 text-sm mb-3 leading-relaxed'>
          {description}
        </p>

        {/* Date */}
        <p className='text-xs text-gray-600 mb-3'>{date}</p>

        {/* Tags */}
        <div className='flex gap-2 mb-4 flex-wrap'>
          {tags.map((tag, index) => (
            <span
              key={index}
              className='px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium'
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className='flex items-center justify-between flex-wrap md:flex-nowrap'>
          {/* Want to GO Button */}
          <button
            onClick={() => setWantToGo(!wantToGo)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              wantToGo
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Users className='w-4 h-4' />
            Want to GO
            {wantToGoCount > 0 && (
              <span className='bg-blue-800 text-white text-xs px-2 py-0.5 rounded-full'>
                {wantToGoCount}
              </span>
            )}
          </button>

          {/* Social Actions */}
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1 text-gray-600'>
              <MessageCircle className='w-4 h-4' />
              <span className='text-sm'>{comments}</span>
            </div>
            <div className='flex items-center gap-1 text-gray-600'>
              <Heart className='w-4 h-4' />
              <span className='text-sm'>{likes}</span>
            </div>
            <button
              className='p-2 text-gray-400 hover:text-gray-600'
              aria-label={`Share ${restaurantName}`}
            >
              <Share className='w-4 h-4' />
            </button>
            <button
              className='p-2 text-gray-400 hover:text-pink-500'
              aria-label={`Like ${restaurantName}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard
