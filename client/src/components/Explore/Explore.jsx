import Hero from '../Hero'
import ExploreHeader from './ExploreHeader'
import ExploreResults from './ExploreResults'
import { useExplore } from '../../hooks'
import heroImage from '../../assets/img/explore_hero1.webp'
import { UI_TEXT } from '../../utils/constants/ui'

const Explore = () => {
  const exploreData = useExplore()

  const handleRetry = () => {
    const {
      hasActiveSearch,
      searchType,
      searchPosts,
      searchTerm,
      tags,
      navigate,
    } = exploreData
    if (!hasActiveSearch) return

    if (searchType === 'text') {
      searchPosts(searchTerm)
    } else if (searchType === 'tags' && tags.length > 0) {
      const params = new URLSearchParams()
      params.set('tags', tags.join(','))
      navigate(`/explore?${params.toString()}`, { replace: true })
    }
  }

  const handleSearch = (searchTerm) => {
    if (searchTerm?.trim()) {
      exploreData.navigate(
        `/explore?q=${encodeURIComponent(searchTerm.trim())}`
      )
    }
  }

  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        showButton={false}
        title={UI_TEXT.exploreHero.title}
        description={UI_TEXT.exploreHero.description}
        className='min-h-[30vh] max-h-[60vh] h-fit'
      />

      <ExploreHeader
        {...exploreData}
        onSearch={handleSearch}
      />

      {/*       <ActiveFilters
        {...exploreData}
      /> */}

      <ExploreResults
        {...exploreData}
        onRetry={handleRetry}
        onSearch={exploreData.searchPosts}
        onLoadMore={exploreData.handleLoadMore}
      />
    </div>
  )
}

export default Explore
