import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import { useCheckGame, useGame } from "../queries/games";
import { useQueryClient } from "@tanstack/react-query";
import { ParseToPlayer } from "../utils/helpers";
import PlayerCard from "./PlayerCard";
import { ArrowBigLeft } from "lucide-react";
import { isMobile } from "react-device-detect";
import { buttonPress, gamePress } from "../utils/sounds";
import { MIN_PLAYERS } from "@/constants";

function WaitPage() {
  const query = useQueryClient();
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId;

  const [active, setActive] = useState(false);
  const { data: isGame } = useCheckGame(
    roomId ?? "",
    localStorage.getItem("user-id") ?? "",
    active
  );
  const { data } = useGame(roomId ?? "");
  useEffect(() => {
    localStorage.removeItem("start");
    setTimeout(() => {
      setActive(true);
    }, 250);
  }, []);
  useEffect(() => {
    if (isGame && !isGame.status) {
      navigate("/");
    }
  }, [isGame]);

  useEffect(() => {
    // listens to get room-id after creation
    socket.on("room-in", async (playerString: string) => {
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      console.log(playerString);
      gamePress.play();
    });
    socket.on("room-off", async () => {
      console.log("Emit to leave current room.");
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      navigate("/game");
    });
    socket.on("player-out", async () => {
      await query.invalidateQueries({ queryKey: ["game", roomId] });
    });
    socket.on("game-started", () => {
      navigate(`/game-time/${roomId}/play`);
    });

    return () => {
      socket.off("room-in");
      socket.off("room-off");
      socket.off("player-out");
      socket.off("game-started");
    };
  }, []);

  function isCreator(): boolean {
    return data?.creator === (localStorage.getItem("user-id") ?? "-1");
  }

  function handleStartGame() {
    navigate(`/game-time/${roomId}/play`);
    socket.emit("game-started", roomId);
  }
  return (
    <div className="relative flex flex-col w-full h-full items-center p-20 gap-3 overflow-hidden">
      <div
        className="absolute w-10 h-10 left-10 hover:cursor-pointer"
        onClick={() => {
          socket.emit("player-out", roomId);
          buttonPress.play();
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
            Players ready to play: {data.players.length ?? 0}/
            {data.players.length > MIN_PLAYERS
              ? data.players.length
              : MIN_PLAYERS}
          </p>
          <div className="flex flex-wrap justify-center w-4/5 md:w-1/2 gap-1">
            {data?.players.map((c) => {
              const p = ParseToPlayer(c);
              return <PlayerCard player={p} key={p.playerId} />;
            })}
          </div>
          {isCreator() ? (
            <button
              onClick={handleStartGame}
              //TODO: Re-enable disabling of button
              //disabled={(data?.players.length ?? 0) < MIN_PLAYERS}
              className="bg-gray-50 rounded mt-4 px-4 py-2 flex items-center justify-center text-black font-semibold hover:opacity-80 hover:cursor-pointer active:opacity-20 disabled:hover:opacity-90 disabled:cursor-default disabled:opacity-90 shadow shadow-gray-800"
            >
              {data.players.length < MIN_PLAYERS
                ? `Missing ${MIN_PLAYERS - data.players.length} players`
                : "Start Game!"}
            </button>
          ) : (
            <></>
          )}
        </>
      )}

      {isMobile ? (
        <div className="absolute -z-40 flex top-0 left-0 w-full h-full">
          <img className="w-full object-cover" src="/bg-home.svg" alt="svg" />
        </div>
      ) : (
        <div
          style={{ width: window.innerWidth, height: window.innerHeight }}
          className="absolute -right-[250px] -z-40 flex justify-center items-center"
        >
          <img className="w-full" src="/bg-home.svg" alt="svg" />
        </div>
      )}
    </div>
  );
}

export default WaitPage;
