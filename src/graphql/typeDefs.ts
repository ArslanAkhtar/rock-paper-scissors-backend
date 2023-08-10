const typeDefs = `#graphql

type Query {
  currentStatus(roomId: ID!): GameUpdate
}


type GameUpdate {
  error: String
  playerChoices: [PlayerChoice]
  roomId: ID
  result: String
}

type PlayerChoice {
  PlayerId: Int
  PlayerChoice: String
}

type Rooms {
  error: String
  playerChoices: [PlayerChoice]
}



type Mutation {
  createRoom(roomId: ID!): Boolean
  makeChoice(roomId: ID!, choice: String!, playerId: Int!): Rooms
  registerPlayer(playerId: ID!, playerName: String!): String!
}

type Subscription {
  gameUpdates(roomId: ID!): String!
}
`;

export default typeDefs;
