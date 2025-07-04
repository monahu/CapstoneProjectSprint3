import Hero from '../Hero'
import ExploreHeader from './ExploreHeader'
import ActiveFilters from './ActiveFilters'
import ExploreResults from './ExploreResults'
import { useExplore } from '../../hooks'
import heroImage from '../../assets/img/explore_hero1.webp'
import { UI_TEXT } from '../../utils/constants/ui'

const Explore = () => {
  const {
    // Search state
    searchTerm,
    tags,
    location,
    posts,
    loading,
    error,
    hasSearched,
    hasActiveSearch,

    // Tag management
    tagsToDisplay,
    hasMoreTags,
    showAllTags,
    setShowAllTags,

    // Actions
    navigate,
    clearAllFilters,
    handleTagClick,
    classNames,
  } = useExplore()

  return (
    <div className='min-h-screen'>
      <Hero
        heroImage={heroImage}
        showButton={false}
        title={UI_TEXT.exploreHero.title}
        description={UI_TEXT.exploreHero.description}
        className='h-[30vh]'
      />

      <ExploreHeader
        navigate={navigate}
        tagsToDisplay={tagsToDisplay}
        tags={tags}
        handleTagClick={handleTagClick}
        showAllTags={showAllTags}
        setShowAllTags={setShowAllTags}
        hasMoreTags={hasMoreTags}
        classNames={classNames}
      />

      <ActiveFilters
        hasActiveSearch={hasActiveSearch}
        searchTerm={searchTerm}
        tags={tags}
        location={location}
        clearAllFilters={clearAllFilters}
      />

      <ExploreResults
        hasActiveSearch={hasActiveSearch}
        hasSearched={hasSearched}
        loading={loading}
        error={error}
        posts={posts}
        searchTerm={searchTerm}
        tags={tags}
        location={location}
      />
    </div>
  )
}

export default Explore
