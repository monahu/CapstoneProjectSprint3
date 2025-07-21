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
  return (
    <div className={`hero rounded-2xl relative overflow-hidden ${className}`}>
      {/* Background Image */}
      <picture className='absolute inset-0 w-full h-full'>
        <source
          media='(max-width: 768px)'
          srcSet={`${heroImage.replace('.webp', '_mobile.webp')} 1x, ${heroImage.replace('.webp', '_mobile@2x.webp')} 2x`}
          sizes='100vw'
          type='image/webp'
        />
        <source
          media='(max-width: 1024px)'
          srcSet={`${heroImage.replace('.webp', '_tablet.webp')}`}
          sizes='100vw'
          type='image/webp'
        />
        <source
          media='(min-width: 1025px)'
          srcSet={heroImage}
          sizes='100vw'
          type='image/webp'
        />
        <img
          src={heroImage}
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
