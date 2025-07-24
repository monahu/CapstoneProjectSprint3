import LoadMoreButton from './LoadMoreButton'

const LoadMoreSection = ({
  currentCount,
  totalCount,
  onLoadMore,
  isLoading = false,
  hasMore = true,
  showButton = true,
  countText = 'items',
  loadMoreText,
  loadingText,
  allLoadedText,
}) => {
  if (!showButton) return null

  return (
    <div className='mt-10 flex flex-col items-center space-y-4'>
      <div className='text-gray-600 text-sm'>
        Showing {currentCount}
        {totalCount && `/${totalCount}`} {countText}
      </div>
      
      <LoadMoreButton
        onClick={onLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        loadMoreText={loadMoreText}
        loadingText={loadingText}
        allLoadedText={allLoadedText}
      />
    </div>
  )
}

export default LoadMoreSection