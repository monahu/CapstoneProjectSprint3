// Re-exports for backward compatibility
// Import from new organized structure

// Posts (CRUD operations)
export {
  usePosts,
  usePost,
  useProgressivePosts,
  useCreatePost,
  useDeletePost,
} from './posts'

// Search functionality
export { useSearchPostsByTags, useBasicSearch } from './search'

// Tags functionality
export { useTags } from './tags'

// Note: Post actions (like, share, want-to-go) are now in ./postActions/
// Import them directly: import { useLikePost } from './hooks/postActions'
