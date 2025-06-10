import Hero from './Hero'
import heroImage from '../assets/img/restJam_hero1.webp'
import { useNavigate } from 'react-router'
import { UI_TEXT } from '../utils/constants/ui'

const Home = () => {
  const navigate = useNavigate()

  const handleNavigateToLogin = () => {
    navigate(UI_TEXT.hero.buttonLink)
  }

  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        onButtonClick={handleNavigateToLogin}
      />
      {/* {POSTS_DATA.map((post) => (
        <RestaurantCard
          key={post.id}
          {...post}
          className="mt-10 max-w-full md:max-w-5/6 lg:max-w-3/4"
        />
      ))} */}
    </div>
  )
}

export default Home
