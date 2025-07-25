import { useMutation } from '@apollo/client'
import { CREATE_POST } from '../../utils/graphql/post'
import { DEFAULT_POSTS_VARIABLES } from '../../utils/constants/posts'
import { addPostToCache } from '../../utils/cacheUtils'
import { showErrorToast } from '../../utils/toast'

export const useCreatePost = (cacheVariables = DEFAULT_POSTS_VARIABLES) => {
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      addPostToCache(cache, createPost, cacheVariables)
    },
    onError: (error) => {
      showErrorToast(`Failed to create post: ${error.message}`)
    },
  })

  return { createPost, loading, error }
}