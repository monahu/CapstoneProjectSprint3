import React from 'react'
import { UI_TEXT } from '../utils/constants/ui'
import { getHeroImageVariants } from '../utils/heroImages'

const Hero = ({
  heroImage,
  useColorBackground = false,
  backgroundColor = 'bg-gradient-to-br from-blue-600 to-purple-700',
  title = UI_TEXT.hero.title,
  description = UI_TEXT.hero.description,
  buttonText = UI_TEXT.hero.button,
  onButtonClick,
  showButton = true,
  className = 'min-h-[40vh] max-h-[60vh] h-fit',
  contentClassName = '',
}) => {
  const imageVariants = !useColorBackground
    ? getHeroImageVariants(heroImage)
    : null

  const heroStyle =
    !useColorBackground && imageVariants
      ? {
          '--hero-bg-mobile': `url(${imageVariants.mobile})`,
          '--hero-bg-tablet': `url(${imageVariants.tablet})`,
          '--hero-bg-desktop': `url(${imageVariants.desktop})`,
          backgroundImage: `url(${imageVariants.mobile})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      : {}

  return (
    <>
      <div
        className={[
          'hero rounded-2xl relative overflow-hidden hero-responsive-bg',
          className,
          useColorBackground ? backgroundColor : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={heroStyle}
      >
        {!useColorBackground && (
          <div className='relative z-10 hero-overlay bg-opacity-20 rounded-2xl' />
        )}
        <div
          className={[
            useColorBackground ? '' : 'relative z-20',
            'hero-content text-neutral-content text-center py-6',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={`max-w-md ${contentClassName}`}>
            <h1 className='mb-5 text-3xl md:text-4xl lg:text-5xl font-bold'>
              {title}
            </h1>
            <p className='mb-5 text-[1rem] md:text-[1.2rem]'>{description}</p>
            {showButton && (
              <button
                className='px-6 py-3 btn border-0 shadow-none bg-primary primary-hover rounded-md text-base-100 hover:text-base-300 text-[0.9rem] md:btn-lg md:text-[1.2rem] transition-all duration-300'
                onClick={onButtonClick}
                aria-label={`${buttonText} - Get started with your account`}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
