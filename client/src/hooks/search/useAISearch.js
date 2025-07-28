import { useState } from 'react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

/**
 * AI Search Hook
 * Handles AI-enhanced search functionality using Google Gemini
 */
export const useAISearch = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [message, setMessage] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isBackendAvailable, setIsBackendAvailable] = useState(true)

  /**
   * Perform AI-enhanced search
   */
  const performAISearch = async (query, options = {}) => {
    const { limit = 10, offset = 0 } = options

    // Validate input
    if (!query || query.trim().length === 0) {
      setError('Query is required')
      return
    }

    // Check if query is worth AI enhancement (2+ words)
    const wordCount = query.trim().split(/\s+/).length
    if (wordCount < 2) {
      setError('Query too short for AI enhancement')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(false)

    try {
      console.log(`Starting AI search for: "${query}"`)

      // Get auth token from localStorage or context
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token')

      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: query.trim(),
          limit,
          offset,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific AI disabled case
        if (response.status === 503 && data.aiDisabled) {
          setIsBackendAvailable(false)
          throw new Error('AI search is currently disabled on the server')
        }
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      if (data.success) {
        setResults(data.results || [])
        setHasSearched(true)
        setMessage(data.message || '')
        setSuggestions(data.suggestions || [])

        console.log(
          `AI search completed: ${data.results?.length || 0} results in ${data.processingTime}ms`
        )

        // Show success toast with processing time
        if (data.results?.length > 0) {
          showSuccessToast(
            `AI found ${data.results.length} results in ${data.processingTime}ms!`,
            3000
          )
        } else {
          // Don't show toast for no results since we have the encouraging message
          console.log(
            'AI search completed with no results, showing encouraging message'
          )
        }
      } else {
        throw new Error(data.error || 'AI search failed')
      }
    } catch (err) {
      console.error('AI search error:', err)
      setError(err.message)
      setResults([])

      // Show error toast
      showErrorToast(`AI search failed: ${err.message}`, 5000)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Clear search results and state
   */
  const clearResults = () => {
    setResults([])
    setError(null)
    setHasSearched(false)
    setMessage('')
    setSuggestions([])
    setIsBackendAvailable(true)
  }

  /**
   * Check if AI search is available
   */
  const checkAIAvailability = async () => {
    try {
      const response = await fetch('/api/ai-search/status')
      const data = await response.json()
      return data.available || false
    } catch (error) {
      console.error('Error checking AI availability:', error)
      return false
    }
  }

  return {
    // State
    loading,
    error,
    results,
    hasSearched,
    message,
    suggestions,
    isBackendAvailable,

    // Actions
    performAISearch,
    clearResults,
    checkAIAvailability,

    // Computed
    hasResults: results.length > 0,
    isEmpty: hasSearched && results.length === 0,
  }
}
