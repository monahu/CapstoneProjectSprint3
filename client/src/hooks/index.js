// Auth hooks
export { useAuth } from './useAuth'
export { useAuthChange } from './useAuthChange'
export { AuthManager } from './AuthManager'

// Post-related hooks (new structure)
export * from './posts'
export * from './postActions'
export * from './search'
export * from './tags'

// UI hooks
export { useNavbar } from './useNavbar'
export { useExplore } from './useExplore'
export { useSidebar } from './useSidebar'
export { useClassNames } from './useClassNames'
export { useVoiceInput } from './useVoiceInput'

// User hooks
export { useUserProfile, useSyncUser, useUpdateUserProfile } from './useUser'

// Backward compatibility - re-export old usePost exports
export { usePost, useTags } from './usePost'
export { usePostActions } from './usePostActions'
export { useSearchForm } from './useSearchForm'
export { useTagSelection } from './useTagSelection'
