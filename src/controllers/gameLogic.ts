import { GameOption, GameResult } from "../utils/enums";
import { PlayerChoice } from "../utils/types";

export const determineWinner = (playerChoices: PlayerChoice[]): GameResult => {
  if (!playerChoices[0].PlayerChoice || !playerChoices[1].PlayerChoice) {
    return GameResult.NO_RESULT;
  }
  const playerOneChoice = playerChoices[0].PlayerChoice;
  const playerTwoChoice = playerChoices[1].PlayerChoice;

  if (!playerOneChoice || !playerTwoChoice) {
    return GameResult.NO_RESULT;
  }
  if (playerOneChoice === playerTwoChoice) {
    return GameResult.DRAW;
  }

  if (
    (playerOneChoice === GameOption.ROCK &&
      playerTwoChoice === GameOption.SCISSORS) ||
    (playerOneChoice === GameOption.PAPER &&
      playerTwoChoice === GameOption.ROCK) ||
    (playerOneChoice === GameOption.SCISSORS &&
      playerTwoChoice === GameOption.PAPER)
  ) {
    return GameResult.PLAYER_ONE_WINS;
  }

  return GameResult.PLAYER_TWO_WINS;
};
