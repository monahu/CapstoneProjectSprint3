import { useAuthChange } from './useAuthChange'

/**
 * Centralized authentication state manager
 * This should be placed at the top level of the app to ensure
 * only one instance manages auth state globally
 */
export const AuthManager = ({ children }) => {
  // Single global auth management with smart syncing
  useAuthChange({
    shouldSyncUser: true, // Smart sync - only existing users, not new signups
    shouldRefetchData: false,
  })

  // This component only manages auth state, doesn't render anything
  return children
}
