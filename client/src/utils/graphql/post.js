import { gql } from '@apollo/client'

// ===========================
// TAG QUERIES
// ===========================
export const GET_ALL_TAGS = gql`
  query GetAllTags {
    tags {
      id
      name
    }
  }
`

// ===========================
// POST QUERIES
// ===========================
// * Get all posts (limit, offset, filter)
// * manually tested
export const GET_ALL_POSTS = gql`
  query GetAllPosts($limit: Int, $offset: Int, $filter: PostFilter) {
    posts(limit: $limit, offset: $offset, filter: $filter) {
      posts {
        id
        title
        placeName
        content
        location
        imageUrls {
          desktop
          mobile
          mobile2x
          tablet
        }
        createdAt
        shareCount
        author {
          id
          displayName
          photoURL
        }
        rating {
          type
        }
        attendees {
          id
          displayName
        }
        attendeeCount
        isWantToGo
        likeCount
        isLiked
        tags {
          id
          name
        }
        isOwner
      }
      totalCount
    }
  }
`
export const GET_MY_WANT_TO_GO_POSTS = gql`
  query GetMyWantToGoPosts {
    myWantToGoPosts {
      id
      title
      location
      imageUrls {
        desktop
        mobile
      }
      createdAt
      author {
        id
        displayName
        photoURL
      }
      isWantToGo
    }
  }
`

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      placeName
      content
      location
      imageUrls {
        desktop
        mobile
        mobile2x
        tablet
      }
      createdAt
      shareCount
      author {
        id
        displayName
        photoURL
        firstName
        lastName
        email
      }
      rating {
        id
        score
        type
        description
      }
      attendees {
        id
        displayName
        photoURL
        firstName
        lastName
      }
      attendeeCount
      isWantToGo
      likeCount
      isLiked
      tags {
        id
        name
      }
      isOwner
    }
  }
`

export const GET_MY_POSTS = gql`
  query GetMyPosts {
    myPosts {
      id
      title
      placeName
      content
      location
      isWantToGo
      imageUrls {
        desktop
        mobile
        mobile2x
        tablet
      }
      createdAt
      shareCount
      rating {
        id
        score
        type
        description
      }
      attendeeCount
      likeCount
      tags {
        id
        name
      }
      isOwner
    }
  }
`

// ===========================
// SEARCH QUERIES
// ===========================

export const SEARCH_POSTS_BY_TAGS = gql`
  query SearchPostsByTags($tags: [String!]!, $limit: Int, $offset: Int) {
    searchPostsByTags(tags: $tags, limit: $limit, offset: $offset) {
      id
      title
      placeName
      content
      location
      imageUrls {
        desktop
        mobile
        mobile2x
        tablet
      }
      createdAt
      shareCount
      tags {
        id
        name
      }
      author {
        id
        displayName
        photoURL
      }
      rating {
        type
      }
      attendees {
        id
        displayName
      }
      attendeeCount
      isWantToGo
      likeCount
      isLiked
      tags {
        id
        name
      }
      isOwner
    }
  }
`

export const BASIC_SEARCH = gql`
  query BasicSearch($searchTerm: String!, $limit: Int, $offset: Int) {
    basicSearch(searchTerm: $searchTerm, limit: $limit, offset: $offset) {
      id
      title
      placeName
      content
      location
      imageUrls {
        desktop
        mobile
        mobile2x
        tablet
      }
      createdAt
      shareCount
      author {
        id
        displayName
        photoURL
      }
      rating {
        id
        score
        type
      }
      attendees {
        id
        displayName
      }
      attendeeCount
      isWantToGo
      likeCount
      isLiked
      tags {
        id
        name
      }
      isOwner
    }
  }
`

// ===========================
// POST MUTATIONS
// ===========================

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      placeName
      content
      location
      imageUrls {
        desktop
        mobile
        mobile2x
        tablet
      }
      createdAt
      shareCount
      author {
        id
        displayName
        photoURL
      }
      rating {
        id
        score
        type
        description
      }
      tags {
        id
        name
      }
    }
  }
`

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      placeName
      content
      location
      imageUrls {
        desktop
        mobile
        mobile2x
        tablet
      }
      createdAt
      shareCount
      author {
        id
        displayName
        photoURL
      }
      tags {
        id
        name
      }
      isOwner
    }
  }
`

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`

// ===========================
// INTERACTION MUTATIONS
// ===========================

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($postId: ID!) {
    toggleLike(postId: $postId) {
      id
      likeCount
      isLiked
      likes {
        id
        displayName
        photoURL
      }
    }
  }
`

export const TOGGLE_WANT_TO_GO = gql`
  mutation ToggleWantToGo($postId: ID!) {
    toggleWantToGo(postId: $postId) {
      id
      attendeeCount
      isWantToGo
      attendees {
        id
        displayName
        photoURL
      }
    }
  }
`

export const TOGGLE_SHARE = gql`
  mutation ToggleShare($postId: ID!) {
    toggleShare(postId: $postId) {
      id
      shareCount
    }
  }
`

// ===========================
// TAG MUTATIONS
// ===========================

export const ADD_TAG_TO_POST = gql`
  mutation AddTagToPost($postId: ID!, $tagName: String!) {
    addTagToPost(postId: $postId, tagName: $tagName) {
      id
      tags {
        id
        name
      }
    }
  }
`

export const REMOVE_TAG_FROM_POST = gql`
  mutation RemoveTagFromPost($postId: ID!, $tagName: String!) {
    removeTagFromPost(postId: $postId, tagName: $tagName) {
      id
      tags {
        id
        name
      }
    }
  }
`
