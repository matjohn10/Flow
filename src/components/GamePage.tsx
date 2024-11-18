import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAddDrawing, useAddEntry, useGame } from "../queries/games";
import { useEffect, useRef, useState } from "react";
import { FindRankOfPlayer, isDrawingRound } from "../utils/helpers";
import { socket } from "../utils/socket";
import DevButton from "./DevButton";
import DrawingBoard from "./DrawingBoard";
import { DrawStep } from "../utils/types";

// TODO: Make a useContext for the game stuff (canvas, ctx, ref, game object, etc)
function GamePage() {
  const query = useQueryClient();
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId;
  const { data } = useGame(roomId ?? "");
  const { mutateAsync: addEntry, isPending } = useAddEntry();
  const { mutateAsync: addDrawing, isPending: isDrawingPending } =
    useAddDrawing();

  const ref = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [drawingStack, setDrawingStack] = useState<DrawStep[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(
    ((4 / 3) * window.innerHeight * 2) / 3
  );
  const [canvasHeight, setCanvasHeight] = useState(
    (window.innerHeight * 2) / 3
  );

  const [entryCount, setEntryCount] = useState(0);
  const [entry, setEntry] = useState("");
  const [entrySent, setEntrySent] = useState(false);
  const [drawingToGuess, setDrawingToGuess] = useState<string | null>(null);
  const handleEntrySubmit = async () => {
    if (!data) return;

    await addEntry({
      entry,
      rank: FindRankOfPlayer(
        data.players,
        localStorage.getItem("user-id") ?? "-1"
      ),
      roomId: roomId ?? "",
    });
    // tell others you have done your initial entry
    socket.emit("init-entry", roomId, "guesses");
    setEntrySent(true);
    setEntry("");
    setDrawingToGuess(null);
  };
  const handleDrawingSubmit = async () => {
    if (!data || !ref.current) return;
    const imgUrl = ref.current.toDataURL();
    await addDrawing({
      drawing: imgUrl,
      rank: FindRankOfPlayer(
        data.players,
        localStorage.getItem("user-id") ?? "-1"
      ),
      roomId: roomId ?? "",
    });
    socket.emit("init-entry", roomId, "drawings");
    setEntrySent(true);
    setDrawingStack([]);
    setDrawingToGuess(null);
  };

  useEffect(() => {
    socket.on("num-entry", (num: number) => {
      setEntryCount((prev) => Math.max(prev, num));
      if (Math.max(entryCount, num) >= (data?.players.length ?? 1000)) {
        // send to server that this and all players are ready, server will respond individually with content
        socket.emit("ready", roomId, data?.round ?? 0);
      }
    });
    socket.on("round-update", async () => {
      await query.invalidateQueries({ queryKey: ["game", roomId] });
    });
    socket.on("player-out", async () => {
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      navigate("/game");
    });
    socket.on("round-content", async (contentS: string) => {
      // Socket starting the round (drawing/guess)
      // TODO: start timer
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      const content = JSON.parse(contentS) as {
        content: string;
        kind: "drawings" | "guesses";
      };

      if (content.kind === "drawings") {
        setDrawingToGuess(content.content);
      } else {
        setDrawingStack([]);
        setEntry(content.content);
      }
      setEntrySent(false);
      setEntryCount(0);
    });

    return () => {
      socket.off("num-entry");
      socket.off("round-update");
      socket.off("round-content");
      socket.off("player-out");
    };
  }, [ctx]);

  // END GAME
  useEffect(() => {
    if (data && data.players.length < data.round) {
      console.log("GAME IS DONE");
      navigate(`/game-time/${roomId}/end`);
    }
  }, [data?.round]);

  useEffect(() => {
    if (ref.current) {
      const context = ref.current.getContext("2d");
      if (context && !drawingToGuess) {
        setCtx(context);
      }
    }
  }, [ref, drawingToGuess]);

  return (
    <div className="relative flex flex-col w-full h-full">
      <DevButton
        className="absolute top-4 left-4 bg-gray-50 text-black"
        text="Menu"
        func={() => navigate("/game")}
      />
      <div className="flex flex-col w-full h-full items-center justify-center gap-2">
        <div className="flex w-full justify-center items-center gap-4">
          <h1 className="font-semibold text-4xl">Round {data?.round ?? 0}</h1>
          <h2 className="font-semibold text-xl">
            ({entryCount}/{data?.players.length ?? 0} players)
          </h2>
        </div>

        <DrawingBoard
          refC={ref}
          ctx={ctx}
          width={canvasWidth}
          height={canvasHeight}
          setWidth={setCanvasWidth}
          setHeight={setCanvasHeight}
          round={data?.round}
          drawingStack={drawingStack}
          setDrawingStack={setDrawingStack}
          drawingToGuess={drawingToGuess}
        />

        <div className="flex w-full justify-center items-center gap-4">
          <input
            className="font-semibold text-lg bg-gray-50 text-black p-2 rounded-lg w-1/3"
            maxLength={36}
            placeholder="Write word/guess here..."
            disabled={!data || isDrawingRound(data.round)}
            type="text"
            value={entry}
            onChange={(e) => setEntry(e.currentTarget.value)}
          />
          {isDrawingRound(data?.round) ? (
            <button
              className="font-semibold text-lg bg-gray-50 text-black px-4 py-2 rounded"
              disabled={!data}
              onClick={handleDrawingSubmit}
            >
              {!entrySent
                ? isDrawingPending
                  ? "Saving..."
                  : "Submit Drawing"
                : "Done!"}
            </button>
          ) : (
            <button
              className="font-semibold text-lg bg-gray-50 text-black px-4 py-2 rounded"
              onClick={handleEntrySubmit}
              disabled={!data}
            >
              {!entrySent ? (isPending ? "Saving..." : "Submit") : "Done!"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
