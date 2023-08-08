import { GameOption, GameResult } from "../utils/enums";

interface GameUpdate {
  roomId: number;
  playerOneChoice: string;
  playerTwoChoice: string;
  winner: string;
}

const typeDefs = `#graphql
  type Query {
    currentStatus(roomId: ID!): String!
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
