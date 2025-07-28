import React from 'react'
import { Search, Sparkles, AlertCircle } from 'lucide-react'
import RestaurantCard from '../Post/RestaurantCard'
import { generateRestaurantUrl } from '../../utils/slugUtils'
import LoadingState from '../LoadingState'
import { useAISearch } from '../../hooks/search'
import { UI_TEXT } from '../../utils/constants/ui'

const AISearchSection = ({
  searchTerm,
  searchType,
  hasSearched,
  loading,
  error,
  posts,
  onSearch,
}) => {
  // Check if AI features are enabled via environment variable (default: false if not set)
  const envValue = import.meta.env.VITE_ENABLE_AI_SEARCH
  const isAIEnabled = envValue === 'true'

  // Debug logging
  /*  console.log('AI Environment Check:', { 
    envValue, 
    isAIEnabled, 
    envType: typeof envValue 
  }) */

  // Early return if AI is disabled
  if (!isAIEnabled) {
    // console.log('AI component hidden - environment variable not enabled')
    return null
  }
  // AI Search functionality
  const {
    loading: aiLoading,
    error: aiError,
    results: aiResults,
    hasSearched: aiHasSearched,
    message: aiSearchMessage,
    suggestions: aiSearchSuggestions,
    isBackendAvailable,
    performAISearch,
    clearResults: clearAIResults,
    hasResults: hasAIResults,
    isEmpty: aiIsEmpty,
  } = useAISearch()

  // Check if we should show AI Assistant button
  const shouldShowAIButton =
    isBackendAvailable && // Backend AI is available
    searchType === 'text' && // Only for text searches, not tag searches
    searchTerm &&
    searchTerm.trim().split(/\s+/).length >= 2 && // 2+ words
    hasSearched &&
    !loading &&
    !error &&
    posts.length === 0 && // No regular results
    !aiHasSearched // Haven't tried AI yet

  const handleAISearch = async () => {
    if (!searchTerm || aiLoading) return

    try {
      console.log(`Starting AI search for: "${searchTerm}"`)
      await performAISearch(searchTerm)
    } catch (error) {
      console.error('AI search failed:', error)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    if (onSearch) {
      clearAIResults() // Clear AI results when starting a new search
      onSearch(suggestion)
    }
  }

  // Clear AI results when new regular search happens
  React.useEffect(() => {
    if (hasSearched && !loading && aiHasSearched) {
      clearAIResults()
    }
  }, [searchTerm, hasSearched, loading, aiHasSearched, clearAIResults])

  return (
    <>
      {/* AI Assistant Button */}
      {shouldShowAIButton && (
        <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 max-w-md mx-auto border border-indigo-100'>
          <div className='text-center'>
            <div className='flex justify-center mb-3'>
              <div className='bg-indigo-100 p-3 rounded-full'>
                <Sparkles className='w-6 h-6 text-indigo-600' />
              </div>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              Try AI-Enhanced Search
            </h3>
            <p className='text-gray-600 text-sm mb-4'>
              Our AI can understand your query better and find hidden gems that
              match your craving!
            </p>
            <button
              onClick={handleAISearch}
              disabled={aiLoading}
              className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {aiLoading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Searching with AI...
                </>
              ) : (
                <>
                  <Sparkles className='w-4 h-4' />
                  Search with AI Assistant
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* AI Loading */}
      {aiLoading && (
        <div className='flex justify-center py-8'>
          <LoadingState type={UI_TEXT.loadingTypes.AI_SEARCH} />
        </div>
      )}

      {/* AI Error */}
      {aiError && (
        <div className='bg-red-50 rounded-lg p-4 max-w-md mx-auto'>
          <div className='flex items-center gap-2'>
            <AlertCircle className='w-5 h-5 text-red-500' />
            <p className='text-red-800 text-sm'>AI search failed: {aiError}</p>
          </div>
        </div>
      )}

      {/* AI Results */}
      {aiHasSearched && hasAIResults && (
        <div className='mt-8'>
          <div className='flex items-center justify-center gap-2 mb-6'>
            <Sparkles className='w-5 h-5 text-indigo-600' />
            <h3 className='text-lg font-semibold text-gray-800'>
              AI Enhanced Results ({aiResults.length})
            </h3>
          </div>
          <div className='space-y-6'>
            {aiResults.map((post) => (
              <RestaurantCard
                key={`ai-${post.id}`}
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
                className='max-w-full md:max-w-5/6 lg:max-w-3/4 mx-auto border-l-4 border-indigo-500'
                url={generateRestaurantUrl(post)}
              />
            ))}
          </div>
        </div>
      )}

      {/* AI No Results */}
      {aiIsEmpty && aiSearchMessage && (
        <div className='bg-blue-50 rounded-lg p-4 max-w-lg mx-auto'>
          <p className='text-blue-800 text-sm mb-2'>{aiSearchMessage}</p>
          {aiSearchSuggestions && aiSearchSuggestions.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-3'>
              <span className='text-blue-700 text-xs font-medium'>Try:</span>
              {aiSearchSuggestions.map((suggestion, index) => (
                <span
                  key={index}
                  className='bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-blue-200 transition-colors'
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default AISearchSection
