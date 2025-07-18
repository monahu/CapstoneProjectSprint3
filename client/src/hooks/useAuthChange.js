import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../utils/firebase'
import {
  addUser,
  removeUser,
  setAuthInitialized as setAuthInitializedAction,
} from '../utils/userSlice'
import { useSyncUser } from './useUser'

export const useAuthChange = (options = {}) => {
  const dispatch = useDispatch()
  const { syncUser } = useSyncUser()
  const [authInitialized, setAuthInitialized] = useState(false)

  const {
    onAuthSuccess,
    onAuthFailure,
    shouldSyncUser = true,
    shouldRefetchData = false,
    refetch,
  } = options

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Always use auth.currentUser to get the most up-to-date user data
          let currentUser = auth.currentUser

          // For new signups, the profile might not be updated yet
          const isNewUser =
            currentUser.metadata?.creationTime ===
            currentUser.metadata?.lastSignInTime

          if (
            isNewUser &&
            (!currentUser.displayName || !currentUser.photoURL)
          ) {
            // Wait a bit longer for profile update to complete, then reload
            await new Promise((resolve) => setTimeout(resolve, 200))
            await currentUser.reload()
            currentUser = auth.currentUser

            // If still no profile data, try one more time
            if (!currentUser.displayName || !currentUser.photoURL) {
              await new Promise((resolve) => setTimeout(resolve, 300))
              await currentUser.reload()
              currentUser = auth.currentUser
            }
          }

          const { uid, email, displayName, photoURL } = currentUser

          // Debug: Check if photoURL is present
          if (isNewUser) {
            console.log('New user auth state:', { displayName, photoURL })
          }

          // Update Redux store (Firebase user only has basic properties)
          dispatch(
            addUser({
              uid,
              email,
              displayName,
              photoURL,
            })
          )

          // Sync user to database if enabled
          // Only sync for existing users (not new signups, which are handled by useAuth.signUp)
          if (shouldSyncUser) {
            if (!isNewUser) {
              // Only sync existing users to update their Firebase profile changes
              try {
                const token = await user.getIdToken(true)
                if (token) {
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
                }
              } catch (syncError) {
                // Server handles duplicates gracefully, just log and continue
                console.warn(
                  'User sync failed (non-critical):',
                  syncError.message
                )
              }
            } else {
              // New user - skip sync (handled by useAuth.signUp)
            }
          }

          // Refetch data when auth state changes if enabled
          if (shouldRefetchData && authInitialized && refetch) {
            refetch({
              fetchPolicy: 'network-only',
            })
          }

          // Call success callback if provided
          onAuthSuccess?.(user)
        } else {
          // User is signed out
          dispatch(removeUser())
          onAuthFailure?.()
        }

        // Mark auth as initialized after first check
        if (!authInitialized) {
          setAuthInitialized(true)
          dispatch(setAuthInitializedAction())
        }
      } catch (error) {
        console.error('❌ Auth state change error:', error)
        onAuthFailure?.(error)
      }
    })

    return () => unsubscribe()
  }, []) // Empty deps - auth listener runs once and never restarts

  return { authInitialized }
}
