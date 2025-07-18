import { useState } from 'react'
import { auth } from '../utils/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'

import { useSyncUser } from './useUser'
import { AUTH_CONFIG } from '../utils/constants/auth'

/**
 * Custom hook for handling Firebase authentication sign up and sign in
 * Manages user sign-up, sign-in, and error states
 * Note: User syncing and Redux updates are handled by useAuthChange hook
 * @returns {signIn, signUp, errorMessage} Auth methods and state
 */
export const useAuth = () => {
  // Track authentication error messages
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  // Hook for syncing user data with GraphQL backend
  const { syncUser } = useSyncUser()

  /**
   * Handles user registration with Firebase
   * @returns {Promise<Object>} Firebase user object
   */
  const signUp = async (formData) => {
    if (isLoading) return // prevent multiple submissions
    setIsLoading(true)
    setErrorMessage(null)

    const { email, password, firstName, lastName, phone, userName } = formData
    try {
      // 1. Create Firebase auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      // 2. Update user profile with display name and random avatar, otherwise the avatar will not be shown correctly
      await updateProfile(user, {
        displayName: userName,
        photoURL: `${AUTH_CONFIG.avatarBaseUrl}${Math.floor(Math.random() * AUTH_CONFIG.maxAvatarNumber) + 1}`,
      })

      // 3. Force refresh the current user to get updated profile
      await auth.currentUser.reload()

      // Sync complete user data with additional signup fields
      const { uid, displayName, photoURL } = auth.currentUser
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
      } catch (syncError) {
        // Server handles duplicates gracefully, just warn and continue
        console.warn('Signup sync failed (non-critical):', syncError.message)
      }

      // Note: Redux store updates are handled by useAuthChange hook
      setErrorMessage(null)
      return user
    } catch (error) {
      setErrorMessage(`${error.code}: ${error.message}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles user sign-in with Firebase
   * @returns {Promise<Object>} Firebase user object
   */
  const signIn = async (email, password) => {
    if (isLoading) return // prevent multiple submissions
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      setErrorMessage(null)
      return user
    } catch (error) {
      setErrorMessage(`${error.code}: ${error.message}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    signIn,
    signUp,
    errorMessage,
    isLoading,
  }
}
