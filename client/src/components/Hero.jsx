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
  className = 'min-h-[40vh]',
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
