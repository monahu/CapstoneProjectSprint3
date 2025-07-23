import { useState } from 'react'

const AttendeesList = ({ attendees }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!attendees || attendees.length === 0) return null

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className='my-6 px-2 lg:px-20'>
      <h3 className='text-lg font-semibold text-gray-900 mb-3'>Attendees</h3>

      {!isExpanded ? (
        <div
          className='avatar-group -space-x-6 cursor-pointer'
          onClick={toggleExpanded}
        >
          {/* Show first 3 attendees */}
          {attendees.slice(0, 3).map((attendee, index) => (
            <div
              key={index}
              className='avatar'
            >
              <div className='w-12'>
                <img
                  src={
                    attendee.photoURL ||
                    'https://img.daisyui.com/images/profile/demo/3@94.webp'
                  }
                  alt={attendee.displayName || `User ${index + 1}`}
                />
              </div>
            </div>
          ))}

          {/* Show count if more than 3 attendees */}
          {attendees.length > 3 && (
            <div className='avatar avatar-placeholder'>
              <div className='bg-neutral text-neutral-content w-12'>
                <span>+{attendees.length - 3}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className='flex flex-wrap gap-4'>
            {attendees.map((attendee, index) => (
              <div
                key={index}
                className='flex flex-col items-center text-center '
              >
                <div className='avatar'>
                  <div className='w-12 rounded-full'>
                    <img
                      src={
                        attendee.photoURL ||
                        'https://img.daisyui.com/images/profile/demo/3@94.webp'
                      }
                      alt={attendee.displayName || `User ${index + 1}`}
                    />
                  </div>
                </div>

                <span className='text-sm text-gray-700 font-medium'>
                  {attendee.displayName || `User ${index + 1}`}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={toggleExpanded}
            className='mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium'
          >
            Show less
          </button>
        </div>
      )}
    </div>
  )
}

export default AttendeesList
