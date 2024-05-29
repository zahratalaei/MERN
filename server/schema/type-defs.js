const typeDefs =`
type Post {
     id: ID!
     title:String!
     body: String!
     createdAt: String!
     username: String!
     comments: [Comment]!
     likes: [Like]!
     likeCount: Int!
     commentCount: Int!
   }
type Comment {
     id: ID!
     createdAt: String!
     commenter: String!
     body:String!
}
type Like {
     id: ID!
     createdAt:String!
     username:String!
}

type User {
     id: ID!
     email:String!
     token:String!
     username:String!
     createdAt:String!
}

type Query {
     posts:[Post]
     post(postId: ID!):Post
}

input CreateUserInput {
     username:String!
     password:String!
     confirmPassword:String!
     email:String!
}
input LoginInput {
     username:String!
     password:String!
}
input CreatePostInput {
     title:String!
     body:String!
}

type Mutation {
     createUser(input: CreateUserInput!): User!
     login(input:LoginInput!): User!
     createPost(input: CreatePostInput!): Post!
}
`
export default typeDefs