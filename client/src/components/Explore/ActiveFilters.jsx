import { Trash2 } from "lucide-react"
import { UI_TEXT } from "../../utils/constants/ui"

const ActiveFilters = ({
  hasActiveSearch,
  searchTerm,
  tags,
  location,
  clearAllFilters,
}) => {
  if (!hasActiveSearch) return null

  return (
    <div>
      <div className="container mx-auto px-4 py-2">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {UI_TEXT.explore.searchContext} {searchTerm ? "search" : "tags"}:
          </h2>

          {/* Active Filters Display */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {searchTerm && (
              <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full">
                "{searchTerm}"
              </span>
            )}
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-info text-black border border-primary text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
            {location && (
              <span className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-full">
                📍 {location}
              </span>
            )}
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {UI_TEXT.explore.cleanFiltersButton}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActiveFilters
