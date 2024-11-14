import {
  Circle,
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
  //drawing: boolean;
  //setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
}

function ToolsBoard({ undo, redo }: props) {
  return (
    <div className="flex flex-wrap w-1/6 justify-center h-auto bg-red-200 rounded-lg p-3 gap-3">
      <div className="flex justify-center items-center w-2/5 aspect-square border-2 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Pen className="w-20 aspect-square" color="black" />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-2 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Eraser className="w-20 aspect-square" color="black" />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-2 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Square className="w-20 aspect-square" color="black" />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-2 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Circle className="w-20 aspect-square" color="black" />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-2 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Minus className="w-20 aspect-square" color="black" />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-2 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Pipette className="w-20 aspect-square" color="black" />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-2 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Undo
          onClick={() => undo()}
          className="w-20 aspect-square"
          color="black"
        />
      </div>
      <div className="flex justify-center items-center w-2/5 aspect-square border-2 border-gray-900 rounded-lg hover:bg-gray-100 hover:cursor-pointer active:opacity-20">
        <Redo
          onClick={() => redo()}
          className="w-20 aspect-square"
          color="black"
        />
      </div>
    </div>
  );
}

export default ToolsBoard;
