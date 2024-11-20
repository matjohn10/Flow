import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useGame, useGameTest } from "../queries/games";
import { socket } from "../utils/socket";
import {
  FindRankOfPlayer,
  ParseToPlayer,
  textColorFromBGHex,
} from "../utils/helpers";
import { useState } from "react";
import { ShowingContent } from "../utils/types";

function GameEnd() {
  const query = useQueryClient();
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId;

  // TODO: instead of some game attributes, get all of them including content to show
  //const { data } = useGame(roomId ?? "");
  const { data, isLoading } = useGameTest();

  // content, from-username, from-avatar, from-color
  const [playerContentShowing, setPlayerContentShowing] = useState<
    ShowingContent[]
  >([]);
  const [sliceShown, setSliceShown] = useState(0); // until where in playerContentShowing are we rendering

  function isCreator(): boolean {
    return data?.creator === (localStorage.getItem("user-id") ?? "-1");
  }

  function getFullPlayerTelestration(playerRank: number) {
    if (!data) return;

    const gameData: ShowingContent[] = [];
    for (let i = 1; i < data.round; i++) {
      const index = i % 2 !== 0 ? Math.floor(i / 2) : i / 2 - 1;
      const step = i % 2 !== 0 ? "guesses" : "drawings";
      const fromRank = (playerRank + i - 1) % data.players.length;
      const content = data.content[fromRank][step][index];
      const player = ParseToPlayer(data.players[fromRank]);
      gameData.push({ content, from: player });
    }
    setPlayerContentShowing(gameData);
  }

  function handlePlayer(playerId: string) {
    if (!data) return;
    console.log("TODO");
    const rank = FindRankOfPlayer(data.players, playerId);
    getFullPlayerTelestration(rank);
  }
  console.log(playerContentShowing);
  // TODO: End game layout for player, for creator
  // Show the flow of the players' words/drawings/guesses (creator controls)
  return (
    <div className="relative flex flex-col w-full h-full items-center p-20 gap-3">
      <div
        className="absolute w-10 h-10 left-10 hover:cursor-pointer"
        onClick={() => {
          socket.emit("player-out", roomId);
          navigate("/");
        }}
      >
        Leave
      </div>
      <h1 className="text-4xl font-bold">Game Room ({roomId})</h1>
      <div className="w-full border-[1px] border-gray-100 my-4" />
      <div className="flex w-2/3 h-full border-2 border-gray-50 rounded-lg">
        <div className="flex flex-col gap-2 p-4 w-1/3 border-r-2 border-gray-50">
          {!data || isLoading ? (
            <p>Loading...</p>
          ) : (
            data.players.map((pS) => {
              const player = ParseToPlayer(pS);
              return (
                <div
                  key={player.playerId}
                  style={{ backgroundColor: player.color }}
                  className="flex w-full items-center gap-4 rounded p-2 overflow-scroll"
                  onClick={() =>
                    isCreator() ? handlePlayer(player.playerId) : null
                  }
                >
                  <img
                    src={`/avatars/${player.icon}.png`}
                    alt={player.icon}
                    className="w-10 h-10"
                  />
                  <h2 style={{ color: textColorFromBGHex(player.color) }}>
                    {player.username}
                  </h2>
                </div>
              );
            })
          )}
        </div>
        <div className="flex flex-col gap-2 p-4 w-2/3 items-center overflow-scroll">
          {playerContentShowing.length === 0 ? (
            <p>Select a player...</p>
          ) : (
            playerContentShowing.slice(sliceShown).map((c, i) =>
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
                  className="relative flex w-full items-center justify-start"
                >
                  <img
                    src={c.content}
                    alt="Drawing"
                    className="w-1/2 rounded object-cover"
                  />
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
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default GameEnd;
