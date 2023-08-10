import { currentNumberArray } from "../utils/constants";
import { PubSub } from "graphql-subscriptions";
import { GameOption, GameResult } from "../utils/enums";
import { determineWinner } from "../controllers/gameLogic";
import { Rooms, MakeChoice, User, PlayerChoice } from "../utils/types";
import { withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();

const rooms: Rooms = {};
const players: User[] = [];
const resolvers = {
  Query: {
    currentStatus: (parent: any, args: { roomId: number }) => {
      const currentRoom = rooms[args.roomId];
      if (!currentRoom)
        return {
          error: "Room does not exist",
        };

      if (currentRoom.PlayerChoices.length === 0) {
        return {
          error: "Waiting for players to make a choices",
        };
      } else if (currentRoom.PlayerChoices.length < 2) {
        return {
          roomId: args.roomId,
          playerChoices: rooms[args.roomId].PlayerChoices,
        };
      } else {
        return {
          roomId: args.roomId,
          playerChoices: rooms[args.roomId].PlayerChoices,
          result: determineWinner(rooms[args.roomId].PlayerChoices),
        };
      }
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
        return {
          error: "Room does not exist",
        };
      }

      if (!players.find((player: User) => player.id == playerId)) {
        return {
          error: "Player does not exist",
        };
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
