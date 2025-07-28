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
    imageUrls: ImageUrls
    createdAt: Date
    author: AuthorInfo
    rating: Rating
    attendees: [AttendeeInfo]
    attendeeCount: Int
    isWantToGo: Boolean
    likes: [AuthorInfo]
    likeCount: Int
    shareCount: Int
    isLiked: Boolean
    tags: [Tag]
    isOwner: Boolean
  }

  type PostsResult {
    posts: [Post]
    totalCount: Int
  }

    type ImageUrls {
    desktop: String
    mobile: String
    mobile2x: String
    tablet: String
  }

  type AuthorInfo {
    id: ID!
    displayName: String
    photoURL: String
    firstName: String
    lastName: String
    email: String
  }

  type AttendeeInfo {
    id: ID!
    displayName: String
    photoURL: String
    firstName: String
    lastName: String
  }

  type Rating {
    id: ID!
    score: Float
    type: String
    description: String
  }

  type WantToGo {
    id: ID!
    postId: ID!
    userId: ID!
    post: Post
  }

  type Tag {
    id: ID!
    name: String!
  }

  input ImageUrlsInput {
    desktop: String!
    mobile: String
    mobile2x: String
    tablet: String
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
    imageUrls: ImageUrlsInput
    ratingId: ID!
    tags: [String]  
  }

  input UpdatePostInput {
    title: String
    placeName: String
    content: String
    location: String
    imageUrls: ImageUrlsInput
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
    posts(limit: Int, offset: Int, filter: PostFilter): PostsResult
    post(id: ID!): Post
    myPosts: [Post]
    myWantToGoPosts: [Post]
    searchPostsByTags(tags: [String!]!, limit: Int, offset: Int): [Post]
    basicSearch(searchTerm: String!, limit: Int, offset: Int): [Post]
        
    # Tag queries
    tags: [Tag]
  }

  type Mutation {
    # User mutations
    syncUser(input: SyncUserInput!): User!
    updateUserProfile(input: UpdateUserProfileInput!): User!
    
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
`

module.exports = typeDefs
