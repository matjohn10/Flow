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

export const FindRankOfPlayer = (playerS: string[], id: string): number => {
  for (let i = 0; i < playerS.length; i++) {
    const player = ParseToPlayer(playerS[i]);
    if (player.playerId === id) return i;
  }
  return -1;
};
