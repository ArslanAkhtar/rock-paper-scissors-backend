const typeDefs = `#graphql

type Query {
  getAllPlayers: [player]
  getAllRooms: [Room]
}

type Mutation {
  registerPlayer(playerName: String!): player!
  createRoom: String
  joinRoom(roomId: String!, playerId: String!): Room
  makeChoice(roomId: String!, playerId: String!, choice: String!): Room
}

type player {
  id: String
  playerName: String
}

type Subscription {
  gameUpdates(roomId: ID!): String
}

type Room {
  roomId: ID!
  users: [player]
  games: [Game]
}

type Game {
  playerChoices: [PlayerChoice]
  result: String
}

type PlayerChoice {
  PlayerId: ID!
  PlayerChoice: String
}

`;

export default typeDefs;
