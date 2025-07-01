import { ArrowLeft } from "lucide-react"
import { UI_TEXT } from "../../utils/constants/ui"

const ExploreHeader = ({
  navigate,
  tagsToDisplay,
  tags,
  handleTagClick,
  showAllTags,
  setShowAllTags,
  hasMoreTags,
  classNames,
}) => {
  return (
    <div className="mt-6 bg-white shadow-sm rounded-lg">
      <div>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-4 mb-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">
                  {UI_TEXT.explore.backButton}
                </span>
              </div>
            </button>
          </div>

          {/* Mobile Tags Section */}
          <div className="lg:hidden mt-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <span className="text-pink-500">{UI_TEXT.explore.tagsTitle}</span>{" "}
              <span className="text-cyan-400">
                {UI_TEXT.explore.tagsSubtitle}
              </span>
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {tagsToDisplay.map((tag) => {
                const isSelected = tags.includes(tag.name)
                return (
                  <button
                    key={tag.id || tag.name}
                    onClick={() => handleTagClick(tag.name)}
                    className={classNames(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-info text-black"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    )}
                  >
                    #{tag.name}
                  </button>
                )
              })}
            </div>

            {/* More Button */}
            {hasMoreTags && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-purple-600 text-sm font-medium underline hover:text-purple-800 transition-colors"
              >
                {showAllTags
                  ? UI_TEXT.explore.lessButton
                  : UI_TEXT.explore.moreButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreHeader
