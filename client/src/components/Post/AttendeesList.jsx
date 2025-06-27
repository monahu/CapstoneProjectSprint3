const AttendeesList = ({ attendees }) => {
  if (!attendees || attendees.length === 0) return null

  return (
    <div className="my-6 px-2 lg:px-20">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendees</h3>
      <div className="avatar-group -space-x-6">
        {/* Show first 3 attendees */}
        {attendees.slice(0, 3).map((attendee, index) => (
          <div
            key={index}
            className="avatar"
          >
            <div className="w-12">
              <img
                src={
                  attendee.photoURL ||
                  "https://img.daisyui.com/images/profile/demo/3@94.webp"
                }
                alt={attendee.displayName || `User ${index + 1}`}
              />
            </div>
          </div>
        ))}

        {/* Show count if more than 3 attendees */}
        {attendees.length > 3 && (
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-12">
              <span>+{attendees.length - 3}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendeesList
