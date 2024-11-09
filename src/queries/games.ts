import { useQuery } from "@tanstack/react-query";

type Game = {
  players: string[];
  gameId?: string | null | undefined;
};
export type Player = {
  playerId: string;
  username: string;
  color: string;
  icon: string;
};

export const useGame = (id: string) => {
  return useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const res = await fetch("http://localhost:8000/game/" + id, {
        method: "GET",
      });
      const data = await res.json();
      return data as Game;
    },
  });
};
