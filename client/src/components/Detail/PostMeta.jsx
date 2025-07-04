import { RatingBubble } from "../Post"

const PostMeta = ({ author, rating, layout = "detail" }) => {
  if (layout === "card") {
    return (
      <div className="mb-3 flex justify-evenly align-center gap-3 sm:gap-6 flex-wrap md:flex-nowrap w-full">
        <div className="order-2 md:order-1 avatar w-fit flex-col items-center my-auto">
          <div className="w-12 md:w-16 rounded-full">
            <img
              src={author.photoURL || author.avatar}
              alt={author.displayName || author.name}
            />
          </div>
          <p className="text-sm text-base-content text-black font-medium">
            {author.displayName || author.name}
          </p>
        </div>
        <div className="order-3 w-fit my-auto">
          <RatingBubble rating={rating} />
        </div>
      </div>
    )
  }

  return (
    <div className="mb-3 px-2 lg:px-20 flex justify-center sm:justify-evenly md:justify-start align-center gap-6">
      <div className="order-2 md:order-1 avatar w-fit flex-col items-center my-auto">
        <div className="w-12 sm:w-13 md:w-14 rounded-full">
          <img
            src={author.photoURL}
            alt={author.displayName}
          />
        </div>
        <p className="text-sm text-base-content text-black font-medium">
          {author.displayName}
        </p>
      </div>
      <div className="order-3 w-fit my-auto">
        <RatingBubble rating={rating} />
      </div>
    </div>
  )
}

export default PostMeta
