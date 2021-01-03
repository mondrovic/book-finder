import gql from "graphql-tag";

export const ME = gql`
  query me {
    _id
    username
    email
    bookCount
    savedBooks {
      title
      description
      title
      image
      link
    }
  }
`;
