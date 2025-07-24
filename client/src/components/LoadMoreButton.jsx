import { UI_TEXT } from '../utils/constants/ui'

const LoadMoreButton = ({
  onClick,
  isLoading = false,
  hasMore = true,
  disabled = false,
  loadingText = UI_TEXT.buttons.loading,
  loadMoreText = UI_TEXT.buttons.loadMore,
  allLoadedText = UI_TEXT.buttons.allLoaded,
  className = '',
}) => {
  const isDisabled = disabled || isLoading || !hasMore

  const buttonText = isLoading
    ? loadingText
    : hasMore
      ? loadMoreText
      : allLoadedText

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-6 py-3 btn btn-outline btn-info ${className}`}
    >
      {buttonText}
    </button>
  )
}

export default LoadMoreButton
