import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft, CircleCheckBig, CircleX } from "lucide-react";

function StartPage() {
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [icon, setIcon] = useState("icon");

  const [roomToJoin, setRoomToJoin] = useState("");
  const [error, setError] = useState(false);
  const [pressed, setPressed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // listens to get room-id after creation
    socket.on("room-id", (roomId: string) => {
      navigate(`/game-time/${roomId}/wait`);
    });
    socket.on("join-error", () => {
      setError(true);
    });
  }, []);

  const handleJoin = () => {
    if (!roomToJoin || roomToJoin.length < 5) return;
    const player = {
      playerId: localStorage.getItem("user-id") ?? "",
      username,
      color,
      icon,
    };
    const playerString = JSON.stringify(player);
    localStorage.setItem("player", playerString);
    socket.emit("join-room", JSON.stringify({ player, roomId: roomToJoin }));
  };

  const baseStyle =
    "flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20";
  return (
    <div className="flex flex-col w-full h-full items-center gap-4 p-10 relative">
      <div
        className="absolute w-10 h-10 left-10 hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        <ArrowBigLeft color="white" className="w-12 h-10" />
      </div>
      <h1 className="font-extrabold text-5xl">Start a game!</h1>
      <div className="flex flex-col w-1/4 items-start gap-3">
        <div className="flex flex-col w-full items-center">
          <input
            placeholder="Username"
            type="text"
            maxLength={10}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            className="w-full p-2 rounded bg-gray-200 text-black font-semibold"
          />
        </div>
        <div className="flex w-full items-center gap-4">
          <label htmlFor="player-color" className="font-semibold">
            Choose a color
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.currentTarget.value)}
            id="player-color"
            className="bg-transparent"
          />
        </div>
        <div className="flex flex-wrap w-full h-full">
          <div
            onClick={() => setIcon("lion")}
            style={{ backgroundColor: icon === "lion" ? color : "#242424" }}
            className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
          >
            <img src="/avatars/lion.png" className="w-full h-full" />
          </div>
          <div
            onClick={() => setIcon("cat")}
            style={{ backgroundColor: icon === "cat" ? color : "#242424" }}
            className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
          >
            <img src="/avatars/cat.png" />
          </div>

          <div
            onClick={() => setIcon("fox")}
            style={{ backgroundColor: icon === "fox" ? color : "#242424" }}
            className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
          >
            <img src="/avatars/fox.png" />
          </div>
          <div
            onClick={() => setIcon("unicorn")}
            style={{ backgroundColor: icon === "unicorn" ? color : "#242424" }}
            className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
          >
            <img src="/avatars/unicorn.png" className="w-full h-full" />
          </div>
          <div
            onClick={() => setIcon("bunny")}
            style={{ backgroundColor: icon === "bunny" ? color : "#242424" }}
            className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
          >
            <img src="/avatars/bunny.png" className="w-full h-full" />
          </div>
          <div
            onClick={() => setIcon("horse")}
            style={{ backgroundColor: icon === "horse" ? color : "#242424" }}
            className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
          >
            <img src="/avatars/horse.png" className="w-full h-full" />
          </div>
          <div
            onClick={() => setIcon("tiger")}
            style={{ backgroundColor: icon === "tiger" ? color : "#242424" }}
            className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
          >
            <img src="/avatars/tiger.png" />
          </div>
          <div
            onClick={() => setIcon("bear")}
            style={{ backgroundColor: icon === "bear" ? color : "#242424" }}
            className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
          >
            <img src="/avatars/bear.png" />
          </div>

          <div
            onClick={() => setIcon("elephant")}
            style={{ backgroundColor: icon === "elephant" ? color : "#242424" }}
            className="flex w-1/3 aspect-square justify-center items-center rounded-lg hover:opacity-75 hover:cursor-pointer active:opacity-20"
          >
            <img src="/avatars/elephant.png" className="w-full h-full" />
          </div>
        </div>
      </div>
      {!error ? (
        <></>
      ) : (
        <div className="text-red-700">
          This game ID does not exist. Please try another one.
        </div>
      )}
      <div className="flex w-3/4 justify-center gap-10">
        <div className="flex items-center gap-1">
          <button
            onClick={!pressed ? () => setPressed((prev) => !prev) : handleJoin}
            disabled={pressed && (!username || !color || !icon)}
            className={
              !pressed
                ? "bg-gray-200 border-2 rounded text-black font-semibold px-4 py-2"
                : "bg-gray-200 border-2 rounded text-green-700 font-semibold px-4 py-2"
            }
          >
            {!pressed ? "Join" : <CircleCheckBig />}
          </button>
          {!pressed ? (
            <></>
          ) : (
            <button
              onClick={() => setPressed((prev) => !prev)}
              className="bg-gray-200 border-2 rounded text-red-800 font-semibold px-4 py-2"
            >
              <CircleX />
            </button>
          )}
        </div>
        {!pressed ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              const player = {
                playerId: localStorage.getItem("user-id") ?? "",
                username,
                color,
                icon,
              };
              const playerString = JSON.stringify(player);
              localStorage.setItem("player", playerString);
              socket.emit("create-room", playerString);
            }}
            disabled={!username || !color || !icon}
            className="bg-gray-200 border-2 rounded text-black font-semibold px-4 py-2"
          >
            Create
          </button>
        ) : (
          <input
            className="p-2 rounded bg-gray-200 text-black font-semibold"
            placeholder="Enter game ID..."
            type="text"
            value={roomToJoin}
            maxLength={5}
            onChange={(e) => {
              setRoomToJoin(e.currentTarget.value);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default StartPage;
