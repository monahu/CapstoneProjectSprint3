import { useState, useMemo } from 'react'
import { useLocation } from 'react-router'
import { useTags } from './usePost'
import { useClassNames } from './useClassNames'
import { useTagSelection } from './useTagSelection'
import { NAVIGATION } from '../utils/constants/navigation'
import { TAGS_CONFIG } from '../utils/constants/tags'

export const useSidebar = (user) => {
  const location = useLocation()
  const { tags: dbTags } = useTags()
  const { classNames } = useClassNames()
  const [showAllTags, setShowAllTags] = useState(false)
  const { currentTags, handleTagClick } = useTagSelection()

  // Create navigation list based on user status
  const navigationList = useMemo(() => {
    const navItems = user ? NAVIGATION.sidebar : NAVIGATION.sidebarVisitor
    return navItems.map((item) => ({
      ...item,
      current: location.pathname === item.href,
    }))
  }, [user, location.pathname])

  // Use database tags if available, fallback to hardcoded tags
  const tagsToShow = dbTags.length > 0 ? dbTags : NAVIGATION.tags

  // Get tags for display (limit to DISPLAY_LIMIT unless showing all)
  const tagsToDisplay = showAllTags ? tagsToShow : tagsToShow.slice(0, TAGS_CONFIG.DISPLAY_LIMIT)
  const hasMoreTags = tagsToShow.length > TAGS_CONFIG.DISPLAY_LIMIT

  // Map tags with current state
  const tags = useMemo(() => {
    return tagsToDisplay.map((tag) => ({
      ...tag,
      current:
        location.pathname === '/explore' && currentTags.includes(tag.name),
    }))
  }, [tagsToDisplay, location.pathname, currentTags])

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
