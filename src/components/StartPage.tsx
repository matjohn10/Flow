import { useEffect, useState } from "react";
import { socket } from "../utils/socket";

function StartPage() {
  const [room, setRoom] = useState("");
  useEffect(() => {
    // listens to get room-id after creation
    socket.on("room-id", (roomId: string) => {
      setRoom(roomId);
    });
  }, []);
  return (
    <div className="flex flex-col w-full h-full items-center gap-4 p-10">
      <h1 className="font-extrabold text-3xl">Start a game of Pictionary!</h1>
      <div className="flex w-3/4 justify-center gap-10">
        <button className="bg-gray-200 border-2 rounded text-black px-4 py-2">
          Join
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log("HERE");
            socket.emit("create-room", localStorage.getItem("user-id") ?? "");
          }}
          className="bg-gray-200 border-2 rounded text-black px-4 py-2"
        >
          Create
        </button>
      </div>
      {!room ? <></> : <p>You just created a room ({room})</p>}
    </div>
  );
}

export default StartPage;
