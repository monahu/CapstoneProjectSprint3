import React from 'react'
import { UI_TEXT } from '../utils/constants/ui'
import { getOptimalHeroImage } from '../utils/heroImages'

const Hero = ({
  heroImage,
  useColorBackground = false,
  backgroundColor = 'bg-gradient-to-br from-blue-600 to-purple-700',
  title = UI_TEXT.hero.title,
  description = UI_TEXT.hero.description,
  buttonText = UI_TEXT.hero.button,
  onButtonClick,
  showButton = true,
  className = 'min-h-[40vh] max-h-[70vh]',
  contentClassName = '',
}) => {
  const optimalImageUrl = !useColorBackground
    ? getOptimalHeroImage(heroImage)
    : null
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const lcpClass = !useColorBackground && isMobile ? 'hero-lcp-mobile' : ''

  return (
    <div
      className={`hero rounded-2xl relative overflow-hidden ${className} ${useColorBackground ? backgroundColor : ''} ${lcpClass}`}
      style={
        !useColorBackground && !isMobile
          ? {
              backgroundImage: `url(${optimalImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : {}
      }
    >
      {!useColorBackground && (
        <div className='relative z-10 hero-overlay bg-opacity-20 rounded-2xl'></div>
      )}
      <div
        className={`${useColorBackground ? '' : 'relative z-20'} hero-content text-neutral-content text-center py-6`}
      >
        <div className={`max-w-md ${contentClassName}`}>
          <h1 className='mb-5 text-4xl md:text-5xl lg:text-6xl font-bold'>
            {title}
          </h1>
          <p className='mb-5 text-[1rem] md:text-[1.2rem]'>{description}</p>
          {showButton && (
            <button
              className='px-6 py-3 btn border-0 shadow-none bg-primary primary-hover rounded-md text-base-100 hover:text-base-300 text-lg md:btn-lg md:text-[1.2rem]  transition-all duration-300'
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
