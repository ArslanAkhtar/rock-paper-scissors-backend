import { GameOption, GameResult } from "../utils/enums";

export const determineWinner = (
  playerOneChoice: GameOption,
  playerTwoChoice: GameOption
): GameResult => {
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
