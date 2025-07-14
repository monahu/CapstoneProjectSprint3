/*
 * EmptyState.jsx
 * This component displays an empty state message with an optional action button.
 * It's used to inform users that there are no posts yet and encourage them to share their experiences.
 */
const EmptyState = ({ onAction, actionText = 'Share Your Experience' }) => {
  return (
    <div className='text-center py-20 px-4'>
      <div className='max-w-md mx-auto bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg'>
        <div className='text-blue-400 text-4xl mb-4'>🍽️</div>
        <h3 className='text-lg font-medium text-blue-800 mb-2'>
          No Posts Yet!
        </h3>
        <p className='text-blue-700 mb-4'>
          Be the first to share your amazing restaurant experience with the
          community!
        </p>
        {onAction && (
          <button
            onClick={onAction}
            className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors'
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  )
}

export default EmptyState
