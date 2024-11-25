import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SERVER =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:8000"
    : "https://flow-server-ap58.onrender.com";

type Game = {
  players: string[];
  creator: string;
  round: number;
  status: "wait" | "play" | "end";
  gameId?: string | null | undefined;
};

type FullGame = Game & {
  content: {
    guesses: string[];
    drawings: string[];
  }[];
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
      const res = await fetch(SERVER + "/game/" + id, {
        method: "GET",
      });
      const data = await res.json();
      return data as Game;
    },
  });
};

export const useFullGame = (id: string) => {
  return useQuery({
    queryKey: ["game", "full", id],
    queryFn: async () => {
      const res = await fetch(SERVER + "/game/full/" + id, {
        method: "GET",
      });
      const data = await res.json();
      return data as FullGame;
    },
  });
};

export const useCheckGame = (id: string, player: string, active: boolean) => {
  return useQuery({
    queryKey: ["game", id, "check", player],
    queryFn: async () => {
      const res = await fetch(SERVER + "/game/check/" + id + "/" + player, {
        method: "GET",
      });
      const data = await res.json();
      return data as { status: boolean };
    },
    enabled: active,
  });
};

export const useGameTest = () => {
  return useQuery({
    queryKey: ["game-test"],
    queryFn: async () => {
      const res = await fetch(SERVER + "/tests/game", {
        method: "GET",
      });
      const data = await res.json();
      return data as FullGame;
    },
  });
};

export const useAddEntry = () => {
  const query = useQueryClient();
  return useMutation({
    async mutationFn(data: { entry: string; rank: number; roomId: string }) {
      await fetch(SERVER + "/game/entry/" + data.roomId, {
        method: "POST",
        body: JSON.stringify({ entry: data.entry, rank: data.rank }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    async onSuccess(_, data) {
      await query.invalidateQueries({ queryKey: ["game", data.roomId] });
    },
  });
};

export const useAddDrawing = () => {
  const query = useQueryClient();
  return useMutation({
    async mutationFn(data: { drawing: string; rank: number; roomId: string }) {
      await fetch(SERVER + "/game/drawing/" + data.roomId, {
        method: "POST",
        body: JSON.stringify({ entry: data.drawing, rank: data.rank }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    async onSuccess(_, data) {
      await query.invalidateQueries({ queryKey: ["game", data.roomId] });
    },
  });
};
