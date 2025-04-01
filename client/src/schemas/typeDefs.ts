const typeDefs = `

type Query {
me: User
}

type Mutation {
  login(email: String!, password: String!): Auth!
  addUser(username: String!, email: String!, password: String!): Auth!
  saveBook(author's array: String!, description: String!, title: String!, bookID: String!, image: String, link: String): User!
  removeBook(bookID: String!): User!
}

type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]
    }

type Book {
    bookID: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User!
}
`;

export default typeDefs;