import { useState } from "react";
import DevButton from "./DevButton";
import { DrawMove, DrawStep, Tool } from "../utils/types";
import ToolsBoard from "./ToolsBoard";
import ColorsBoard from "./ColorsBoard";
import {
  drawStep,
  isDrawingRound,
  pixelToRGBA,
  rgbaToHex,
  setLineProperties,
} from "../utils/helpers";

const MAIN_MOUSE_BUTTON = 0 as const;
const CANVAS_COLOR = "#f9fafb" as const;

interface props {
  round?: number;
  drawingStack: DrawStep[];
  setDrawingStack: React.Dispatch<React.SetStateAction<DrawStep[]>>;
  refC: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | undefined;
  width: number;
  height: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  drawingToGuess: string | null;
}

// TODO: REFACTOR TO SHOW IMAGE OF OTHERS CANVAS INSTEAD OF REDRAWING

function DrawingBoard({
  round,
  drawingStack,
  setDrawingStack,
  refC,
  ctx,
  width,
  height,
  setWidth,
  setHeight,
  drawingToGuess,
}: props) {
  const [color, setColor] = useState("#181C14"); // default -> black
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [currentTool, setCurrentTool] = useState<Tool>("pen");
  const [isDrawing, setIsDrawing] = useState(false);

  const [undoStack, setUndoStack] = useState<DrawStep[]>([]);
  const [currDrawMove, setCurrDrawMove] = useState<DrawMove[]>([]);

  window.addEventListener("resize", function () {
    if (window.innerWidth < (window.screen.width * 2) / 5) {
      setWidth(((4 / 3) * window.innerHeight * 2) / 5);
      setHeight((window.innerHeight * 2) / 5);
    } else if (window.innerWidth < window.screen.width / 2) {
      setWidth(((4 / 3) * window.innerHeight * 1) / 2);
      setHeight((window.innerHeight * 1) / 2);
    } else {
      setWidth(((4 / 3) * window.innerHeight * 2) / 3);
      setHeight((window.innerHeight * 2) / 3);
    }
  });

  function start(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (event.button === MAIN_MOUSE_BUTTON && !!ctx && !!refC.current) {
      let elementRect = refC.current.getBoundingClientRect();
      if (currentTool === "picker") {
        const x = Math.floor(event.clientX - elementRect.left) * 4;
        const y = Math.floor(event.clientY - elementRect.top) * 4;
        const index = x + y * Math.floor(width);
        const pixels = ctx
          .getImageData(0, 0, Math.floor(width), Math.floor(height))
          .data.slice(index, index + 4);
        setColor(rgbaToHex(pixelToRGBA(pixels), true));
      } else {
        setLineProperties(ctx, strokeWidth, color);
        3;
        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(
          event.clientX - elementRect.left,
          event.clientY - elementRect.top
        );
        setCurrDrawMove([
          {
            kind: "start",
            tool: currentTool,
            x: event.clientX,
            y: event.clientY,
            width: 0,
            height: 0,
            color: currentTool === "eraser" ? CANVAS_COLOR : color,
            strokeWidth,
          },
        ]);
      }
    }
  }

  function end(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (event.button === MAIN_MOUSE_BUTTON && !!ctx && isDrawing) {
      setIsDrawing(false);
      setDrawingStack([...drawingStack, currDrawMove]);
      setCurrDrawMove([]);
    }
  }

  function move(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    event.preventDefault();
    if (isDrawing && !!ctx && !!refC.current) {
      let elementRect = refC.current.getBoundingClientRect();
      switch (currentTool) {
        case "pen":
          ctx.lineTo(
            event.clientX - elementRect.left,
            event.clientY - elementRect.top
          );
          ctx.stroke();
          // pen updates currdraw on each moves
          setCurrDrawMove([
            ...currDrawMove,
            {
              kind: "move",
              tool: currentTool,
              x: event.clientX,
              y: event.clientY,
              width: 0,
              height: 0,
              color,
              strokeWidth,
            },
          ]);
          break;
        case "square":
          ctx.clearRect(0, 0, width, height);
          drawingStack.forEach((d) =>
            drawStep(ctx, d, refC, strokeWidth, color)
          );
          var widthSquare = event.clientX - currDrawMove[0].x;
          var heightSquare = event.clientY - currDrawMove[0].y;
          const move: DrawMove = {
            kind: "move",
            tool: currentTool,
            x: currDrawMove[0].x,
            y: currDrawMove[0].y,
            width: widthSquare,
            height: heightSquare,
            color,
            strokeWidth,
          };
          if (currDrawMove.length === 1) {
            const newMoves = [...currDrawMove, move];
            drawStep(ctx, newMoves, refC, strokeWidth, color);
            setCurrDrawMove(newMoves);
          } else {
            const newMoves = [...currDrawMove];
            newMoves[1] = move;
            drawStep(ctx, newMoves, refC, strokeWidth, color);
            setCurrDrawMove(newMoves);
          }
          break;
        case "circle":
          ctx.clearRect(0, 0, width, height);
          drawingStack.forEach((d) =>
            drawStep(ctx, d, refC, strokeWidth, color)
          );
          var widthCircle = event.clientX - currDrawMove[0].x;
          var heightCircle = event.clientY - currDrawMove[0].y;
          const moveCircle: DrawMove = {
            kind: "move",
            tool: currentTool,
            x: currDrawMove[0].x,
            y: currDrawMove[0].y,
            width: widthCircle,
            height: heightCircle,
            color,
            strokeWidth,
          };
          if (currDrawMove.length === 1) {
            const newMoves = [...currDrawMove, moveCircle];
            drawStep(ctx, newMoves, refC, strokeWidth, color);

            setCurrDrawMove(newMoves);
          } else {
            const newMoves = [...currDrawMove];
            newMoves[1] = moveCircle;
            drawStep(ctx, newMoves, refC, strokeWidth, color);

            setCurrDrawMove(newMoves);
          }
          break;
        case "line":
          ctx.clearRect(0, 0, width, height);
          drawingStack.forEach((d) =>
            drawStep(ctx, d, refC, strokeWidth, color)
          );
          var widthLine = event.clientX - elementRect.left;
          var heightLine = event.clientY - elementRect.top;
          const moveLine: DrawMove = {
            kind: "move",
            tool: currentTool,
            x: currDrawMove[0].x,
            y: currDrawMove[0].y,
            width: widthLine,
            height: heightLine,
            color,
            strokeWidth,
          };
          if (currDrawMove.length === 1) {
            const newMoves = [...currDrawMove, moveLine];
            drawStep(ctx, newMoves, refC, strokeWidth, color);

            setCurrDrawMove(newMoves);
          } else {
            const newMoves = [...currDrawMove];
            newMoves[1] = moveLine;
            drawStep(ctx, newMoves, refC, strokeWidth, color);
            setCurrDrawMove(newMoves);
          }
          break;
        case "eraser":
          ctx.lineTo(
            event.clientX - elementRect.left,
            event.clientY - elementRect.top
          );
          ctx.strokeStyle = CANVAS_COLOR;
          ctx.stroke();
          // eraser updates currdraw on each moves
          setCurrDrawMove([
            ...currDrawMove,
            {
              kind: "move",
              tool: currentTool,
              x: event.clientX,
              y: event.clientY,
              width: 0,
              height: 0,
              color: CANVAS_COLOR,
              strokeWidth,
            },
          ]);
          break;
      }
    }
  }

  function undo() {
    if (!ctx || drawingStack.length === 0) return;
    const diff = [...drawingStack];
    const element = diff.pop();
    setDrawingStack(diff);

    ctx.clearRect(0, 0, width, height);
    diff.forEach((d) => drawStep(ctx, d, refC, strokeWidth, color));
    setUndoStack([...undoStack, element!]);
  }
  function redo() {
    if (!ctx || undoStack.length === 0) return;
    const diff = [...undoStack];
    const element = diff.pop();
    const newDrawStack = [...drawingStack, element!];

    setUndoStack(diff);
    drawStep(ctx, element!, refC, strokeWidth, color);
    setDrawingStack(newDrawStack);
  }

  return (
    <div className="relative flex justify-center items-center w-full h-2/3 gap-8">
      <ColorsBoard currColor={color} setColor={setColor} />
      {drawingToGuess ? (
        <div style={{ width, height }} className="bg-gray-50 rounded">
          <img
            className="w-full h-full object-cover"
            src={drawingToGuess}
            alt="Guess Image"
          />
        </div>
      ) : (
        <canvas
          ref={refC}
          height={height}
          width={width}
          onMouseMove={(e) => {
            if (isDrawingRound(round)) move(e);
          }}
          onMouseUp={(e) => {
            if (isDrawingRound(round)) end(e);
          }}
          onMouseDown={(e) => {
            if (isDrawingRound(round)) start(e);
          }}
          className="bg-gray-50 rounded"
          style={{
            cursor: isDrawingRound(round) ? "crosshair" : "not-allowed",
          }}
        >
          Canvas not supported in your browser.
        </canvas>
      )}
      <ToolsBoard
        redo={redo}
        undo={undo}
        currStrokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
      />
      <DevButton
        className="absolute top-4 right-2"
        text="Canvas Data"
        func={() => {
          if (!ctx || !refC.current) return;
          // console.log("DRAW STACK --");
          // drawingStack.forEach((d) => {
          //   console.log(d);
          // });
          // console.log("UNDO STACK --");
          // undoStack.forEach((d) => {
          //   console.log(d);
          // });
        }}
      />
    </div>
  );
}

export default DrawingBoard;
