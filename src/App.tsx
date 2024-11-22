import { Link } from "react-router-dom";
import { APP_NAME } from "./constants";

function App() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-10 gap-4">
      <h1 className="font-extrabold text-5xl">{APP_NAME}</h1>
      <button className="bg-gray-200 border-2 rounded text-black px-4 py-2">
        <Link to="/game">Start Game</Link>
      </button>
    </div>
  );
}

export default App;
