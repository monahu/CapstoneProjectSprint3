import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function SearchForm({
  className = '',
  onSearch,
  placeholder = 'Search restaurants, places, or tags...',
  showAdvanced = false,
  hideClearButton = false,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    tags: '',
    location: '',
  })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !searchTerm.trim() &&
      !advancedFilters.tags.trim() &&
      !advancedFilters.location.trim()
    ) {
      return
    }

    const searchParams = {
      searchTerm: searchTerm.trim(),
      tags: advancedFilters.tags.trim()
        ? advancedFilters.tags.split(',').map((t) => t.trim())
        : [],
      location: advancedFilters.location.trim(),
    }

    // If onSearch prop is provided, use it (for inline search)
    if (onSearch) {
      onSearch(searchParams)
      return
    }

    // Otherwise navigate to search results page
    const params = new URLSearchParams()
    if (searchParams.searchTerm) params.set('q', searchParams.searchTerm)
    if (searchParams.tags.length)
      params.set('tags', searchParams.tags.join(','))
    if (searchParams.location) params.set('location', searchParams.location)

    navigate(`/explore?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setAdvancedFilters({ tags: '', location: '' })
    setIsAdvancedOpen(false)
  }

  const hasActiveFilters =
    searchTerm || advancedFilters.tags || advancedFilters.location

  return (
    <div className={`w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        {/* Main Search Bar */}
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <label
              htmlFor='search-input'
              className='sr-only'
            >
              Search
            </label>
            <input
              id='search-input'
              name='search'
              type='search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              aria-label='Search'
              className='block w-full bg-white pl-10 pr-10 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
            />
            <Search
              aria-hidden='true'
              className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400'
            />
            {hasActiveFilters && !hideClearButton && (
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
            className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
          >
            Search
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        {showAdvanced && (
          <button
            type='button'
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className='text-sm text-blue-600 hover:text-blue-800 font-medium'
          >
            {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Filters
          </button>
        )}

        {/* Advanced Filters */}
        {showAdvanced && isAdvancedOpen && (
          <div className='border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50'>
            <div>
              <label
                htmlFor='search-tags'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Tags (comma-separated)
              </label>
              <input
                id='search-tags'
                type='text'
                value={advancedFilters.tags}
                onChange={(e) =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    tags: e.target.value,
                  }))
                }
                placeholder='e.g. sushi, casual, fine-dining'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <div>
              <label
                htmlFor='search-location'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Location
              </label>
              <input
                id='search-location'
                type='text'
                value={advancedFilters.location}
                onChange={(e) =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder='e.g. Toronto, Waterloo'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
