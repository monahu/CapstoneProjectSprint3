import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { signOut } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { ROUTES } from '../utils/constants/app'
import { NAVIGATION } from '../utils/constants/navigation'

export const useNavbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector((store) => store.user.data)

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Redirect to login page after successful logout
        navigate(ROUTES.LOGIN)
      })
      .catch((error) => {
        console.error('sign out error', error)
        navigate(ROUTES.ERROR)
      })
    console.log('Signing out')
  }

  // Navigation items for the user dropdown menu
  const userNavigation = NAVIGATION.userDropdown.map((item) => ({
    ...item,
    action: item.hasAction ? handleSignOut : undefined,
  }))

  const hideLogoRoutes = NAVIGATION.hideLogoRoutes
  const protectedRoutes = NAVIGATION.protectedRoutes

  // Navigation logic - runs when location or user changes
  useEffect(() => {
    if (user) {
      // Only redirect to home if user is on login page
      if (location.pathname === ROUTES.LOGIN) {
        navigate(ROUTES.HOME)
      }
    } else {
      // Only redirect if they're trying to access protected routes
      if (protectedRoutes.includes(location.pathname)) {
        navigate(ROUTES.LOGIN)
      }
    }
  }, [location.pathname, navigate, user, protectedRoutes]) // Separate effect for navigation

  return {
    user,
    userNavigation,
    hideLogoRoutes,
    protectedRoutes,
    handleSignOut,
    location,
  }
}
