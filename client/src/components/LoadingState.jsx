import { UI_TEXT } from '../utils/constants/ui'
import { getLoadingConfig } from '../utils/loadingConfig'
import { LoadingHeader, SkeletonCards, LoadingTips } from './LoadingComponents'

/*
 * LoadingState.jsx
 * Clean, configurable loading component with different types:
 * COMPONENT | DATA | SEARCH | MINIMAL | FULL
 */
const LoadingState = ({
  type = UI_TEXT.loadingTypes.DATA,
  skeletonCount,
  message,
  showProgress,
  className = '',
}) => {
  const config = getLoadingConfig(type, {
    skeletonCount,
    message,
    showProgress,
  })


  // Minimal type - just skeleton cards
  if (type === UI_TEXT.loadingTypes.MINIMAL) {
    return (
      <SkeletonCards
        count={config.skeletonCount}
        className={className}
      />
    )
  }

  return (
    <div className={config.containerClass}>
      <div className='container mx-auto px-4'>
        {config.showHeader && config.message && (
          <LoadingHeader
            message={config.message}
            showProgress={config.showProgress}
            showFullMessage={type === UI_TEXT.loadingTypes.FULL}
          />
        )}

        <SkeletonCards
          count={config.skeletonCount}
          className={className}
        />

        {config.showTips && <LoadingTips />}
      </div>
    </div>
  )
}

export default LoadingState
