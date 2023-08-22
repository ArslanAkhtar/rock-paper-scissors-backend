import { PubSub } from "graphql-subscriptions";
import { determineWinner } from "../controllers/gameLogic";
import { GraphQLError } from "graphql";
import { randomUUID } from "crypto";
import {
  Room,
  MakeChoice,
  User,
  PlayerChoice,
  Game,
  CurrentStatus,
  Payload,
} from "../utils/types";
import { withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();

const rooms: Room[] = [];
const players: User[] = [];

const resolvers = {
  Query: {
    getAllPlayers: () => {
      return players;
    },

    getAllRooms: () => {
      return rooms;
    },
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
        games: [],
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

      if (room.games.length == 0) {
        room.games.push({
          playerChoices: [playerChoice],
        });
      } else {
        room.games[room.games.length - 1].playerChoices.push(playerChoice);
      }

      console.log(
        " game.playerChoices.length",
        room.games[room.games.length - 1].playerChoices.length
      );
      console.log(" room.users.length", room.users.length);

      if (
        room.games[room.games.length - 1].playerChoices.length ===
        room.users.length
      ) {
        console.log(
          "game.playerChoices",
          room.games[room.games.length - 1].playerChoices
        );

        const result = determineWinner(
          room.games[room.games.length - 1].playerChoices
        );
        pubsub.publish("GAME_UPDATE", {
          gameUpdates: {
            roomId,
            playerChoices: room.games[room.games.length - 1].playerChoices,
            result,
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
