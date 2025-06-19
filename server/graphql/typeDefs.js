const typeDefs = `#graphql
  scalar Date

  type User {
    id: ID!
    firebaseUid: String!
    email: String!
    displayName: String
    photoURL: String
    firstName: String
    lastName: String
    phone: String
    createdAt: Date!
    updatedAt: Date!
    posts: [Post]
    wantToGoPosts: [WantToGo]
  }

  type Post {
    id: ID!
    title: String!
    placeName: String
    content: String
    location: String
    imageUrl: String
    createdAt: Date
    shares: Int
    author: AuthorInfo
    rating: Rating
    attendees: [AttendeeInfo]
    attendeeCount: Int
    isWantToGo: Boolean
    likeCount: Int
    shareCount: Int
    isLiked: Boolean
    tags: [Tag]
    isOwner: Boolean
  }

  type AuthorInfo {
    id: ID!
    displayName: String
    photoURL: String
  }

  type AttendeeInfo {
    id: ID!
    displayName: String
    photoURL: String
  }

  type Rating {
    id: ID!
    type: String
    description: String
  }

  type WantToGo {
    id: ID!
    postId: ID!
    userId: ID!
    post: Post{
      title: String
      placeName: String
      location: String
      imageUrl: String
      createdAt: Date
      rating: Rating
      tags: [Tag]
    }
  }

  type Tag {
    id: ID!
    name: String!
  }

  input SyncUserInput {
    firebaseUid: String!
    email: String!
    displayName: String
    photoURL: String
    firstName: String
    lastName: String
    phone: String
  }

  input UpdateUserProfileInput {
    displayName: String
    photoURL: String
    firstName: String
    lastName: String
    phone: String
  }

  input CreatePostInput {
    title: String!
    placeName: String!
    content: String
    location: String
    imageUrl: String
    ratingId: ID!
    tags: [String]  
  }

  input UpdatePostInput {
    title: String
    placeName: String
    content: String
    location: String
    imageUrl: String
  }

  input PostFilter {
    placeName: String
    location: String
    userId: ID
  }

  type Query {
    # User queries
    # userProfile(firebaseUid: String!): User # TODO: for scalability
    me: User
    
    # Post queries
    posts(limit: Int, offset: Int, filter: PostFilter): [Post]
    post(id: ID!): Post
    myPosts: [Post]
    searchPostsByTags(tags: [String!]!, limit: Int, offset: Int): [Post]
    searchPosts(searchTerm: String, tags: [String], location: String, limit: Int, offset: Int): [Post]
  }

  type Mutation {
    # User mutations
    syncUser(input: SyncUserInput!): User!
    # updateUserProfile(input: UpdateUserProfileInput!): User! # TODO: for scalability
    
    # Post mutations
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): ID!
    toggleWantToGo(postId: ID!): Post!
    toggleLike(postId: ID!): Post!
    toggleShare(postId: ID!): Post!
    addTagToPost(postId: ID!, tagName: String!): Post!
    removeTagFromPost(postId: ID!, tagName: String!): Post!
  }
`;

module.exports = typeDefs;
