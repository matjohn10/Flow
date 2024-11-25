import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
const WS_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:8000"
    : "https://flow-server-ap58.onrender.com";
("https://flow-server-ap58.onrender.com");

export const socket = io(WS_URL);

const saveIdToLocalStorage = (id: string) => {
  const currId = localStorage.getItem("user-id");
  if (!currId) localStorage.setItem("user-id", id);
  return currId ?? id;
};

export function SetSocket() {
  socket.on("connect", () => {
    console.info("Connection established succesfully");
    // sending my information to the server to create my channel (no user info saved in DB, just rooms + room convo, deleted after game)
    const id = uuidv4();
    const realId = saveIdToLocalStorage(id);
    socket.emit("iam", realId);
  });

  // receives message that I successfully joined my own channel
  socket.on("room", (status: string) => {
    console.log("Joined Room:", status);
  });

  socket.on("error", () => {
    console.log("ERROR Connecting");
  });
}
