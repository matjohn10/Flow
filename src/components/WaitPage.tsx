import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import { useGame } from "../queries/games";
import { useQueryClient } from "@tanstack/react-query";
import { ParseToPlayer } from "../utils/helpers";
import PlayerCard from "./PlayerCard";
import { ArrowBigLeft } from "lucide-react";

const TestPlayers = [
  {
    playerId: "3f7bd706-07c4-44a8-b5e9-f0efe89f1be0",
    username: "mat10",
    color: "#6f8768",
    icon: "cat",
  },
  {
    playerId: "3f7bd706-07c5-44a8-b5e9-f0efe89f1be0",
    username: "jb123",
    color: "#8b1760",
    icon: "lion",
  },
  {
    playerId: "3f7bd706-07c6-44a8-b5e9-f0efe89f1be0",
    username: "m12",
    color: "#4c8750",
    icon: "horse",
  },
  {
    playerId: "3f7bd706-07c7-44a8-b5e9-f0efe89f1be0",
    username: "t123",
    color: "#7b8760",
    icon: "tiger",
  },
  {
    playerId: "3f7bd706-07c8-44a8-b5e9-f0efe89f1be0",
    username: "m0",
    color: "#1b8760",
    icon: "bunny",
  },
  {
    playerId: "3f7bd706-07c9-44a8-b5e9-f0efe89f1be0",
    username: "t10",
    color: "#ff8710",
    icon: "elephant",
  },
  {
    playerId: "3f7bd706-07c1-44a8-b5e9-f0efe89f1be0",
    username: "10",
    color: "#db8d60",
    icon: "cat",
  },
  {
    playerId: "3f7bd706-07c2-44a8-b5e9-f0efe89f1be0",
    username: "liam99",
    color: "#eb8a69",
    icon: "unicorn",
  },
];

function WaitPage() {
  const query = useQueryClient();
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId;
  const { data } = useGame(roomId ?? "");

  useEffect(() => {
    // listens to get room-id after creation
    socket.on("room-in", async (playerString: string) => {
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      console.log(playerString);
    });
    socket.on("room-off", async () => {
      console.log("Emit to leave current room.");
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      navigate("/game");
    });
    socket.on("player-out", async () => {
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      navigate(0);
    });
    socket.on("game-started", () => {
      navigate(`/game-time/${roomId}/play`);
    });
  }, []);

  function isCreator(): boolean {
    return data?.creator === (localStorage.getItem("user-id") ?? "-1");
  }

  function handleStartGame() {
    console.log("Start Game");
    navigate(`/game-time/${roomId}/play`);
    socket.emit("game-started", roomId);
  }
  return (
    <div className="relative flex flex-col w-full h-full items-center p-20 gap-3">
      <div
        className="absolute w-10 h-10 left-10 hover:cursor-pointer"
        onClick={() => {
          socket.emit("player-out", roomId);
          navigate("/");
        }}
      >
        <ArrowBigLeft color="white" className="w-12 h-10" />
      </div>
      <h1 className="text-2xl md:text-4xl font-bold">Game Room ({roomId})</h1>
      {!data ? (
        <p className="text-xl md:text-3xl font-bold">Disconnected</p>
      ) : (
        <>
          <p className="text-sm">
            Players ready to play (min 4): {data?.players.length ?? 0}/8
          </p>
          <div className="flex flex-wrap justify-center w-4/5 md:w-1/2 gap-1">
            {/* TODO: Set back real players */}
            {TestPlayers.map((c) => {
              //data?.players
              const p = c; //ParseToPlayer(c);
              return <PlayerCard player={p} key={p.playerId} />;
            })}
          </div>
          {isCreator() ? (
            <button
              onClick={handleStartGame}
              //TODO: Re-enable disabling of button
              //disabled={(data?.players.length ?? 0) < 4}
              className="bg-gray-50 rounded mt-4 px-4 py-2 flex items-center justify-center text-black font-semibold hover:opacity-80 hover:cursor-pointer active:opacity-20 disabled:hover:opacity-90 disabled:cursor-default disabled:opacity-90"
            >
              Start Game
            </button>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}

export default WaitPage;
