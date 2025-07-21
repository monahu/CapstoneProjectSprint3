import { UI_TEXT } from '../utils/constants/ui'

// Import all hero image variants to ensure Vite includes them in the build
import restJamHero1 from '../assets/img/restJam_hero1.webp'
import restJamHero1Mobile from '../assets/img/restJam_hero1_mobile.webp'
import restJamHero1Mobile2x from '../assets/img/restJam_hero1_mobile@2x.webp'
import restJamHero1Tablet from '../assets/img/restJam_hero1_tablet.webp'

import createHero1 from '../assets/img/create_hero1.webp'
import createHero1Mobile from '../assets/img/create_hero1_mobile.webp'
import createHero1Mobile2x from '../assets/img/create_hero1_mobile@2x.webp'
import createHero1Tablet from '../assets/img/create_hero1_tablet.webp'

import detailHero1 from '../assets/img/detail_hero1.webp'
import detailHero1Mobile from '../assets/img/detail_hero1_mobile.webp'
import detailHero1Mobile2x from '../assets/img/detail_hero1_mobile@2x.webp'
import detailHero1Tablet from '../assets/img/detail_hero1_tablet.webp'

import exploreHero1 from '../assets/img/explore_hero1.webp'
import exploreHero1Mobile from '../assets/img/explore_hero1_mobile.webp'
import exploreHero1Mobile2x from '../assets/img/explore_hero1_mobile@2x.webp'
import exploreHero1Tablet from '../assets/img/explore_hero1_tablet.webp'

import loginHero1 from '../assets/img/login_hero1.webp'
import loginHero1Mobile from '../assets/img/login_hero1_mobile.webp'
import loginHero1Mobile2x from '../assets/img/login_hero1_mobile@2x.webp'
import loginHero1Tablet from '../assets/img/login_hero1_tablet.webp'

import profileHero1 from '../assets/img/profile_hero1.webp'
import profileHero1Mobile from '../assets/img/profile_hero1_mobile.webp'
import profileHero1Mobile2x from '../assets/img/profile_hero1_mobile@2x.webp'
import profileHero1Tablet from '../assets/img/profile_hero1_tablet.webp'

import resJamPost1 from '../assets/img/resJam_post_1.webp'
import resJamPost1Mobile from '../assets/img/resJam_post_1_mobile.webp'
import resJamPost1Mobile2x from '../assets/img/resJam_post_1_mobile@2x.webp'
import resJamPost1Tablet from '../assets/img/resJam_post_1_tablet.webp'

const Hero = ({
  heroImage,
  title = UI_TEXT.hero.title,
  description = UI_TEXT.hero.description,
  buttonText = UI_TEXT.hero.button,
  onButtonClick,
  showButton = true,
  className = 'min-h-[40vh]',
  contentClassName = '',
}) => {
  // Map of desktop images to their responsive variants
  const imageMap = {
    [restJamHero1]: {
      mobile: restJamHero1Mobile,
      mobile2x: restJamHero1Mobile2x,
      tablet: restJamHero1Tablet
    },
    [createHero1]: {
      mobile: createHero1Mobile,
      mobile2x: createHero1Mobile2x,
      tablet: createHero1Tablet
    },
    [detailHero1]: {
      mobile: detailHero1Mobile,
      mobile2x: detailHero1Mobile2x,
      tablet: detailHero1Tablet
    },
    [exploreHero1]: {
      mobile: exploreHero1Mobile,
      mobile2x: exploreHero1Mobile2x,
      tablet: exploreHero1Tablet
    },
    [loginHero1]: {
      mobile: loginHero1Mobile,
      mobile2x: loginHero1Mobile2x,
      tablet: loginHero1Tablet
    },
    [profileHero1]: {
      mobile: profileHero1Mobile,
      mobile2x: profileHero1Mobile2x,
      tablet: profileHero1Tablet
    },
    [resJamPost1]: {
      mobile: resJamPost1Mobile,
      mobile2x: resJamPost1Mobile2x,
      tablet: resJamPost1Tablet
    }
  }

  // Get responsive variants for the current hero image
  const variants = imageMap[heroImage] || {}
  const mobileImage = variants.mobile || heroImage
  const mobile2xImage = variants.mobile2x || heroImage
  const tabletImage = variants.tablet || heroImage

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Hero Debug:', {
      heroImage,
      mobileImage,
      mobile2xImage,
      tabletImage,
      hasVariants: !!variants.mobile
    })
  }

  return (
    <div className={`hero rounded-2xl relative overflow-hidden ${className}`}>
      {/* Background Image */}
      <picture className='absolute inset-0 w-full h-full'>
        {/* Mobile 1x (standard displays) */}
        <source
          media='(max-width: 768px) and (-webkit-max-device-pixel-ratio: 1.5)'
          srcSet={mobileImage}
          sizes='100vw'
          type='image/webp'
        />
        {/* Mobile 2x (retina displays) */}
        <source
          media='(max-width: 768px) and (-webkit-min-device-pixel-ratio: 1.5)'
          srcSet={mobile2xImage}
          sizes='100vw'
          type='image/webp'
        />
        {/* Tablet */}
        <source
          media='(min-width: 769px) and (max-width: 1024px)'
          srcSet={tabletImage}
          sizes='100vw'
          type='image/webp'
        />
        {/* Desktop */}
        <source
          media='(min-width: 1025px)'
          srcSet={heroImage}
          sizes='100vw'
          type='image/webp'
        />
        {/* Fallback */}
        <img
          src={mobileImage}
          alt='Hero background'
          className='w-full h-full object-cover rounded-2xl'
          loading='eager'
          fetchPriority='high'
          decoding='sync'
          onError={(e) => {
            console.error('Hero image failed to load:', e.target.src)
            // Fallback to desktop image if mobile fails
            if (e.target.src !== heroImage) {
              e.target.src = heroImage
            }
          }}
          onLoad={() => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Hero image loaded successfully')
            }
          }}
        />
      </picture>

      {/* Content - needs to be on top */}
      <div className='relative z-10 hero-overlay bg-opacity-20 rounded-2xl'></div>
      <div className='relative z-20 hero-content text-neutral-content text-center py-6'>
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
