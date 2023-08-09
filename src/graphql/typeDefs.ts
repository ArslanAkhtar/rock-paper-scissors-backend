import { GameOption, GameResult } from "../utils/enums";

const typeDefs = `#graphql

type Query {
  currentStatus(roomId: ID!): GameUpdate!
}


type GameUpdate {
  roomId: Int!
  playerOneChoice: String!
  playerTwoChoice: String!
  result: String!
}

type Mutation {
  createRoom(roomId: ID!): Boolean
  makeChoice(roomId: ID!, choice: String!, playerId: Int!): String!
}

type Subscription {
  gameUpdates(roomId: ID!): String!
}
`;

export default typeDefs;
