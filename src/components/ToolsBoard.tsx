import { Dot, Redo, Undo } from "lucide-react";
import { Tool } from "../utils/types";
import { isMobile } from "react-device-detect";
import { TOOLS } from "../constants";
import { gamePress } from "../utils/sounds";

interface props {
  undo: () => void;
  redo: () => void;
  currStrokeWidth: number;
  setStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
  currentTool: Tool;
  setCurrentTool: React.Dispatch<React.SetStateAction<Tool>>;
}

function ToolsBoard({
  undo,
  redo,
  currStrokeWidth,
  setStrokeWidth,
  currentTool,
  setCurrentTool,
}: props) {
  return (
    <div className="flex flex-wrap w-full md:w-1/6 xl:w-[12%] justify-center h-auto bg-gray-100 rounded-lg p-3 gap-3">
      {TOOLS.map((t) => (
        <div
          key={t.name}
          onClick={() => {
            gamePress.play();
            setCurrentTool(t.name);
          }}
          style={{
            border:
              currentTool === t.name
                ? `${isMobile ? 2 : 4}px solid #b9466c`
                : `${isMobile ? 0 : 4}px solid black`,
          }}
          className="flex justify-center items-center w-[5%] md:w-2/5 aspect-square border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
        >
          <t.Icon size={t.size} color={t.color} strokeWidth={t.stroke} />
        </div>
      ))}
      <div
        onClick={() => {
          gamePress.play();
          undo();
        }}
        style={{
          border: `${isMobile ? 0 : 4}px solid black`,
        }}
        className="flex justify-center items-center w-[5%] md:w-2/5 aspect-square rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Undo size={32} color="black" strokeWidth={2} />
      </div>
      <div
        onClick={() => {
          gamePress.play();
          redo();
        }}
        style={{
          border: `${isMobile ? 0 : 4}px solid black`,
        }}
        className="flex justify-center items-center w-[5%] md:w-2/5 aspect-square rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Redo color="black" size={32} strokeWidth={2} />
      </div>
      <div className="flex items-center justify-center w-1/3 md:w-full gap-3">
        <div
          onClick={() => {
            gamePress.play();
            setStrokeWidth(4);
          }}
          style={{
            border:
              currStrokeWidth === 4
                ? `${isMobile ? 2 : 4}px solid #b9466c`
                : `${isMobile ? 0 : 4}px solid black`,
          }}
          className="flex justify-center items-center w-[18%] md:w-1/3 aspect-square rounded border-gray-900"
        >
          <Dot color="black" size={40} strokeWidth={4} />
        </div>
        <div
          onClick={() => {
            gamePress.play();
            setStrokeWidth(8);
          }}
          style={{
            border:
              currStrokeWidth === 8
                ? `${isMobile ? 2 : 4}px solid #b9466c`
                : `${isMobile ? 0 : 4}px solid black`,
          }}
          className="flex justify-center items-center w-[18%] md:w-1/3 aspect-square rounded border-gray-900"
        >
          <Dot color="black" size={40} strokeWidth={8} />
        </div>
        <div
          onClick={() => {
            gamePress.play();
            setStrokeWidth(12);
          }}
          style={{
            border:
              currStrokeWidth === 12
                ? `${isMobile ? 2 : 4}px solid #b9466c`
                : `${isMobile ? 0 : 4}px solid black`,
          }}
          className="flex justify-center items-center w-[18%] md:w-1/3 aspect-square rounded border-gray-900"
        >
          <Dot color="black" size={40} strokeWidth={12} />
        </div>
      </div>
    </div>
  );
}

export default ToolsBoard;
