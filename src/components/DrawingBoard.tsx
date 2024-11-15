import { useEffect, useRef, useState } from "react";
import DevButton from "./DevButton";
import { DrawMove, DrawStep, Tool, WindowSize } from "../utils/types";
import ToolsBoard from "./ToolsBoard";
import ColorsBoard from "./ColorsBoard";

// TODO: Add conditional wrapper that disable drawing when guessing (based on round#)
const MAIN_MOUSE_BUTTON = 0 as const;
const CANVAS_COLOR = "#f9fafb" as const;

function DrawingBoard() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [width, setWidth] = useState(((4 / 3) * window.innerHeight * 2) / 3);
  const [height, setHeight] = useState((window.innerHeight * 2) / 3);
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    heigth: window.innerHeight,
  });
  const [color, setColor] = useState("#181C14"); // default -> black
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [currentTool, setCurrentTool] = useState<Tool>("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStack, setDrawingStack] = useState<DrawStep[]>([]);
  const [undoStack, setUndoStack] = useState<DrawStep[]>([]);
  const [currDrawMove, setCurrDrawMove] = useState<DrawMove[]>([]);

  useEffect(() => {
    if (ref.current) {
      const context = ref.current.getContext("2d");
      if (context) {
        setCtx(context);
      }
    }
  }, [ref]);

  window.addEventListener("resize", function () {
    if (window.innerWidth < (window.screen.width * 2) / 5) {
      setWidth(((4 / 3) * window.innerHeight * 2) / 5);
      setHeight((window.innerHeight * 2) / 5);

      // reDraw({
      //   dx: window.innerWidth - windowSize.width,
      //   dy: window.innerHeight - windowSize.heigth,
      // });
      // setWindowSize({
      //   width: window.innerWidth,
      //   heigth: window.innerHeight,
      // });
    } else if (window.innerWidth < window.screen.width / 2) {
      setWidth(((4 / 3) * window.innerHeight * 1) / 2);
      setHeight((window.innerHeight * 1) / 2);

      // reDraw({
      //   dx: window.innerWidth - windowSize.width,
      //   dy: window.innerHeight - windowSize.heigth,
      // });
      // setWindowSize({
      //   width: window.innerWidth,
      //   heigth: window.innerHeight,
      // });
    } else {
      setWidth(((4 / 3) * window.innerHeight * 2) / 3);
      setHeight((window.innerHeight * 2) / 3);
      // reDraw({
      //   dx: window.innerWidth - windowSize.width,
      //   dy: window.innerHeight - windowSize.heigth,
      // });
      // setWindowSize({
      //   width: window.innerWidth,
      //   heigth: window.innerHeight,
      // });
    }
  });

  function start(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (event.button === MAIN_MOUSE_BUTTON && !!ctx && !!ref.current) {
      setLineProperties();
      3;
      setIsDrawing(true);
      ctx.beginPath();

      let elementRect = ref.current.getBoundingClientRect();
      ctx.moveTo(
        event.clientX - elementRect.left,
        event.clientY - elementRect.top
      );
      setCurrDrawMove([
        {
          kind: "start",
          tool: currentTool,
          x: event.clientX - elementRect.left,
          y: event.clientY - elementRect.top,
          width: 0,
          height: 0,
          color: currentTool === "eraser" ? CANVAS_COLOR : color,
          strokeWidth,
        },
      ]);
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
    if (isDrawing && !!ctx && !!ref.current) {
      let elementRect = ref.current.getBoundingClientRect();
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
          var widthSquare =
            event.clientX - elementRect.left - currDrawMove[0].x;
          var heightSquare =
            event.clientY - elementRect.top - currDrawMove[0].y;
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
            DrawStep(newMoves);
            setCurrDrawMove(newMoves);
          } else {
            const newMoves = [...currDrawMove];
            newMoves[1] = move;
            DrawStep(newMoves);
            setCurrDrawMove(newMoves);
          }

          drawingStack.forEach((d) => DrawStep(d));
          break;
        case "circle":
          ctx.clearRect(0, 0, width, height);
          var widthCircle =
            event.clientX - elementRect.left - currDrawMove[0].x;
          var heightCircle =
            event.clientY - elementRect.top - currDrawMove[0].y;
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
            DrawStep(newMoves);
            setCurrDrawMove(newMoves);
          } else {
            const newMoves = [...currDrawMove];
            newMoves[1] = moveCircle;
            DrawStep(newMoves);
            setCurrDrawMove(newMoves);
          }

          drawingStack.forEach((d) => DrawStep(d));
          break;
        case "line":
          ctx.clearRect(0, 0, width, height);
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
            DrawStep(newMoves);
            setCurrDrawMove(newMoves);
          } else {
            const newMoves = [...currDrawMove];
            newMoves[1] = moveLine;
            DrawStep(newMoves);
            setCurrDrawMove(newMoves);
          }
          drawingStack.forEach((d) => DrawStep(d));
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

  function setLineProperties() {
    if (!ctx) return;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
  }

  function DrawStep(step: DrawStep) {
    if (!ctx || !ref.current) return;
    setLineProperties();
    ctx.beginPath();
    let elementRect = ref.current.getBoundingClientRect();
    step.forEach((m) => {
      if (m.kind === "start") {
        console.log("here");
        ctx.moveTo(m.x, m.y);
      } else {
        ctx.strokeStyle = m.color;
        ctx.lineWidth = m.strokeWidth;
        if (m.tool === "square") {
          ctx.rect(m.x, m.y, m.width!, m.height!);
          ctx.stroke();
        } else if (m.tool === "circle") {
          const radius = Math.sqrt(m.width * m.width + m.height * m.height);
          // move the pen to the right perimeter to remove the drawn radius
          ctx.moveTo(m.x + radius, m.y);
          ctx.arc(m.x, m.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (m.tool === "line") {
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.width, m.height);
          ctx.stroke();
        } else {
          ctx.lineTo(m.x - elementRect.left, m.y - elementRect.top);
          ctx.stroke();
        }
      }
    });
  }

  function undo() {
    if (!ctx || drawingStack.length === 0) return;
    const diff = [...drawingStack];
    const element = diff.pop();
    setDrawingStack(diff);

    ctx.clearRect(0, 0, width, height);
    diff.forEach((d) => DrawStep(d));
    setUndoStack([...undoStack, element!]);
  }
  function redo() {
    if (!ctx || undoStack.length === 0) return;
    const diff = [...undoStack];
    const element = diff.pop();
    const newDrawStack = [...drawingStack, element!];
    console.log(newDrawStack);

    setUndoStack(diff);
    DrawStep(element!);
    setDrawingStack(newDrawStack);
  }
  return (
    <div className="relative flex justify-center items-center w-full h-2/3 gap-8">
      <ColorsBoard currColor={color} setColor={setColor} />
      <canvas
        ref={ref}
        height={height}
        width={width}
        onMouseMove={(e) => move(e)}
        onMouseUp={(e) => end(e)}
        onMouseDown={(e) => start(e)}
        className="bg-gray-50 rounded"
      >
        Canvas not supported in your browser.
      </canvas>
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
          if (!ctx) return;
          console.log("DRAW STACK --");
          drawingStack.forEach((d) => {
            console.log(d);
          });
          console.log("UNDO STACK --");
          undoStack.forEach((d) => {
            console.log(d);
          });
        }}
      />
    </div>
  );
}

export default DrawingBoard;
