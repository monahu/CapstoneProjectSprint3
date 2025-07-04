import { Search, X } from "lucide-react"
import { useSearchForm } from "../../hooks"
import AdvancedFilters from "./AdvancedFilters"
// import VoiceInput from "../VoiceInput/VoiceInput"

export default function SearchForm({
  className = "",
  onSearch,
  placeholder = "Search restaurants, places, or tags...",
  showAdvanced = false,
  hideClearButton = false,
}) {
  const {
    searchTerm,
    setSearchTerm,
    isAdvancedOpen,
    setIsAdvancedOpen,
    advancedFilters,
    setAdvancedFilters,
    hasActiveFilters,
    handleSubmit,
    clearSearch,
  } = useSearchForm({ onSearch })

  return (
    <div className={`w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Main Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <label
              htmlFor="search-input"
              className="sr-only"
            >
              Search
            </label>
            <input
              id="search-input"
              name="search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              aria-label="Search"
              className={`block w-full bg-white pl-10 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${
                hasActiveFilters && !hideClearButton ? "pr-24" : "pr-16"
              }`}
            />
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400"
            />

            {/* Voice Input */}
            {/*             <VoiceInput
              onTranscript={setSearchTerm}
              className={`absolute top-1/2 -translate-y-1/2 ${
                hasActiveFilters && !hideClearButton ? "right-14" : "right-3"
              }`}
            /> */}

            {/* Clear Button */}
            {hasActiveFilters && !hideClearButton && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!hasActiveFilters}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </div>

        <AdvancedFilters
          isOpen={isAdvancedOpen}
          onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
          filters={advancedFilters}
          onFiltersChange={setAdvancedFilters}
          showAdvanced={showAdvanced}
        />
      </form>
    </div>
  )
}
