import {
  Circle,
  Dot,
  Eraser,
  Minus,
  Pen,
  Pipette,
  Redo,
  Square,
  Undo,
} from "lucide-react";
import { Tool } from "../utils/types";

interface props {
  undo: () => void;
  redo: () => void;
  currStrokeWidth: number;
  setStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
  currentTool: Tool;
  setCurrentTool: React.Dispatch<React.SetStateAction<Tool>>;
  //drawing: boolean;
  //setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO: Implement Pen - false -> no drawing, true -> drawing
// TODO: Implement Eraser, square, circle, line, picker - all should be exclusive (pen too)

function ToolsBoard({
  undo,
  redo,
  currStrokeWidth,
  setStrokeWidth,
  currentTool,
  setCurrentTool,
}: props) {
  return (
    <div className="flex flex-wrap w-[13%] justify-center h-auto bg-red-100 rounded-lg p-3 gap-3">
      <div
        onClick={() => setCurrentTool("pen")}
        style={{
          border:
            currentTool === "pen" ? "4px solid #AF1740" : "4px solid black",
        }}
        className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Pen size={32} color="black" strokeWidth={2} />
      </div>
      <div
        onClick={() => setCurrentTool("eraser")}
        style={{
          border:
            currentTool === "eraser" ? "4px solid #AF1740" : "4px solid black",
        }}
        className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Eraser size={32} color="black" strokeWidth={2} />
      </div>
      <div
        onClick={() => setCurrentTool("square")}
        style={{
          border:
            currentTool === "square" ? "4px solid #AF1740" : "4px solid black",
        }}
        className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Square size={32} color="black" strokeWidth={2} />
      </div>
      <div
        onClick={() => setCurrentTool("circle")}
        style={{
          border:
            currentTool === "circle" ? "4px solid #AF1740" : "4px solid black",
        }}
        className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Circle size={32} color="black" strokeWidth={2} />
      </div>
      <div
        onClick={() => setCurrentTool("line")}
        style={{
          border:
            currentTool === "line" ? "4px solid #AF1740" : "4px solid black",
        }}
        className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Minus size={32} color="black" strokeWidth={2} />
      </div>
      <div
        onClick={() => setCurrentTool("picker")}
        style={{
          border:
            currentTool === "picker" ? "4px solid #AF1740" : "4px solid black",
        }}
        className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Pipette size={32} color="black" strokeWidth={2} />
      </div>
      <div
        onClick={() => undo()}
        className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Undo size={32} color="black" strokeWidth={2} />
      </div>
      <div
        onClick={() => redo()}
        className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20"
      >
        <Redo color="black" size={32} strokeWidth={2} />
      </div>
      <div className="flex items-center w-full gap-3">
        <div
          onClick={() => setStrokeWidth(4)}
          style={{
            border:
              currStrokeWidth === 4 ? "4px solid #AF1740" : "4px solid black",
          }}
          className="flex justify-center items-center w-1/3 aspect-square rounded border-4 border-gray-900"
        >
          <Dot color="black" size={40} strokeWidth={4} />
        </div>
        <div
          onClick={() => setStrokeWidth(8)}
          style={{
            border:
              currStrokeWidth === 8 ? "4px solid #AF1740" : "4px solid black",
          }}
          className="flex justify-center items-center w-1/3 aspect-square rounded border-4 border-gray-900"
        >
          <Dot color="black" size={40} strokeWidth={8} />
        </div>
        <div
          onClick={() => setStrokeWidth(12)}
          style={{
            border:
              currStrokeWidth === 12 ? "4px solid #AF1740" : "4px solid black",
          }}
          className="flex justify-center items-center w-1/3 aspect-square rounded border-4 border-gray-900"
        >
          <Dot color="black" size={40} strokeWidth={12} />
        </div>
      </div>
    </div>
  );
}

export default ToolsBoard;
