import { GameOption } from "./enums";

export type Rooms = {
  [key: number]: {
    PlayerChoices: { PlayerId: number; PlayerChoice: GameOption }[];
  };
};

export type MakeChoice = {
  roomId: number;
  choice: GameOption;
  playerId: number;
};

export type User = {
  id: number;
  playerName: string;
};

export type PlayerChoice = { PlayerId: number; PlayerChoice: GameOption };

export type CurrentStatus = {
  error?: string;
  playerChoices?: PlayerChoice[];
  roomId?: number;
  result?: string;
};
