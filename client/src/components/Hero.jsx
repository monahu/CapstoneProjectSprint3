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
    <div
      className={`hero rounded-2xl ${className}`}
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className={`hero-overlay rounded-2xl`}></div>
      <div className='hero-content text-neutral-content text-center py-6'>
        <div className={`max-w-md ${contentClassName} `}>
          <h1 className='mb-5 text-5xl font-bold'>{title}</h1>
          <p className='mb-5'>{description}</p>
          {showButton && (
            <button
              className='btn btn-primary'
              onClick={onButtonClick}
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
