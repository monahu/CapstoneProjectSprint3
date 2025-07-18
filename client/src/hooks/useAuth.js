import { useState } from 'react'
import { auth } from '../utils/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useSyncUser } from './useUser'
import { AUTH_CONFIG } from '../utils/constants/auth'
import { useAuthContext } from './AuthContext'

/**
 * ? Custom hook for handling Firebase authentication for the sign up and sign in if using Rest API don't use this hook
 * Manages user sign-up, sign-in, and error states
 * Also syncs user data with Redux store and GraphQL backend
 * @returns {signIn, signUp, errorMessage,} Auth methods and state
 */
export const useAuth = () => {
  // TODO: remove this useAuthContext and get the user from redux store instead

  const { user, loading, signOut } = useAuthContext()

  // Track authentication error messages
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
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
        email: email,
      })

      const { uid, displayName, photoURL } = auth.currentUser

      // 3. Update Redux store with user data
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

      // 4. Sync user data with GraphQL backend
      console.log('🔄 Syncing user with backend') in signUp(useAuth)
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
      console.log('✅ User sync in signUp completed successfully')
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
    user,
    loading,
    signOut,
  }
}
