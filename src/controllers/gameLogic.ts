import { GameOption, GameResult } from "../utils/enums";
import { PlayerChoice, User, RPSOption } from "../utils/types";

const gameRules: RPSOption[] = [
  { name: GameOption.ROCK, winsFrom: [GameOption.LIZARD, GameOption.SCISSORS] },
  {
    name: GameOption.SCISSORS,
    winsFrom: [GameOption.PAPER, GameOption.LIZARD],
  },
  { name: GameOption.PAPER, winsFrom: [GameOption.ROCK, GameOption.SPOCK] },
  { name: GameOption.LIZARD, winsFrom: [GameOption.SPOCK, GameOption.PAPER] },
  { name: GameOption.SPOCK, winsFrom: [GameOption.SCISSORS, GameOption.ROCK] },
];

export const determineWinner = (
  playerChoices: PlayerChoice[],
  users: User[]
): string => {
  if (!playerChoices[0].PlayerChoice || !playerChoices[1].PlayerChoice) {
    return GameResult.NO_RESULT;
  }

  const usersWithChoices = users.map((user) => {
    const playerChoice = playerChoices.find(
      (playerChoice) => playerChoice.PlayerId === user.id
    );
    const winsFrom = gameRules.find(
      (option) => option.name === playerChoice?.PlayerChoice
    )?.winsFrom;
    return {
      ...user,
      PlayerChoice: playerChoice?.PlayerChoice,
      winsFrom,
    };
  });

  const playerOne = usersWithChoices[0];
  const playerTwo = usersWithChoices[1];

  if (playerOne.PlayerChoice === playerTwo.PlayerChoice) {
    return GameResult.DRAW;
  } else if (
    playerOne.winsFrom?.includes(playerTwo.PlayerChoice as GameOption)
  ) {
    return playerOne.playerName.toUpperCase() + GameResult.PLAYER_WINS;
  } else {
    return playerTwo.playerName.toUpperCase() + GameResult.PLAYER_WINS;
  }
};
