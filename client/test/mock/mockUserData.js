// Sign-up mock data
const signUpMockData = {
  input: {
    firebaseUid: "mock-firebase-uid-12345",
    email: "john.doe@example.com",
    displayName: "johndoe123",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    firstName: "John",
    lastName: "Doe",
    phone: "+1234567890",
  },
}

// Sign-in mock data
const signInMockData = {
  input: {
    firebaseUid: "existing-firebase-uid-67890",
    email: "jane.smith@example.com",
    displayName: "janesmith456",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  },
}

// GraphQL mutation examples
const SYNC_USER_MUTATION = `
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
