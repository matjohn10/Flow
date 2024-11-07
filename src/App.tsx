import { useEffect } from "react";

import { SetSocket } from "./utils/socket";

function App() {
  useEffect(() => {
    SetSocket();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-10 gap-4">
      <h1 className="font-extrabold text-5xl">Pictionary</h1>
      <button className="bg-gray-200 border-2 rounded text-black px-4 py-2">
        Start Game
      </button>
    </div>
  );
}

export default App;
