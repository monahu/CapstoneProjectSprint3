import { gql } from '@apollo/client'

export const GET_POSTS = gql`
  query GetPosts($limit: Int, $offset: Int, $filter: PostFilter) {
    posts(limit: $limit, offset: $offset, filter: $filter) {
      id
      title
      content
      author {
        id
        displayName
        photoURL
      }
      rating
      createdAt
      updatedAt
      likesCount
      goingCount
      sharedCount
      tags
      goingList {
        id
        author {
          displayName
          photoURL
        }
      }
    }
  }
`

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author {
        id
        displayName
        photoURL
      }
      rating
      createdAt
      updatedAt
      likesCount
      goingCount
      sharedCount
      tags
      goingList {
        id
        author {
          id
          displayName
          photoURL
        }
        createdAt
      }
    }
  }
`

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      author {
        id
        displayName
        photoURL
      }
      rating
      createdAt
      tags
    }
  }
`

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
      rating
      updatedAt
      tags
    }
  }
`

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likesCount
    }
  }
`
