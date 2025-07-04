import { useState } from "react"
import { useNavigate } from "react-router"

export const useSearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    tags: "",
    location: "",
  })
  const navigate = useNavigate()
  // return false if no filters are active or search term is empty
  const hasActiveFilters = !!(
    searchTerm ||
    advancedFilters.tags ||
    advancedFilters.location
  )

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
        ? advancedFilters.tags.split(",").map((t) => t.trim())
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
    if (searchParams.searchTerm) params.set("q", searchParams.searchTerm)
    if (searchParams.tags.length)
      params.set("tags", searchParams.tags.join(","))
    if (searchParams.location) params.set("location", searchParams.location)

    navigate(`/explore?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setAdvancedFilters({ tags: "", location: "" })
    setIsAdvancedOpen(false)
  }

  const handleVoiceResult = (transcript) => {
    setSearchTerm(transcript)
  }

  return {
    searchTerm,
    setSearchTerm,
    isAdvancedOpen,
    setIsAdvancedOpen,
    advancedFilters,
    setAdvancedFilters,
    hasActiveFilters,
    handleSubmit,
    clearSearch,
    handleVoiceResult,
  }
}
