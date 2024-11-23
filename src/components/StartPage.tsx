import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft, CircleCheckBig, CircleX } from "lucide-react";
import PlayerChooseAvatar from "./PlayerChooseAvatar";
import { ICONS, ROOM_ID_LEN } from "../constants";
import { isMobile } from "react-device-detect";
import { checkString } from "../utils/helpers";

function StartPage() {
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [icon, setIcon] = useState("icon");

  const [roomToJoin, setRoomToJoin] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pressed, setPressed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // listens to get room-id after creation
    socket.on("room-id", (roomId: string) => {
      navigate(`/game-time/${roomId}/wait`);
    });
    socket.on("join-error", () => {
      setError(true);
      setErrorMsg("This game ID does not exist. Please try another one.");
    });
  }, []);

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!checkString(username.trim())) {
      setError(true);
      setErrorMsg(`Improper username format. Please try again.`);
      return;
    }
    const player = {
      playerId: localStorage.getItem("user-id") ?? "",
      username,
      color,
      icon,
    };
    const playerString = JSON.stringify(player);
    localStorage.setItem("player", playerString);
    socket.emit("create-room", playerString);
  };

  const handleJoin = () => {
    if (!roomToJoin || roomToJoin.length < ROOM_ID_LEN) return;
    if (!checkString(username.trim())) {
      setError(true);
      setErrorMsg(`Improper username format. Please try again.`);
      return;
    }
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
  return (
    <div className="flex flex-col w-full h-full items-center gap-4 p-10 relative overflow-hidden">
      <div
        className="absolute w-10 h-10 left-10 hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        <ArrowBigLeft color="white" className="w-12 h-10" />
      </div>
      <h1 className="font-extrabold text-4xl md:text-5xl">Start a game!</h1>
      <div className="flex flex-col w-full sm:w-1/2 xl:w-1/4 items-start gap-3">
        <div className="flex flex-col w-full items-center">
          <input
            placeholder="Username"
            type="text"
            maxLength={10}
            value={username}
            onChange={(e) => {
              setError(false);
              setErrorMsg("");
              setUsername(e.currentTarget.value);
            }}
            className="w-full p-2 rounded bg-gray-200 text-black font-semibold"
          />
        </div>
        <div className="flex w-full items-center justify-center gap-4">
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
        <div className="flex justify-center flex-wrap w-full h-full">
          {ICONS.map((i) => (
            <PlayerChooseAvatar
              key={i}
              name={i}
              color={color}
              icon={icon}
              setIcon={setIcon}
            />
          ))}
        </div>
      </div>
      {!error ? (
        <></>
      ) : (
        <div className="text-red-700 bg-gray-100 px-2 rounded">{errorMsg}</div>
      )}
      <div className="flex w-3/4 justify-center gap-10 mt-4">
        <div className="flex items-center gap-1">
          <button
            onClick={!pressed ? () => setPressed((prev) => !prev) : handleJoin}
            disabled={pressed && (!username || !color || !icon)}
            className={
              !pressed
                ? "bg-gray-200 border-2 rounded text-black font-semibold px-4 py-2 shadow shadow-gray-800"
                : "bg-gray-200 border-2 rounded text-green-700 font-semibold px-4 py-2 shadow shadow-gray-800"
            }
          >
            {!pressed ? "Join" : <CircleCheckBig />}
          </button>
          {!pressed ? (
            <></>
          ) : (
            <button
              onClick={() => setPressed((prev) => !prev)}
              className="bg-gray-200 border-2 rounded text-red-800 font-semibold px-4 py-2 shadow shadow-gray-800"
            >
              <CircleX />
            </button>
          )}
        </div>
        {!pressed ? (
          <button
            onClick={(e) => handleCreate(e)}
            disabled={!username || !color || !icon}
            className="bg-gray-200 border-2 rounded text-black font-semibold px-4 py-2 shadow shadow-gray-800"
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
              setError(false);
              setErrorMsg("");
              setRoomToJoin(e.currentTarget.value);
            }}
          />
        )}
      </div>

      {isMobile ? (
        <div className="absolute -z-40 flex bot-0 left-0 w-full h-full">
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

export default StartPage;
