import { gql } from '@apollo/client'

// ===========================
// USER QUERIES
// ===========================
// get current user info & profile
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
/*   input SyncUserInput {
    firebaseUid: String!
    email: String!
    displayName: String
    photoURL: String
    firstName: String
    lastName: String
    phone: String
  } */
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
