import { useQuery, useMutation } from '@apollo/client'
import {
  GET_POSTS,
  GET_POST_BY_ID,
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  LIKE_POST,
} from '../utils/graphql/posts'

export const usePosts = (limit = 10, offset = 0, filter = {}) => {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_POSTS, {
    variables: { limit, offset, filter },
    notifyOnNetworkStatusChange: true,
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
      const existingPosts = cache.readQuery({ query: GET_POSTS })
      if (existingPosts) {
        cache.writeQuery({
          query: GET_POSTS,
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
  const [likePost, { loading, error }] = useMutation(LIKE_POST)
  return { likePost, loading, error }
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
