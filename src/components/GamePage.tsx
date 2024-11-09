import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import { Player, useGame } from "../queries/games";
import { useQueryClient } from "@tanstack/react-query";
import { ParseToPlayer } from "../utils/helpers";

function GamePage() {
  const query = useQueryClient();
  const params = useParams();
  const roomId = params.roomId;
  const { data } = useGame(roomId ?? "");

  useEffect(() => {
    // listens to get room-id after creation
    socket.on("room-in", async (playerString: string) => {
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      console.log(playerString);
    });
  }, []);
  console.log(data);
  return (
    <div className="flex flex-col w-full h-full items-center p-20 gap-5">
      <h1 className="text-4xl font-bold">{roomId}</h1>
      {data?.players.map((c) => {
        const p = ParseToPlayer(c);
        return (
          <div
            className={`flex flex-col items-center bg-[${p.color}]`}
            key={p.playerId}
          >
            <img
              src={`/avatars/${p.icon}.png`}
              alt={p.icon}
              className="w-12 h-12"
            />
            <h3>{p.username}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default GamePage;
