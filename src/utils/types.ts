import { GameOption } from "./enums";

export type Rooms = {
  [key: number]: {
    playerOne: GameOption | null;
    playerTwo: GameOption | null;
  };
};

export type MakeChoice = {
  roomId: number;
  choice: GameOption;
  playerId: number;
};
