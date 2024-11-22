import { useState } from "react";
import { DrawMove, DrawStep, Tool } from "../utils/types";
import ToolsBoard from "./ToolsBoard";
import ColorsBoard from "./ColorsBoard";
import {
  drawStep,
  isDrawingRound,
  pixelToRGBA,
  ratioCanvas,
  rgbaToHex,
  setLineProperties,
} from "../utils/helpers";
import { isMobile } from "react-device-detect";

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

  // window.addEventListener("resize", function () {
  //   const ratio = window.innerWidth / window.screen.width;

  //   if (ratio <= 3 / 6) {
  //     setWidth(window.innerWidth);
  //     setHeight(ratioCanvas(window.innerWidth, false));
  //   } else if (ratio < 4 / 6) {
  //     setWidth(window.innerWidth / 1.8);
  //     setHeight(ratioCanvas(this.window.innerWidth / 1.8, false));
  //   } else if (ratio < 5 / 6) {
  //     setWidth(window.innerWidth / 1.55);
  //     setHeight(ratioCanvas(this.window.innerWidth / 1.55, false));
  //   } else {
  //     setWidth(window.innerWidth / 2);
  //     setHeight(ratioCanvas(this.window.innerWidth / 2, false));
  //   }
  // });
  function dragAndDraw(x: number, y: number, elementRect?: DOMRect) {
    if (isDrawing && !!ctx && !!refC.current) {
      ctx.clearRect(0, 0, width, height);
      drawingStack.forEach((d) => drawStep(ctx, d, refC, strokeWidth, color));
      var widthShape = elementRect
        ? x - elementRect.left
        : x - currDrawMove[0].x;
      var heightShape = elementRect
        ? y - elementRect.top
        : y - currDrawMove[0].y;
      const move: DrawMove = {
        kind: "move",
        tool: currentTool,
        x: currDrawMove[0].x,
        y: currDrawMove[0].y,
        width: widthShape,
        height: heightShape,
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
    }
  }
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

  function startTouch(event: React.TouchEvent<HTMLCanvasElement>) {
    if (!!ctx && !!refC.current) {
      let elementRect = refC.current.getBoundingClientRect();
      if (currentTool === "picker") {
        const x = Math.floor(event.touches[0].clientX - elementRect.left) * 4;
        const y = Math.floor(event.touches[0].clientY - elementRect.top) * 4;
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
          event.touches[0].clientX - elementRect.left,
          event.touches[0].clientY - elementRect.top
        );
        setCurrDrawMove([
          {
            kind: "start",
            tool: currentTool,
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
            width: 0,
            height: 0,
            color: currentTool === "eraser" ? CANVAS_COLOR : color,
            strokeWidth,
          },
        ]);
      }
    }
  }
  function moveTouch(event: React.TouchEvent<HTMLCanvasElement>) {
    if (isDrawing && !!ctx && !!refC.current) {
      let elementRect = refC.current.getBoundingClientRect();
      switch (currentTool) {
        case "pen":
        case "eraser":
          ctx.lineTo(
            event.touches[0].clientX - elementRect.left,
            event.touches[0].clientY - elementRect.top
          );
          ctx.strokeStyle = currentTool === "pen" ? color : CANVAS_COLOR;
          ctx.stroke();
          // pen/eraser updates currdraw on each moves
          setCurrDrawMove([
            ...currDrawMove,
            {
              kind: "move",
              tool: currentTool,
              x: event.touches[0].clientX,
              y: event.touches[0].clientY,
              width: 0,
              height: 0,
              color: currentTool === "pen" ? color : CANVAS_COLOR,
              strokeWidth,
            },
          ]);
          break;
        case "square":
        case "circle":
          dragAndDraw(event.touches[0].clientX, event.touches[0].clientY);
          break;
        case "line":
          dragAndDraw(
            event.touches[0].clientX,
            event.touches[0].clientY,
            elementRect
          );
          break;
      }
    }
  }
  function endTouch() {
    setIsDrawing(false);
    setDrawingStack([...drawingStack, currDrawMove]);
    setCurrDrawMove([]);
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
        case "eraser":
          ctx.lineTo(
            event.clientX - elementRect.left,
            event.clientY - elementRect.top
          );
          ctx.strokeStyle = currentTool === "pen" ? color : CANVAS_COLOR;
          ctx.stroke();
          // pen/eraser updates currdraw on each moves
          setCurrDrawMove([
            ...currDrawMove,
            {
              kind: "move",
              tool: currentTool,
              x: event.clientX,
              y: event.clientY,
              width: 0,
              height: 0,
              color: currentTool === "pen" ? color : CANVAS_COLOR,
              strokeWidth,
            },
          ]);
          break;
        case "square":
        case "circle":
          dragAndDraw(event.clientX, event.clientY);
          break;
        case "line":
          dragAndDraw(event.clientX, event.clientY, elementRect);
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

  // TODO: Make clean resizing UI for canvas
  return (
    <div className="relative flex flex-col md:flex-row justify-center items-center w-full h-2/3 gap-8">
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
          onTouchStart={(e) => {
            if (isDrawingRound(round) && isMobile) startTouch(e);
          }}
          onTouchMove={(e) => {
            if (isDrawingRound(round) && isMobile) moveTouch(e);
          }}
          onTouchEnd={() => {
            if (isDrawingRound(round) && isMobile) endTouch();
          }}
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
    </div>
  );
}

export default DrawingBoard;
