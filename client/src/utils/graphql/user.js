import { gql } from '@apollo/client'

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
