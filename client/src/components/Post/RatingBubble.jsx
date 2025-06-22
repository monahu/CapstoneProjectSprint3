import { RATING_MAP, ICON_MAP } from '../../utils/constants/ratings'

const RatingBubble = ({ rating }) => {
  return (
    <div className='chat chat-start inline-block'>
      <div
        className={`chat-bubble p-2 md:p-4 rounded-2xl ms-auto ${RATING_MAP[rating].color}`}
      >
        <div className='grid grid-cols-[1fr_1fr_2px] items-center align-center gap-x-1 md:gap-x-2'>
          {RATING_MAP[rating].icon.map((icon) => {
            // Check if it's an emoji (string) or icon component
            if (typeof icon === 'string' && /\p{Emoji}/u.test(icon)) {
              return (
                <div
                  className='w-full'
                  key={icon}
                >
                  <span
                    key={icon}
                    className='text-xl md:text-3xl p-0 m-0 '
                  >
                    {icon}
                  </span>
                </div>
              )
            }

            const IconComponent = ICON_MAP[icon]
            return (
              <IconComponent
                key={icon}
                className='h-5 w-5 md:h-8 md:w-8 text-white'
              />
            )
          })}
        </div>
        <span className='hidden'>{RATING_MAP[rating].text}</span>
      </div>
    </div>
  )
}

export default RatingBubble
