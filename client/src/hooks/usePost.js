import { useQuery, useMutation } from '@apollo/client'
import {
  GET_ALL_POSTS,
  GET_POST_BY_ID,
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  TOGGLE_LIKE,
  TOGGLE_WANT_TO_GO,
} from '../utils/graphql/post'

export const usePosts = (limit = 10, offset = 0, filter = {}, options = {}) => {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_ALL_POSTS, {
    variables: { limit, offset, filter },
    notifyOnNetworkStatusChange: true,
    ...options,
    onError: (error) => {
      console.error('GET_ALL_POSTS error:', error)
    },
  })

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data?.posts?.length || 0,
      },
    })
  }

  return {
    posts: data?.posts || [],
    loading,
    error,
    loadMore,
    refetch,
  }
}

export const usePost = (id) => {
  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { id },
    skip: !id,
  })

  return {
    post: data?.post,
    loading,
    error,
  }
}

export const useCreatePost = () => {
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      const existingPosts = cache.readQuery({ query: GET_ALL_POSTS })
      if (existingPosts) {
        cache.writeQuery({
          query: GET_ALL_POSTS,
          data: {
            posts: [createPost, ...existingPosts.posts],
          },
        })
      }
    },
  })

  return { createPost, loading, error }
}

export const useLikePost = () => {
  const [likePost, { loading, error }] = useMutation(TOGGLE_LIKE, {
    // Force refetch the posts to get fresh data from server
    refetchQueries: [{ query: GET_ALL_POSTS }],
    awaitRefetchQueries: true,
  })
  return { likePost, loading, error }
}

export const useWantToGoPost = () => {
  const [wantToGoPost, { loading, error }] = useMutation(TOGGLE_WANT_TO_GO, {
    // Force refetch the posts to get fresh data from server
    refetchQueries: [{ query: GET_ALL_POSTS }],
    awaitRefetchQueries: true,
  })
  return { wantToGoPost, loading, error }
}

export const useDeletePost = () => {
  const [deletePost, { loading, error }] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost: deletedId } }) {
      cache.modify({
        fields: {
          posts(existingPosts = [], { readField }) {
            return existingPosts.filter(
              (postRef) => deletedId !== readField('id', postRef)
            )
          },
        },
      })
    },
  })

  return { deletePost, loading, error }
}
