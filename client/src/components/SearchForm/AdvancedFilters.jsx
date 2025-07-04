export default function AdvancedFilters({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  showAdvanced = false,
}) {
  if (!showAdvanced) return null

  return (
    <>
      {/* Advanced Filters Toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {isOpen ? "Hide" : "Show"} Advanced Filters
      </button>

      {/* Advanced Filters */}
      {isOpen && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
          <div>
            <label
              htmlFor="search-tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags (comma-separated)
            </label>
            <input
              id="search-tags"
              type="text"
              value={filters.tags}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  tags: e.target.value,
                })
              }
              placeholder="e.g. sushi, casual, fine-dining"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="search-location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              id="search-location"
              type="text"
              value={filters.location}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  location: e.target.value,
                })
              }
              placeholder="e.g. Toronto, Waterloo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </>
  )
}
