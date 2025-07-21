// Import responsive variants for each hero image
import restJamHero1 from '../assets/img/restJam_hero1.webp'
import restJamHero1Mobile from '../assets/img/restJam_hero1_mobile.webp'
import restJamHero1Tablet from '../assets/img/restJam_hero1_tablet.webp'

import createHero1 from '../assets/img/create_hero1.webp'
import createHero1Mobile from '../assets/img/create_hero1_mobile.webp'
import createHero1Tablet from '../assets/img/create_hero1_tablet.webp'

import detailHero1 from '../assets/img/detail_hero1.webp'
import detailHero1Mobile from '../assets/img/detail_hero1_mobile.webp'
import detailHero1Tablet from '../assets/img/detail_hero1_tablet.webp'

import exploreHero1 from '../assets/img/explore_hero1.webp'
import exploreHero1Mobile from '../assets/img/explore_hero1_mobile.webp'
import exploreHero1Tablet from '../assets/img/explore_hero1_tablet.webp'

import loginHero1 from '../assets/img/login_hero1.webp'
import loginHero1Mobile from '../assets/img/login_hero1_mobile.webp'
import loginHero1Tablet from '../assets/img/login_hero1_tablet.webp'

import profileHero1 from '../assets/img/profile_hero1.webp'
import profileHero1Mobile from '../assets/img/profile_hero1_mobile.webp'
import profileHero1Tablet from '../assets/img/profile_hero1_tablet.webp'

import resJamPost1 from '../assets/img/resJam_post_1.webp'
import resJamPost1Mobile from '../assets/img/resJam_post_1_mobile.webp'
import resJamPost1Tablet from '../assets/img/resJam_post_1_tablet.webp'

// Export individual images for direct import
export {
  restJamHero1,
  createHero1,
  detailHero1,
  exploreHero1,
  loginHero1,
  profileHero1,
  resJamPost1,
}

// Image variants mapping
const imageVariants = {
  [restJamHero1]: { mobile: restJamHero1Mobile, tablet: restJamHero1Tablet },
  [createHero1]: { mobile: createHero1Mobile, tablet: createHero1Tablet },
  [detailHero1]: { mobile: detailHero1Mobile, tablet: detailHero1Tablet },
  [exploreHero1]: { mobile: exploreHero1Mobile, tablet: exploreHero1Tablet },
  [loginHero1]: { mobile: loginHero1Mobile, tablet: loginHero1Tablet },
  [profileHero1]: { mobile: profileHero1Mobile, tablet: profileHero1Tablet },
  [resJamPost1]: { mobile: resJamPost1Mobile, tablet: resJamPost1Tablet },
}

/**
 * Get optimal image variant based on viewport width
 * @param {string} heroImage - The base hero image URL
 * @returns {string} - Optimal image URL for current viewport
 */
export const getOptimalHeroImage = (heroImage) => {
  if (typeof window === 'undefined') {
    return imageVariants[heroImage]?.mobile || heroImage
  }

  const width = window.innerWidth
  const variants = imageVariants[heroImage]

  if (width <= 768) {
    return variants?.mobile || heroImage
  } else if (width <= 1024) {
    return variants?.tablet || heroImage
  } else {
    return heroImage
  }
}

/**
 * Get all variants for a given hero image
 * @param {string} heroImage - The base hero image URL
 * @returns {object} - Object containing mobile, tablet, and desktop variants
 */
export const getHeroImageVariants = (heroImage) => {
  const variants = imageVariants[heroImage]
  return {
    desktop: heroImage,
    tablet: variants?.tablet || heroImage,
    mobile: variants?.mobile || heroImage,
  }
}
