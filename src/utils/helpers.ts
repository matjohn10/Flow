import { Player } from "../queries/games";
import { DrawStep } from "./types";

export const AddPlayerIfNew = (player: Player, arr: Player[]): Player[] => {
  const found = arr.find((p) => p.playerId === player.playerId);
  if (!found) {
    return [...arr, player];
  }
  return [...arr];
};

export const ParseToPlayer = (player: string): Player => {
  return JSON.parse(player) as Player;
};

export const FindRankOfPlayer = (playerS: string[], id: string): number => {
  for (let i = 0; i < playerS.length; i++) {
    const player = ParseToPlayer(playerS[i]);
    if (player.playerId === id) return i;
  }
  return -1;
};

export function assert(condition: boolean, message?: string) {
  if (condition) throw new Error(message);
}

export const rgbaToHex = (
  colorStr: string,
  forceRemoveAlpha: boolean = false
) => {
  // Check if the input string contains '/'
  const hasSlash = colorStr.includes("/");

  if (hasSlash) {
    // Extract the RGBA values from the input string
    const rgbaValues = colorStr.match(/(\d+)\s+(\d+)\s+(\d+)\s+\/\s+([\d.]+)/);

    if (!rgbaValues) {
      return colorStr; // Return the original string if it doesn't match the expected format
    }

    const [red, green, blue, alpha] = rgbaValues.slice(1, 5).map(parseFloat);

    // Convert the RGB values to hexadecimal format
    const redHex = red.toString(16).padStart(2, "0");
    const greenHex = green.toString(16).padStart(2, "0");
    const blueHex = blue.toString(16).padStart(2, "0");

    // Convert alpha to a hexadecimal format (assuming it's already a decimal value in the range [0, 1])
    const alphaHex = forceRemoveAlpha
      ? ""
      : Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0");

    // Combine the hexadecimal values to form the final hex color string
    const hexColor = `#${redHex}${greenHex}${blueHex}${alphaHex}`;

    return hexColor;
  } else {
    // Use the second code block for the case when '/' is not present
    return (
      "#" +
      colorStr
        .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
        .split(",") // splits them at ","
        .filter((_, index) => !forceRemoveAlpha || index !== 3)
        .map((string) => parseFloat(string)) // Converts them to numbers
        .map((number, index) =>
          index === 3 ? Math.round(number * 255) : number
        ) // Converts alpha to 255 number
        .map((number) => number.toString(16)) // Converts numbers to hex
        .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
        .join("")
    );
  }
};

export const pixelToRGBA = (pixels: Uint8ClampedArray) => {
  let str = "rgba(" + pixels[0];
  let i = 1;
  for (i; i < pixels.length; i++) {
    str += ", " + pixels[i];
  }
  return str + ")";
};

export function isDrawingRound(round?: number) {
  if (!round) return true;
  return round % 2 === 0;
}

export function setLineProperties(
  ctx: CanvasRenderingContext2D,
  strokeWidth: number,
  color: string
) {
  if (!ctx) return;
  ctx.lineWidth = strokeWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
}

export function drawStep(
  ctx: CanvasRenderingContext2D,
  step: DrawStep,
  ref: React.RefObject<HTMLCanvasElement>,
  strokeWidth: number,
  color: string,
  delta?: boolean
) {
  if (!ctx || !ref.current) return;
  setLineProperties(ctx, strokeWidth, color);
  ctx.beginPath();
  let elementRect = ref.current.getBoundingClientRect();
  step.forEach((m) => {
    if (m.kind === "start") {
      ctx.moveTo(m.x - elementRect.left, m.y - elementRect.top);
      ctx.fillStyle = "red";
      ctx.fillRect(m.x - elementRect.left, m.y - elementRect.top, 10, 10);
    } else {
      ctx.strokeStyle = m.color;
      ctx.lineWidth = m.strokeWidth;
      if (m.tool === "square") {
        ctx.rect(
          m.x - elementRect.left,
          m.y - elementRect.top,
          m.width!,
          m.height!
        );
        ctx.stroke();
      } else if (m.tool === "circle") {
        const radius = Math.sqrt(m.width * m.width + m.height * m.height);
        // move the pen to the right perimeter to remove the drawn radius
        ctx.moveTo(m.x - elementRect.left + radius, m.y - elementRect.top);
        ctx.arc(
          m.x - elementRect.left,
          m.y - elementRect.top,
          radius,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      } else if (m.tool === "line") {
        ctx.moveTo(m.x - elementRect.left, m.y - elementRect.top);
        ctx.lineTo(m.width, m.height);
        ctx.stroke();
      } else {
        ctx.lineTo(m.x - elementRect.left, m.y - elementRect.top);
        ctx.stroke();
      }
    }
  });
}

export function displayTime(time: number): string {
  let sec_num = time; // don't forget the second param
  let minutes = Math.floor(sec_num / 60);
  let seconds = sec_num - minutes * 60;
  let min = minutes + "";
  let sec = seconds + "";
  if (minutes < 10) {
    min = "0" + minutes;
  }
  if (seconds < 10) {
    sec = "0" + seconds;
  }
  return min + ":" + sec;
}
