/*
 * ErrorMessage.jsx
 * This component displays an error message with an optional retry button.
 * It's used to inform users that there is an error and provide a way to retry the action.
 */
const ErrorMessage = ({ error, onRetry }) => {
  const getFriendlyErrorMessage = (error) => {
    if (!error) return 'Something went wrong'

    const errorMsg = error.message || ''

    if (errorMsg.includes('429') || errorMsg.includes('Too many requests')) {
      return 'Our servers are a bit busy right now. Please try again in a moment! 🕐'
    }

    if (errorMsg.includes('Network error') || errorMsg.includes('fetch')) {
      return "Can't connect to our servers right now. Please check your internet connection! 📡"
    }

    if (errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
      return 'You need to be logged in to see this content. 🔐'
    }

    if (errorMsg.includes('500')) {
      return "Something went wrong on our end. We're working to fix it! 🔧"
    }

    return "We're having trouble loading the latest posts. Please try refreshing the page! 🔄"
  }

  return (
    <div className='text-center py-20 px-4'>
      <div className='max-w-md mx-auto bg-error/10 border-l-4 border-error p-6 rounded-lg'>
        <div className='flex items-center mb-4'>
          <div className='text-error text-2xl mr-3'>⚠️</div>
          <h2 className='text-lg font-medium text-error'>Oops!</h2>
        </div>
        <p className='text-black-700 mb-4'>{getFriendlyErrorMessage(error)}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className='bg-warning text-gray-900 px-4 py-2 rounded hover:bg-warning/80 transition-colors'
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
