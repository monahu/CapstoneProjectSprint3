import React from 'react'
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

  // LCP optimization: Use preloaded mobile image immediately for fast LCP
  // Mobile image is always preloaded, so prioritize it for mobile devices
  const getOptimalImageUrl = () => {
    if (typeof window === 'undefined') return mobileImage
    const width = window.innerWidth
    
    // For LCP optimization, use preloaded mobile image on mobile
    if (width <= 768) {
      return mobileImage // Always use preloaded mobile image for fastest LCP
    } else if (width <= 1024) {
      return tabletImage
    } else {
      return heroImage
    }
  }

  const optimalImageUrl = !useColorBackground ? getOptimalImageUrl() : null

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Hero Debug:', {
      heroImage,
      mobileImage,
      mobile2xImage,
      tabletImage,
      optimalImageUrl,
      hasVariants: !!variants.mobile,
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'SSR',
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 'SSR'
    })
  }

  // Add LCP class for immediate mobile background
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const lcpClass = !useColorBackground && isMobile ? 'hero-lcp-mobile' : ''

  return (
    <div 
      className={`hero rounded-2xl relative overflow-hidden ${className} ${useColorBackground ? backgroundColor : ''} ${lcpClass}`}
      style={!useColorBackground && !isMobile ? {
        backgroundImage: `url(${optimalImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      {/* Content - needs to be on top */}
      {!useColorBackground && <div className='relative z-10 hero-overlay bg-opacity-20 rounded-2xl'></div>}
      <div className={`${useColorBackground ? '' : 'relative z-20'} hero-content text-neutral-content text-center py-6`}>
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