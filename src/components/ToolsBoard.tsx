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

interface props {
  undo(): void;
  redo(): void;
  currStrokeWidth: number;
  setStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
  //drawing: boolean;
  //setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
}

function ToolsBoard({ undo, redo, currStrokeWidth, setStrokeWidth }: props) {
  return (
    <div className="flex flex-wrap w-1/6 justify-center h-auto bg-red-100 rounded-lg p-3 gap-3">
      <div className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Pen size={32} color="black" strokeWidth={4} />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Eraser size={32} color="black" strokeWidth={4} />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Square size={32} color="black" strokeWidth={4} />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Circle size={32} color="black" strokeWidth={4} />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Minus size={32} color="black" strokeWidth={4} />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Pipette size={32} color="black" strokeWidth={4} />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Undo onClick={() => undo()} size={32} color="black" strokeWidth={4} />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-4 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Redo onClick={() => redo()} color="black" size={32} strokeWidth={4} />
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
