import { PubSub } from "graphql-subscriptions";
import { determineWinner } from "../controllers/gameLogic";
import { GraphQLError } from "graphql";

import {
  Rooms,
  MakeChoice,
  User,
  PlayerChoice,
  CurrentStatus,
} from "../utils/types";
import { withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();

const rooms: Rooms = {};
const players: User[] = [];
const resolvers = {
  Query: {
    currentStatus: (parent: any, args: { roomId: number }) => {
      const currentRoom = rooms[args.roomId];

      if (!currentRoom) {
        throw new GraphQLError("Room does not exist.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      const { PlayerChoices } = currentRoom;

      if (PlayerChoices.length === 0) {
        throw new GraphQLError("Waiting for players to make choices", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      const statusResponse: CurrentStatus = {
        roomId: args.roomId,
        playerChoices: PlayerChoices,
      };

      if (PlayerChoices.length >= 2) {
        statusResponse.result = determineWinner(PlayerChoices);
      }

      return statusResponse;
    },
  },
  Mutation: {
    registerPlayer: (
      _: any,
      data: { playerId: number; playerName: string }
    ) => {
      if (players.find((player) => player.id === data.playerId)) {
        return "User already exists";
      } else {
        players.push({
          id: data.playerId as number,
          playerName: data.playerName,
        });
        return "User registered";
      }
    },
    createRoom: (_: any, data: { roomId: number }) => {
      if (!rooms[data.roomId]) {
        rooms[data.roomId] = {
          PlayerChoices: [],
        };
        return true;
      }
      return false;
    },
    makeChoice: (_: any, { roomId, choice, playerId }: MakeChoice) => {
      if (!rooms[roomId]) {
        throw new GraphQLError("Room does not exist.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      if (!players.find((player: User) => player.id == playerId)) {
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
      if (!rooms[roomId].PlayerChoices.includes(playerChoice)) {
        rooms[roomId].PlayerChoices.push(playerChoice);
      }

      if (rooms[roomId].PlayerChoices.length === 2) {
        const winner = determineWinner(rooms[roomId].PlayerChoices);
        pubsub.publish("GAME_UPDATE", {
          gameUpdates: {
            roomId,
            playerChoices: rooms[roomId].PlayerChoices,
            winner,
          },
        });
      }

      return {
        playerChoices: rooms[roomId].PlayerChoices,
      };
    },
  },
  Subscription: {
    gameUpdates: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("GAME_UPDATE"),
        (payload: any, variables: any) => {
          return payload.gameUpdates.roomId === variables.roomId;
        }
      ),
    },
  },
};

export default resolvers;
