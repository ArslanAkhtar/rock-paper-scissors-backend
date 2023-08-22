import { PubSub } from "graphql-subscriptions";
import { determineWinner } from "../controllers/gameLogic";
import { GraphQLError } from "graphql";
import { randomUUID } from "crypto";
import { Room, MakeChoice, User, PlayerChoice, Payload } from "../utils/types";
import { withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();

const rooms: Room[] = [];
const players: User[] = [];

const resolvers = {
  Query: {
    getAllPlayers: () => players,

    getAllRooms: () => rooms,
  },
  Mutation: {
    registerPlayer: (_: any, data: { playerName: string }) => {
      const id = randomUUID();
      players.push({
        id,
        playerName: data.playerName,
      });
      return {
        id,
        playerName: data.playerName,
      };
    },

    createRoom: (_: any) => {
      const roomId = randomUUID();

      rooms.push({
        roomId,
        users: [],
        games: [
          {
            playerChoices: [],
          },
        ],
      });

      return roomId;
    },

    joinRoom: (_: any, data: { roomId: string; playerId: string }) => {
      const room = rooms.find((room) => room.roomId === data.roomId);

      if (!room) {
        throw new GraphQLError("Room does not exist.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      const player = players.find((player) => player.id === data.playerId);

      if (!player) {
        throw new GraphQLError("Player does not exist.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      if (room.users.length === 2) {
        throw new GraphQLError("Room is full.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      if (room.users.find((user) => user.id === player.id)) {
        throw new GraphQLError("Player already in room.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      room.users.push(player);

      return room;
    },

    makeChoice: (_: any, { roomId, choice, playerId }: MakeChoice) => {
      const room = rooms.find((room) => room.roomId === roomId);

      if (!room) {
        throw new GraphQLError("Room does not exist.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      const player = players.find((player) => player.id === playerId);

      if (!player) {
        throw new GraphQLError("Player does not exist.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      const playerChoice: PlayerChoice = {
        PlayerId: playerId,
        PlayerChoice: choice,
      };

      const currentGameCount =
        room.games !== undefined && room.games.length !== 0
          ? room.games.length - 1
          : 0;

      if (
        room.games[currentGameCount].playerChoices.find(
          (playerChoice) => playerChoice.PlayerId === playerId
        )
      ) {
        throw new GraphQLError("Player already made choice.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      room.games[currentGameCount].playerChoices.push(playerChoice);

      if (
        room.games[currentGameCount].playerChoices.length === room.users.length
      ) {
        const result = determineWinner(
          room.games[currentGameCount].playerChoices
        );

        pubsub.publish("GAME_UPDATE", {
          gameUpdates: {
            roomId,
            users: room.users,
            games: [
              {
                playerChoices: room.games[currentGameCount].playerChoices,
                result,
              },
            ],
          },
        });
      }

      return room;
    },
  },
  Subscription: {
    gameUpdates: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("GAME_UPDATE"),
        (payload: Payload, variables: { roomId: string }) => {
          return payload.gameUpdates.roomId === variables.roomId;
        }
      ),
    },
  },
};

export default resolvers;
