import { GameOption } from "./enums";

// export type Rooms = {
//   [key: number]: {
//     PlayerChoices: { PlayerId: number; PlayerChoice: GameOption }[];
//   };
// };

export type Room = {
  roomId: string;
  users: User[];
  games: Game[];
};

export type User = {
  id: string;
  playerName: string;
};

export type Game = {
  playerChoices: PlayerChoice[];
  result?: string;
};

export type MakeChoice = {
  roomId: string;
  choice: GameOption;
  playerId: string;
};

export type PlayerChoice = { PlayerId: string; PlayerChoice: GameOption };

export type CurrentStatus = {
  playerChoices?: PlayerChoice[];
  roomId?: string;
  result?: string;
};

export type Payload = {
  gameUpdates: CurrentStatus;
};
