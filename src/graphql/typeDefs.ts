const typeDefs = `#graphql
  type Query {
    currentNumberArray: [Int!]!
  }

  type Subscription {
    numberIncremented: [Int!]!
  }
`;

export default typeDefs;
