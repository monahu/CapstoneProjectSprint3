import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * ScrollToTop Component
 * Automatically scrolls to top of page when route changes
 * This fixes the issue where navigating to a new page shows content at the bottom
 */
const ScrollToTop = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top whenever the route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth scroll animation
    })
  }, [location.pathname]) // Trigger when path changes

  return children
}

export default ScrollToTop