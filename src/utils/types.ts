import { GameOption } from "./enums";

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

export type RPSOption = {
  name: string;
  winsFrom: string[];
};
