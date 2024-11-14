import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAddEntry, useGame } from "../queries/games";
import { useEffect, useState } from "react";
import { FindRankOfPlayer } from "../utils/helpers";
import { socket } from "../utils/socket";
import DevButton from "./DevButton";
import DrawingBoard from "./DrawingBoard";

function GamePage() {
  const query = useQueryClient();
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId;
  const { data } = useGame(roomId ?? "");
  const { mutateAsync: addEntry, isPending } = useAddEntry();

  const [entryCount, setEntryCount] = useState(0);
  const [entry, setEntry] = useState("");
  const [entrySent, setEntrySent] = useState(false);
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
    socket.emit("init-entry", roomId);
    setEntrySent(true);
  };
  // function isCreator(): boolean {
  //   return data?.creator === (localStorage.getItem("user-id") ?? "-1");
  // }

  const [testContent, setTestContent] = useState("");
  useEffect(() => {
    socket.on("start-drawing", (word: string) => {
      console.log("WORD TO DRAW:", word);
    });
    socket.on("num-entry", (num: number) => {
      setEntryCount((prev) => Math.max(prev, num));
      //console.log("ENTRY_COUNT:", Math.max(entryCount, num));
      if (Math.max(entryCount, num) >= (data?.players.length ?? 1000)) {
        // send to server that this and all players are ready, server will respond individually with content
        console.log("USER READY:", localStorage.getItem("user-id"));
        socket.emit("ready", roomId, data?.round ?? 0);
      }
    });
    socket.on("round-content", async (contentS: string) => {
      await query.invalidateQueries({ queryKey: ["game", roomId] });
      const content = JSON.parse(contentS) as {
        content: string;
        kind: "draw" | "guess";
      };
      console.log(content);
      setTestContent(contentS);
      // TODO: Make current page the drawing and guessing page, just disable stuff when not used
      // TODO: get content and show on screen (guess to top of canvas with empty canvas, drawing in canvas with input for guess)
    });
  }, []);

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

        <DrawingBoard />

        <div className="flex w-full justify-center items-center gap-4">
          <input
            className="font-semibold text-lg bg-gray-50 text-black p-2 rounded-lg w-1/3"
            maxLength={36}
            placeholder="Write word/guess here..."
            disabled={!data || data.round % 2 === 0}
            type="text"
            value={entry}
            onChange={(e) => setEntry(e.currentTarget.value)}
          />
          <button
            onClick={handleEntrySubmit}
            disabled={!data || entrySent}
            className="font-semibold text-lg bg-gray-50 text-black px-4 py-2 rounded"
          >
            {!entrySent ? (isPending ? "Saving..." : "Submit") : "Done!"}
          </button>
        </div>
      </div>
      <div>{testContent}</div>
    </div>
  );
}

export default GamePage;
