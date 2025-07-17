import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { addUser, removeUser } from '../utils/userSlice'
import { ROUTES } from '../utils/constants/app'
import { NAVIGATION } from '../utils/constants/navigation'
import { useSyncUser } from './useUser'

export const useNavbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)
  const { syncUser } = useSyncUser()

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

  // Authentication state management - runs once only
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const {
          uid,
          email,
          displayName,
          photoURL,
          firstName,
          lastName,
          phone,
        } = user

        // Update Redux store first
        dispatch(
          addUser({
            uid,
            email,
            displayName,
            photoURL,
            firstName,
            lastName,
            phone,
          })
        )

        // Sync user to database immediately (no delay needed)
        try {
          // Ensure we have a fresh token before making the request
          const token = await user.getIdToken(true)
          if (!token) {
            console.warn('⚠️ No Firebase token available, skipping user sync')
            return
          }

          console.log('🔄 Syncing user with backend')
          await syncUser({
            variables: {
              input: {
                firebaseUid: uid,
                email,
                displayName,
                photoURL,
              },
            },
          })
          console.log('✅ User sync completed successfully')
        } catch (error) {
          // Enhanced error handling for different types of auth errors
          if (
            error.message?.includes('Authentication required') ||
            error.message?.includes('firebaseUid') ||
            error.networkError?.statusCode === 401
          ) {
            console.warn(
              '⚠️ Authentication not ready yet, will retry on next request'
            )
          } else {
            console.warn(
              'User sync failed (non-critical):',
              error.message || error
            )
          }
        }
      } else {
        // User is signed out
        dispatch(removeUser())
      }
    })

    return () => unsubscribe()
  }, [dispatch, syncUser]) // Only depends on dispatch and syncUser, not location

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
