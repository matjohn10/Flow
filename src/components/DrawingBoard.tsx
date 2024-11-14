import { useEffect, useRef, useState } from "react";
import DevButton from "./DevButton";
import { DrawMove, DrawStep, WindowSize } from "../utils/types";
import ToolsBoard from "./ToolsBoard";
import ColorsBoard from "./ColorsBoard";

// TODO: Add conditional wrapper that disable drawing when guessing (based on round#)
// TODO: Add conditional wrapper for mouse up/down when pen/eraser/square/circle/path/picker selected
const MAIN_MOUSE_BUTTON = 0;

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStack, setDrawingStack] = useState<DrawStep[]>([]);
  const [undoStack, setUndoStack] = useState<DrawStep[]>([]);
  const [currDrawMove, setCurrDrawMove] = useState<DrawMove[]>([]);
  const [undoRedoTimer, setUndoRedoTimer] = useState(false);

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
      setIsDrawing(true);
      ctx.beginPath();

      let elementRect = ref.current.getBoundingClientRect();
      ctx.moveTo(
        event.clientX - elementRect.left,
        event.clientY - elementRect.top
      );
      setCurrDrawMove([
        ...currDrawMove,
        {
          kind: "start",
          x: event.clientX,
          y: event.clientY,
          color,
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
      ctx.lineTo(
        event.clientX - elementRect.left,
        event.clientY - elementRect.top
      );
      ctx.stroke();
      setCurrDrawMove([
        ...currDrawMove,
        {
          kind: "move",
          x: event.clientX,
          y: event.clientY,
          color,
          strokeWidth,
        },
      ]);
    }
  }

  function setLineProperties() {
    if (!ctx) return;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
  }

  function reDrawStep(step: DrawStep) {
    if (!ctx || !ref.current) return;
    setLineProperties();
    ctx.beginPath();
    let elementRect = ref.current.getBoundingClientRect();
    step.forEach((m) => {
      if (m.kind === "start") {
        ctx.moveTo(m.x - elementRect.left, m.y - elementRect.top);
      } else {
        ctx.strokeStyle = m.color;
        ctx.lineWidth = m.strokeWidth;
        ctx.lineTo(m.x - elementRect.left, m.y - elementRect.top);
        ctx.stroke();
      }
    });
  }

  function undo() {
    if (!ctx || drawingStack.length === 0) return;
    const diff = [...drawingStack];
    const element = diff.pop();
    setDrawingStack(diff);

    ctx.clearRect(0, 0, width, height);
    diff.forEach((d) => reDrawStep(d));
    setUndoStack([...undoStack, element!]);
  }
  function redo() {
    if (!ctx || undoStack.length === 0) return;
    const diff = [...undoStack];
    const element = diff.pop();
    const newDrawStack = [...drawingStack, element!];
    console.log(newDrawStack);

    setUndoStack(diff);
    reDrawStep(element!);
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
      {/* TODO: Looks like a short delay is needed before you can undo/redo again */}
      <ToolsBoard
        redo={redo}
        undo={undo}
        currStrokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        //drawing={isDrawing}
        //setDrawing={setIsDrawing}
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
