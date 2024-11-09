import { Player } from "../queries/games";

export const AddPlayerIfNew = (player: Player, arr: Player[]): Player[] => {
  const found = arr.find((p) => p.playerId === player.playerId);
  if (!found) {
    return [...arr, player];
  }
  return [...arr];
};

export const ParseToPlayer = (player: string): Player => {
  return JSON.parse(player) as Player;
};
