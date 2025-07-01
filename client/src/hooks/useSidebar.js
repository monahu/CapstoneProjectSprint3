import { useState, useMemo } from "react"
import { useLocation, useNavigate } from "react-router"
import { useTags } from "./usePost"
import { useClassNames } from "./useClassNames"
import { NAVIGATION } from "../utils/constants/navigation"

export const useSidebar = (user) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { tags: dbTags } = useTags()
  const { classNames } = useClassNames()
  const [showAllTags, setShowAllTags] = useState(false)

  // Create navigation list based on user status
  const navigationList = useMemo(() => {
    const navItems = user ? NAVIGATION.sidebar : NAVIGATION.sidebarVisitor
    return navItems.map((item) => ({
      ...item,
      current: location.pathname === item.href,
    }))
  }, [user, location.pathname])

  // Extract current tags from URL
  const searchParams = new URLSearchParams(location.search)
  const currentTags = searchParams.get("tags")?.split(",").filter(Boolean) || []

  // Use database tags if available, fallback to hardcoded tags
  const tagsToShow = dbTags.length > 0 ? dbTags : NAVIGATION.tags

  // Get tags for display (limit to 10 unless showing all)
  const tagsToDisplay = showAllTags ? tagsToShow : tagsToShow.slice(0, 10)
  const hasMoreTags = tagsToShow.length > 10

  // Map tags with current state
  const tags = useMemo(() => {
    return tagsToDisplay.map((tag) => ({
      ...tag,
      current:
        location.pathname === "/explore" && currentTags.includes(tag.name),
    }))
  }, [tagsToDisplay, location.pathname, currentTags])

  // Handle tag click to add/remove from selection
  const handleTagClick = (tagName) => {
    let newTags
    if (currentTags.includes(tagName)) {
      // Remove tag if already selected
      newTags = currentTags.filter((tag) => tag !== tagName)
    } else {
      // Add tag if not selected
      newTags = [...currentTags, tagName]
    }

    // Build new URL
    const newSearchParams = new URLSearchParams(location.search)
    if (newTags.length > 0) {
      newSearchParams.set("tags", newTags.join(","))
    } else {
      newSearchParams.delete("tags")
    }

    const newUrl = `/explore${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`
    navigate(newUrl, { replace: true })
  }

  // Create explore object with current state
  const explore = useMemo(
    () => ({
      ...NAVIGATION.explore,
      current: location.pathname === NAVIGATION.explore.href,
    }),
    [location.pathname]
  )

  return {
    // Navigation data
    navigationList,
    explore,

    // Tags data
    tags,
    hasMoreTags,
    showAllTags,
    setShowAllTags,

    // Actions
    handleTagClick,
    classNames,
  }
}
