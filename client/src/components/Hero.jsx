import heroImage from '../assets/img/restJam_hero1.webp'
import { UI_TEXT } from '../utils/constants/ui'

const Hero = () => {
  return (
    <div
      className='hero min-h-2/3 rounded-2xl'
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className='hero-overlay rounded-2xl'></div>
      <div className='hero-content text-neutral-content text-center py-6'>
        <div className='max-w-md'>
          <h1 className='mb-5 text-5xl font-bold'>{UI_TEXT.hero.title}</h1>
          <p className='mb-5'>{UI_TEXT.hero.description}</p>
          <button className='btn btn-primary'>{UI_TEXT.hero.button}</button>
        </div>
      </div>
    </div>
  )
}

export default Hero
