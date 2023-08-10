import { currentNumberArray } from "../utils/constants";
import { PubSub } from "graphql-subscriptions";
import { GameOption, GameResult } from "../utils/enums";
import { determineWinner } from "../controllers/gameLogic";
import { Rooms, MakeChoice } from "../utils/types";
import { withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();

const rooms: Rooms = {};
const resolvers = {
  Query: {
    currentStatus: (parent: any, args: { roomId: number }) => {
      return {
        roomId: args.roomId,
        playerOneChoice: rooms[args.roomId].playerOne,
        playerTwoChoice: rooms[args.roomId].playerTwo,
        result: determineWinner(
          rooms[args.roomId].playerOne as GameOption,
          rooms[args.roomId].playerTwo as GameOption
        ),
      };
    },
  },
  Mutation: {
    createRoom: (_: any, data: { roomId: number }) => {
      if (!rooms[data.roomId]) {
        rooms[data.roomId] = { playerOne: null, playerTwo: null };
        return true;
      }
      return false;
    },
    makeChoice: (_: any, { roomId, choice, playerId }: MakeChoice) => {
      if (!rooms[roomId]) {
        return "Room does not exist";
      }

      if (playerId === 1) {
        rooms[roomId].playerOne = choice;
      } else {
        rooms[roomId].playerTwo = choice;
      }

      const playerOne = rooms[roomId].playerOne;
      const playerTwo = rooms[roomId].playerTwo;

      if (playerOne && playerTwo) {
        const winner = determineWinner(
          playerOne as GameOption,
          playerTwo as GameOption
        );
        pubsub.publish("GAME_UPDATE", {
          gameUpdates: {
            roomId,
            playerOneChoice: rooms[roomId].playerOne,
            playerTwoChoice: rooms[roomId].playerTwo,
            winner,
          },
        });
        return {
          playerOne: rooms[roomId].playerOne,
          playerTwo: rooms[roomId].playerTwo,
        };
      }

      return {
        playerOne: rooms[roomId].playerOne,
        playerTwo: rooms[roomId].playerTwo,
      };
    },
  },
  Subscription: {
    gameUpdates: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("GAME_UPDATE"),
        (payload: any, variables: any) => {
          console.log(payload.gameUpdates.roomId, variables.roomId);
          return payload.gameUpdates.roomId === variables.roomId;
        }
      ),
    },
  },
};

export default resolvers;
