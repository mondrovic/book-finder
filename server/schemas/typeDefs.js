const { gql } = require("apollo-server-express");

/*
Notes
  User is taking in an array of books for "favorites"
  bookId is a string because we're using Google API's id
  Book field authors is an array in case there are multiple options
  Image is a string because it will be linked 
  savedBook is an input type to keep mutation clean. also scales easier
*/
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input savedBook {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: savedBook!): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
