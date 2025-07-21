import { UI_TEXT } from '../utils/constants/ui'

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
  // Generate all responsive image URLs from base heroImage
  const getResponsiveImage = (suffix) => {
    if (!heroImage || typeof heroImage !== 'string') return heroImage
    
    // Handle different image naming patterns
    if (heroImage.includes('.webp')) {
      return heroImage.replace('.webp', `${suffix}.webp`)
    }
    
    // Fallback for other formats
    const extension = heroImage.split('.').pop()
    return heroImage.replace(`.${extension}`, `${suffix}.${extension}`)
  }

  const mobileImage = getResponsiveImage('_mobile')
  const mobile2xImage = getResponsiveImage('_mobile@2x') 
  const tabletImage = getResponsiveImage('_tablet')

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
          media='(max-width: 1024px)'
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
