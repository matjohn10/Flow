import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddDrawing,
  useAddEntry,
  useCheckGame,
  useGame,
} from "../queries/games";
import { useEffect, useRef, useState } from "react";
import {
  clearIntervals,
  displayTime,
  FindRankOfPlayer,
  isDrawingRound,
  ratioCanvas,
} from "../utils/helpers";
import { socket } from "../utils/socket";
import DrawingBoard from "./DrawingBoard";
import { DrawStep } from "../utils/types";
import { isMobile } from "react-device-detect";
import { MAX_DRAW, MAX_GUESS } from "../constants";
import { beeping, gamePress, gameSound } from "../utils/sounds";
import { ArrowBigLeft } from "lucide-react";
import Alert from "./Alert";

function GamePage() {
  const query = useQueryClient();
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId;
  const { data, isRefetching } = useGame(roomId ?? "");
  const { mutateAsync: addEntry, isPending } = useAddEntry();
  const { mutateAsync: addDrawing, isPending: isDrawingPending } =
    useAddDrawing();

  const [active, setActive] = useState(false);
  const { data: isGame } = useCheckGame(
    roomId ?? "",
    localStorage.getItem("user-id") ?? "",
    active
  );
  useEffect(() => {
    setTimeout(() => {
      setActive(true);
    }, 250);
  }, []);
  useEffect(() => {
    if (isGame && !isGame.status) {
      //clear timer
      const currTimer = localStorage.getItem("timer");
      if (!!currTimer) {
        clearInterval(Number(currTimer));
        setTimer(0);
      }
      gameSound.stop();
      navigate("/");
    }
  }, [isGame]);

  const ref = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [drawingStack, setDrawingStack] = useState<DrawStep[]>([]);
  const [timer, setTimer] = useState(0);
  const timerStart = useRef(
    localStorage.getItem("start")
      ? Number(localStorage.getItem("start"))
      : Date.now()
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
    socket.on("round-content", async (contentS: string) => {
      // Socket starting the round (drawing/guess)
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      const content = JSON.parse(contentS) as {
        content: string;
        kind: "drawings" | "guesses";
        time: number;
      };

      // TIMER
      timerStart.current = content.time;
      localStorage.setItem("start", content.time + "");

      if (content.kind === "drawings") {
        setDrawingToGuess(content.content);
      } else {
        setDrawingStack([]);
        setEntry(content.content);
      }
      setEntrySent(false);
      setEntryCount(0);

      gamePress.play();
    });
    socket.on("room-off", async () => {
      console.log("Emit to leave current game.");
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      socket.emit("player-out", roomId);
      localStorage.removeItem("start");
      navigate("/game");
    });

    return () => {
      socket.off("num-entry");
      socket.off("round-update");
      socket.off("round-content");
      socket.off("room-off");
    };
  }, [ctx]);

  function getRoundTime(): number {
    return (data?.round ?? 0) % 2 === 0 ? MAX_DRAW : MAX_GUESS;
  }
  function isCreator(): boolean {
    return data?.creator === (localStorage.getItem("user-id") ?? "-1");
  }

  // END GAME
  useEffect(() => {
    if (data && data.players.length < data.round) {
      console.log("GAME IS DONE");
      //clear timer
      const currTimer = localStorage.getItem("timer");
      if (!!currTimer) {
        clearInterval(Number(currTimer));
        setTimer(0);
      }
      beeping.stop();
      localStorage.removeItem("start");
      if (isCreator()) socket.emit("game-end", roomId);
      navigate(`/game-time/${roomId}/end`);
    }
  }, [isRefetching]);

  useEffect(() => {
    if (ref.current) {
      const context = ref.current.getContext("2d");
      if (context && !drawingToGuess) {
        setCtx(context);
      }
    }
  }, [ref, drawingToGuess]);

  // TIMER UPDATES
  useEffect(() => {
    if (timer >= getRoundTime()) {
      const inter = Number(localStorage.getItem("timer") ?? "0");
      clearInterval(inter);

      // Send current guess or drawing depending on round
      if (isDrawingRound(data?.round)) {
        handleDrawingSubmit();
      } else {
        handleEntrySubmit();
      }
      console.log("REACHED TIME LIMIT");
    }
  }, [timer]);

  useEffect(() => {
    // start timer !timerRef.current
    const ii = localStorage.getItem("timer");
    if (!!ii) {
      console.log("CLEAR OLD TIMER");
      clearInterval(Number(ii));
      setTimer(0);
    }
    console.log("INIT TIMER");
    localStorage.setItem("start", timerStart.current + "");
    const i = setInterval(() => {
      const diff = (Date.now() - timerStart.current) / 1000;
      setTimer(Math.floor(diff));
      if (getRoundTime() - Math.floor(diff) <= 10) beeping.play();
    }, 1000);
    localStorage.setItem("timer", i + "");
  }, [timerStart.current]);

  return (
    <div
      style={{ position: "fixed" }}
      className="relative flex flex-col w-full h-full overflow-hidden overflow-x-hidden"
    >
      <Alert
        className="absolute w-10 h-10 top-12 left-10"
        title="Are you sure?"
        text="Quiting will delete the game for everyone."
        trigger={<ArrowBigLeft color="white" className="w-12 h-10" />}
        action={() => {
          socket.emit("player-out", roomId);
          gameSound.stop();
          clearIntervals();
          localStorage.removeItem("start");
          navigate("/");
        }}
      />
      {isMobile && innerWidth > 500 ? (
        <div className="w-full h-full flex justify-center items-center text-4xl font-bold">
          Cannot use landscape mode.
        </div>
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-center gap-2">
          <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-4 mb-6 lg:mb-0 px-4">
            <h1 className="font-semibold text-4xl">Round {data?.round ?? 0}</h1>
            <h2 className="hidden lg:block font-semibold text-xl">
              ({entryCount}/{data?.players.length ?? 0} players)
            </h2>
            <p
              style={{
                color: getRoundTime() - timer < 10 ? "#b9466c" : "#ffffffde",
              }}
              className="font-semibold text-3xl p-0 m-0"
            >
              {displayTime(getRoundTime() - timer)}
            </p>
          </div>

          <DrawingBoard
            refC={ref}
            ctx={ctx}
            width={
              isMobile
                ? window.innerWidth
                : window.innerWidth > 2000
                ? window.innerWidth / 2.5
                : window.innerWidth / 2
            }
            height={ratioCanvas(
              isMobile
                ? window.innerWidth
                : window.innerWidth > 2000
                ? window.innerWidth / 2.5
                : window.innerWidth / 2,
              false
            )}
            round={data?.round}
            drawingStack={drawingStack}
            setDrawingStack={setDrawingStack}
            drawingToGuess={drawingToGuess}
          />

          <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-4 mt-4">
            <input
              className="font-semibold text-lg bg-gray-50 text-black p-2 rounded-lg w-4/5 sm:w-1/3"
              maxLength={36}
              placeholder="Write word/guess here..."
              disabled={!data || isDrawingRound(data.round)}
              type="text"
              value={entry}
              onChange={(e) => setEntry(e.currentTarget.value)}
            />
            {isDrawingRound(data?.round) ? (
              <button
                className="font-semibold text-lg bg-gray-50 text-black px-4 py-2 rounded shadow shadow-gray-800"
                disabled={!data}
                onClick={() => handleDrawingSubmit()}
              >
                {!entrySent
                  ? isDrawingPending
                    ? "Saving..."
                    : "Submit Drawing"
                  : "Done!"}
              </button>
            ) : (
              <button
                className="font-semibold text-lg bg-gray-50 text-black px-4 py-2 rounded shadow shadow-gray-800"
                onClick={() => handleEntrySubmit()}
                disabled={!data || isPending || isDrawingPending}
              >
                {!entrySent ? (isPending ? "Saving..." : "Submit") : "Done!"}
              </button>
            )}
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="absolute -z-40 flex top-0 left-0 w-full h-4/5">
          <img
            className="w-full object-cover rotate-180"
            src="/bg-home.svg"
            alt="svg"
          />
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

export default GamePage;
