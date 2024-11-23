import { useNavigate, useParams } from "react-router-dom";
import { useFullGame, useGameTest } from "../queries/games";
import { socket } from "../utils/socket";
import {
  FindRankOfPlayer,
  ParseToPlayer,
  randomNumber,
  textColorFromBGHex,
} from "../utils/helpers";
import { useEffect, useState } from "react";
import { ShowingContent } from "../utils/types";
import { isMobile } from "react-device-detect";
import { ArrowBigLeft } from "lucide-react";

// TODO: Add check for gameID, it not navigate to home page
function GameEnd() {
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId;

  //const { data, isLoading } = useFullGame(roomId ?? "");
  const { data, isLoading } = useGameTest();

  // content, from-username, from-avatar, from-color
  const [playerContentShowing, setPlayerContentShowing] = useState<
    ShowingContent[]
  >([]);
  const [sliceShown, setSliceShown] = useState(1); // until where in playerContentShowing we are rendering
  const [playersReady, setPlayersReady] = useState(false);

  useEffect(() => {
    socket.on("show-player", (rank: number) => {
      getFullPlayerTelestration(rank);
      setSliceShown(1); // reset sliceshown
    });
    socket.on("show-next", (sliceToShow: number) => {
      setSliceShown(sliceToShow);
    });

    return () => {
      socket.off("show-player");
      socket.off("show-next");
    };
  }, [data]);

  useEffect(() => {
    setTimeout(() => {
      setPlayersReady(true);
    }, 1500);
  }, []);

  function isCreator(): boolean {
    return data?.creator === (localStorage.getItem("user-id") ?? "-1");
  }

  function canPress(): boolean {
    if (!data) return false;
    return isCreator() && playersReady;
  }

  function getFullPlayerTelestration(playerRank: number) {
    if (!data) return;

    const gameData: ShowingContent[] = [];
    for (let i = 1; i < data.round; i++) {
      const index = i % 2 !== 0 ? Math.floor(i / 2) : i / 2 - 1;
      const step = i % 2 !== 0 ? "guesses" : "drawings";
      const fromRank = (playerRank + i - 1) % data.players.length;
      console.log(index, step, fromRank, data.players);
      const content = data.content[fromRank][step][index];
      const player = ParseToPlayer(data.players[fromRank]);
      gameData.push({
        id: Math.floor(randomNumber()),
        content,
        from: player,
      });
    }
    setPlayerContentShowing(gameData);
  }

  function handlePlayer(playerId: string) {
    if (!data) return;
    const rank = FindRankOfPlayer(data.players, playerId);
    setSliceShown(1); // reset sliceshown
    getFullPlayerTelestration(rank);
    socket.emit("show-player", roomId, rank); //emit rank so other players do getFullPlayerTelestration(rank);
  }

  function handleNext() {
    if (!data) return;
    setSliceShown((prev) => prev + 1);
    socket.emit("show-next", roomId, sliceShown + 1);
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
      <h1 className="text-3xl sm:text-6xl font-bold">Game Room ({roomId})</h1>
      <div className="flex flex-col md:flex-row w-full md:w-2/3 min-w-[350px] md:min-w-[725px] h-full border-2 border-gray-900 rounded-lg">
        <div className="flex flex-wrap bg-dark justify-center md:justify-start md:flex-col gap-2 p-4 w-full md:w-1/4 md:border-r-2 md:border-gray-50">
          {isLoading || !data ? (
            <p>No Players</p>
          ) : (
            data.players.map((pS) => {
              const player = ParseToPlayer(pS);
              return (
                <div
                  key={player.playerId}
                  style={{
                    backgroundColor: canPress()
                      ? player.color
                      : isCreator()
                      ? "#555555"
                      : player.color,
                  }}
                  className="flex md:w-full items-center gap-4 rounded p-2 overflow-scroll"
                  onClick={() =>
                    canPress() ? handlePlayer(player.playerId) : () => {}
                  }
                >
                  <img
                    src={`/avatars/${player.icon}.png`}
                    alt={player.icon}
                    className="w-10 h-10"
                  />
                  <h2
                    style={{ color: textColorFromBGHex(player.color) }}
                    className="hidden md:block"
                  >
                    {player.username}
                  </h2>
                </div>
              );
            })
          )}
        </div>
        <div className="flex flex-col gap-2 p-4 w-full md:w-3/4 items-center overflow-scroll md:bg-dark-50">
          {playerContentShowing.length === 0 ? (
            isCreator() ? (
              <p>Select a player...</p>
            ) : (
              <p>Waiting for host</p>
            )
          ) : (
            <>
              {playerContentShowing.slice(0, sliceShown).map((c, i) =>
                i % 2 === 0 ? (
                  <div
                    key={c.content}
                    className="flex w-full items-center justify-end"
                  >
                    <div className="relative w-1/2 font-semibold bg-gray-100 rounded-lg px-2 py-1">
                      <p className="font-semibold text-lg text-black">
                        {c.content}
                      </p>
                      <div
                        style={{ backgroundColor: c.from.color }}
                        className="absolute w-6 h-6 rounded-full overflow-hidden items-center justify-center -top-2 -right-2 z-10"
                      >
                        <img
                          src={`/avatars/${c.from.icon}.png`}
                          alt={c.from.icon}
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={c.from.playerId}
                    className="relative flex w-full items-center justify-star"
                  >
                    <div className="w-1/2 bg-gray-50 rounded">
                      <img
                        src={c.content}
                        alt="Drawing"
                        className="w-full rounded object-cover"
                      />
                    </div>
                    <div
                      style={{ backgroundColor: c.from.color }}
                      className="absolute w-6 h-6 rounded-full overflow-hidden items-center justify-center -top-2 -left-2 z-10"
                    >
                      <img
                        src={`/avatars/${c.from.icon}.png`}
                        alt={c.from.icon}
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                )
              )}
              {sliceShown === data?.players.length ? (
                <></>
              ) : sliceShown % 2 === 0 ? (
                <div
                  className="flex w-full items-center justify-end"
                  onClick={canPress() ? handleNext : () => {}}
                >
                  <div className="px-3 py-1 bg-gray-50 text-black font-semibold rounded">
                    Show
                  </div>
                </div>
              ) : (
                <div
                  className="flex w-full items-center justify-start"
                  onClick={canPress() ? handleNext : () => {}}
                >
                  <div className="px-3 py-1 bg-gray-50 text-black font-semibold rounded">
                    Show
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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

export default GameEnd;
