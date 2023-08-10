const typeDefs = `#graphql

type Query {
  currentStatus(roomId: ID!): GameUpdate
}


type GameUpdate {
  playerChoices: [PlayerChoice]
  roomId: ID
  result: String
}

type PlayerChoice {
  PlayerId: Int
  PlayerChoice: String
}

type Rooms {
  playerChoices: [PlayerChoice]
}



type Mutation {
  createRoom(roomId: ID!): Boolean
  makeChoice(roomId: ID!, choice: String!, playerId: Int!): Rooms
  registerPlayer(playerId: ID!, playerName: String!): String!
  resetGame(roomId: ID!): Boolean
}

type Subscription {
  gameUpdates(roomId: ID!): GameUpdate
}
`;

export default typeDefs;
