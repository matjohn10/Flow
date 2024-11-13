import { useEffect, useRef, useState } from "react";
import DevButton from "./DevButton";

const MAIN_MOUSE_BUTTON = 0;

function DrawingBoard() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [width, setWidth] = useState(((4 / 3) * window.innerHeight * 2) / 3);
  const [height, setHeight] = useState((window.innerHeight * 2) / 3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawing, setDrawing] = useState<ImageData>();

  useEffect(() => {
    if (ref.current) {
      const context = ref.current.getContext("2d");
      if (context) {
        setCtx(context);
        setDrawing(context.getImageData(0, 0, width, height));
      }
    }
  }, [ref]);

  window.addEventListener("resize", function () {
    if (window.innerWidth < (window.screen.width * 2) / 5) {
      setWidth(((4 / 3) * window.innerHeight * 2) / 5);
      setHeight((window.innerHeight * 2) / 5);
      if (ctx && drawing) ctx.putImageData(drawing, 0, 0);
    } else if (window.innerWidth < window.screen.width / 2) {
      setWidth(((4 / 3) * window.innerHeight * 1) / 2);
      setHeight((window.innerHeight * 1) / 2);
      if (ctx && drawing) ctx.putImageData(drawing, 0, 0);
    } else {
      setWidth(((4 / 3) * window.innerHeight * 2) / 3);
      setHeight((window.innerHeight * 2) / 3);
    }
  });

  function drawRectangle(
    point: { x: number; y: number },
    width: number,
    height: number,
    color: string
  ) {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(point.x, point.y, width, height);
    }
  }
  function start(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (event.button === MAIN_MOUSE_BUTTON && !!ctx && !!ref.current) {
      setIsDrawing(true);
      setLineProperties();

      ctx.beginPath();

      let elementRect = ref.current.getBoundingClientRect();
      ctx.moveTo(
        event.clientX - elementRect.left,
        event.clientY - elementRect.top
      );
    }
  }

  function end(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (event.button === MAIN_MOUSE_BUTTON && !!ctx) {
      setIsDrawing(false);
      setDrawing(ctx.getImageData(0, 0, width, height));
    }
  }

  function move(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (isDrawing && !!ctx && !!ref.current) {
      let elementRect = ref.current.getBoundingClientRect();
      ctx.lineTo(
        event.clientX - elementRect.left,
        event.clientY - elementRect.top
      );
      ctx.stroke();
    }
  }

  function setLineProperties() {
    if (!ctx) return;
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }

  return (
    <div className="relative flex justify-center items-center w-full h-2/3">
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
      <DevButton
        className="absolute top-10 -right-4"
        text="Canvas Data"
        func={() => {
          if (!ctx) return;
          console.log(drawing);
        }}
      />
    </div>
  );
}

export default DrawingBoard;
