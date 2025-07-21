import React from 'react'
import { UI_TEXT } from '../utils/constants/ui'

// Single mobile image import for fastest loading
import restJamHero1Mobile from '../assets/img/restJam_hero1_mobile.webp'

const Hero = ({
  heroImage,
  useColorBackground = false,
  backgroundColor = 'bg-gradient-to-br from-blue-600 to-purple-700',
  title = UI_TEXT.hero.title,
  description = UI_TEXT.hero.description,
  buttonText = UI_TEXT.hero.button,
  onButtonClick,
  showButton = true,
  className = 'min-h-[40vh]',
  contentClassName = '',
}) => {
  // Use mobile image for fastest rendering across all devices
  const fastImage = restJamHero1Mobile

  return (
    <div 
      className={`hero rounded-2xl relative overflow-hidden ${className} ${useColorBackground ? backgroundColor : ''}`}
      style={!useColorBackground ? {
        backgroundImage: `url(${fastImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {/* Content - optimized for speed */}
      {!useColorBackground && <div className='hero-overlay bg-opacity-20 rounded-2xl'></div>}
      <div className='hero-content text-neutral-content text-center py-6'>
        <div className={`max-w-md ${contentClassName}`}>
          <h1 className='mb-5 text-6xl font-bold'>{title}</h1>
          <p className='mb-5 text-[1.2rem]'>{description}</p>
          {showButton && (
            <button
              className='btn btn-primary text-lg md:btn-lg md:text-[1.2rem]'
              onClick={onButtonClick}
              aria-label={`${buttonText} - Get started with your account`}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hero