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
      .then(() => {})
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

  // Authentication state management
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

        // Silent sync to ensure database is up to date
        // This ensures navbar and posts show same photo
        try {
          await syncUser({
            variables: {
              input: {
                firebaseUid: uid,
                email,
                displayName,
                photoURL,
                firstName,
                lastName,
                phone,
              },
            },
          })
        } catch (error) {
          // Silent fail - don't disrupt user experience
          console.warn('User sync failed (non-critical):', error)
        }

        // Only redirect to home if user is on login page
        if (location.pathname === ROUTES.LOGIN) {
          navigate(ROUTES.HOME)
        }
      } else {
        // no user logged in
        dispatch(removeUser())
        // Only redirect if they're trying to access protected routes
        if (protectedRoutes.includes(location.pathname)) {
          navigate(ROUTES.LOGIN)
        }
      }
    })
    // Unsubscribe onAuthStateChanged when component unmount
    return () => unsubscribe()
  }, [location.pathname, navigate, dispatch, protectedRoutes, syncUser])

  return {
    user,
    userNavigation,
    hideLogoRoutes,
    handleSignOut,
    location,
  }
}
