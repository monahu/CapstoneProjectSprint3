import { Search, X } from 'lucide-react'
import { useSearchForm } from '../../hooks'
import VoiceInput from '../Speech/VoiceInput'
import { UI_TEXT } from '../../utils/constants/ui'

export default function SearchForm({
  className = '',
  onSearch,
  placeholder = UI_TEXT.searchForm.searchPlaceholder,
  mobilePlaceholder = UI_TEXT.searchForm.mobileSearchPlaceholder,
  hideClearButton = false,
  id = 'search-input',
}) {
  const {
    searchTerm,
    setSearchTerm,
    hasActiveFilters,
    handleSubmit,
    clearSearch,
  } = useSearchForm({ onSearch })

  return (
    <div className={`w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        {/* Main Search Bar */}
        <div className='flex gap-2 md:flex-row flex-col'>
          <div className='relative flex-1'>
            <label
              htmlFor={id}
              className='sr-only'
            >
              Search
            </label>
            <input
              id={id}
              name='search'
              type='search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                window.innerWidth >= 768 ? placeholder : mobilePlaceholder
              }
              aria-label='Search'
              className={`block w-full bg-white pl-10 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400    [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${
                searchTerm && !hideClearButton ? 'pr-24' : 'pr-16'
              }`}
            />
            <Search
              aria-hidden='true'
              className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400'
            />

            {/* Voice Input */}
            <VoiceInput
              onTranscript={setSearchTerm}
              className={`absolute top-1/2 -translate-y-1/2 ${
                searchTerm && !hideClearButton ? 'right-14' : 'right-3'
              }`}
            />

            {/* Clear Button */}
            {searchTerm && !hideClearButton && (
              <button
                type='button'
                onClick={clearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                aria-label='Clear search'
              >
                <X className='size-4' />
              </button>
            )}
          </div>

          <button
            type='submit'
            disabled={!hasActiveFilters}
            className='px-6 py-3 bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}
