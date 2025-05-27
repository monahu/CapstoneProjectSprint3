import heroImage from '../assets/img/restJam_hero1.webp'
const Hero = () => {
  return (
    <div
      className='hero min-h-2/3'
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className='hero-overlay'></div>
      <div className='hero-content text-neutral-content text-center py-6 '>
        <div className='max-w-md'>
          <h1 className='mb-5 text-5xl font-bold'>Hello there</h1>
          <p className='mb-5'>
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <button className='btn btn-primary'>Get Started</button>
        </div>
      </div>
    </div>
  )
}

export default Hero
