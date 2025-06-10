import { gql } from '@apollo/client'

// ===========================
// USER QUERIES
// ===========================

export const GET_USER_PROFILE = gql`
  query GetUserProfile($firebaseUid: String!) {
    userProfile(firebaseUid: $firebaseUid) {
      id
      firebaseUid
      email
      displayName
      photoURL
      firstName
      lastName
      phone
      createdAt
      updatedAt
      posts {
        id
        title
        placeName
        imageUrl
        createdAt
      }
      wantToGo {
        id
        post {
          id
          title
          placeName
          imageUrl
          author {
            displayName
          }
        }
      }
    }
  }
`

export const GET_ME = gql`
  query GetMe {
    me {
      id
      firebaseUid
      email
      displayName
      photoURL
      firstName
      lastName
      phone
      createdAt
      updatedAt
      posts {
        id
        title
        placeName
        imageUrl
        createdAt
        likeCount
        attendeeCount
      }
      wantToGo {
        id
        post {
          id
          title
          placeName
          imageUrl
          author {
            displayName
            photoURL
          }
          attendeeCount
          likeCount
        }
      }
    }
  }
`

// ===========================
// USER MUTATIONS
// ===========================

export const SYNC_USER = gql`
  mutation SyncUser($input: SyncUserInput!) {
    syncUser(input: $input) {
      id
      firebaseUid
      email
      displayName
      photoURL
      firstName
      lastName
      phone
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      firebaseUid
      email
      displayName
      photoURL
      firstName
      lastName
      phone
      createdAt
      updatedAt
    }
  }
`
/* 
export const SYNC_USER_MUTATION = gql`
  mutation SyncUser($input: SyncUserInput!) {
    syncUser(input: $input) {
      id
      firebaseUid
      email
      displayName
      photoURL
      firstName
      lastName
      phone
      createdAt
      updatedAt
    }
  }
`
export const GET_USER_PROFILE = gql`
  query GetUserProfile($firebaseUid: String!) {
    userProfile(firebaseUid: $firebaseUid) {
      id
      firebaseUid
      email
      displayName
      photoURL
      firstName
      lastName
      phone
      goingList
      postList
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      displayName
      photoURL
      firstName
      lastName
      phone
    }
  }
`
 */
