import React from 'react'
import { Search } from 'lucide-react'
import RestaurantCard from '../Post/RestaurantCard'
import { generateRestaurantUrl } from '../../utils/slugUtils'
import LoadingState from '../LoadingState'
import ErrorMessage from '../ErrorMessage'
import LoadMoreSection from '../LoadMoreSection'
import AISearchSection from './AISearchSection'
import { UI_TEXT } from '../../utils/constants/ui'

const ExploreResults = ({
  hasActiveSearch,
  hasSearched,
  loading,
  error,
  posts,
  searchTerm,
  tags,
  location,
  onRetry,
  isLoadingMore,
  hasMoreResults,
  showLoadMoreButton,
  onLoadMore,
  searchType, // 'text' | 'tags' | 'none'
  onSearch, // Function to handle new searches
}) => {
  return (
    <div className='container mx-auto px-2 py-2 md:py-8'>
      {/* Initial state - no search yet */}
      {!hasActiveSearch && !hasSearched && (
        <div className='text-center py-10 md:py-20'>
          <Search className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-600 mb-2'>
            {UI_TEXT.explore.startExploringTitle}
          </h2>
          <p className='text-gray-500'>
            {UI_TEXT.explore.startExploringDescription}
          </p>
        </div>
      )}

      {/* Loading state with search context */}
      {loading && (
        <>
          <div className='text-center text-gray-600 mb-6'>
            {UI_TEXT.explore.searchingText} "
            {searchTerm || tags.join(', ') || location}"...
          </div>
          <LoadingState
            type={UI_TEXT.loadingTypes.SEARCH}
            skeletonCount={4}
          />
        </>
      )}

      {/* Error state */}
      {error && (
        <ErrorMessage
          error={error}
          onRetry={onRetry}
        />
      )}

      {/* Search results */}
      {hasSearched && !loading && !error && (
        <>
          {/* Search Summary */}
          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-900'>
              {posts.length} {UI_TEXT.explore.placesDiscovered}
              {searchTerm && (
                <span className='text-gray-600 font-normal'>
                  {' '}
                  {UI_TEXT.explore.searchFor} "{searchTerm}"
                </span>
              )}
            </h2>
            {(tags.length > 0 || location) && (
              <div className='mt-2 flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'
                  >
                    #{tag}
                  </span>
                ))}
                {location && (
                  <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                    📍 {location}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* No results found */}
          {posts.length === 0 ? (
            <div className='text-center py-12'>
              <Search className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <h2 className='text-xl font-semibold text-gray-600 mb-2'>
                {UI_TEXT.explore.noResultsTitle}
              </h2>
              <p className='text-gray-500 mb-6'>
                {searchTerm
                  ? `No results found for "${searchTerm}"`
                  : UI_TEXT.explore.noResultsDescription}
              </p>

              {/* AI Search Section */}
              <AISearchSection
                searchTerm={searchTerm}
                searchType={searchType}
                hasSearched={hasSearched}
                loading={loading}
                error={error}
                posts={posts}
                onSearch={onSearch}
              />
            </div>
          ) : (
            <>
              {/* Results list */}
              <div className='space-y-6'>
                {posts.map((post) => (
                  <RestaurantCard
                    key={post.id}
                    id={post.id}
                    image={post.imageUrls?.desktop || post.imageUrls}
                    user={{
                      name: post.author?.displayName,
                      avatar:
                        post.author?.photoURL ||
                        'https://img.daisyui.com/images/profile/demo/2@94.webp',
                    }}
                    location={post.location}
                    title={post.title}
                    placeName={post.placeName}
                    description={post.content}
                    date={new Date(post.createdAt).toLocaleDateString()}
                    tags={post.tags?.map((tag) => tag.name) || []}
                    rating={post.rating?.type}
                    likeCount={post.likeCount}
                    shareCount={post.shareCount || 0}
                    wantToGoCount={post.attendeeCount}
                    isWantToGo={post.isWantToGo}
                    isLiked={post.isLiked}
                    isOwner={post.isOwner || false}
                    className='max-w-full md:max-w-5/6 lg:max-w-3/4 mx-auto'
                    url={generateRestaurantUrl(post)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <LoadMoreSection
                currentCount={posts.length}
                onLoadMore={onLoadMore}
                isLoading={isLoadingMore}
                hasMore={hasMoreResults}
                showButton={showLoadMoreButton}
                countText='results'
                loadMoreText={UI_TEXT.buttons.loadMoreResults}
                allLoadedText={UI_TEXT.buttons.allResultsLoaded}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ExploreResults
