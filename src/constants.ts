import { Circle, Eraser, Minus, Pen, Pipette, Square } from "lucide-react";

export const APP_NAME = "Flow" as const;
export const ICONS = [
  "lion",
  "cat",
  "fox",
  "unicorn",
  "bunny",
  "horse",
  "tiger",
  "bear",
  "elephant",
] as const;

export const COLORS = [
  "#608BC1",
  "#2A3663",
  "#347928",
  "#73EC8B",
  "#C7FFD8",
  "#ABBA7C",
  "#FFE31A",
  "#FDE7BB",
  "#705C53",
  "#FF8000",
  "#FFB26F",
  "#B8001F",
  "#740938",
  "#FF77B7",
  "#8B5DFF",
  "#181C14",
  "#E4E0E1",
  "#ffffff",
] as const;

export const TOOLS = [
  {
    name: "pen",
    size: 32,
    color: "black",
    stroke: 2,
    Icon: Pen,
  },
  {
    name: "eraser",
    size: 32,
    color: "black",
    stroke: 2,
    Icon: Eraser,
  },
  {
    name: "square",
    size: 32,
    color: "black",
    stroke: 2,
    Icon: Square,
  },
  {
    name: "circle",
    size: 32,
    color: "black",
    stroke: 2,
    Icon: Circle,
  },
  {
    name: "line",
    size: 32,
    color: "black",
    stroke: 2,
    Icon: Minus,
  },
  {
    name: "picker",
    size: 32,
    color: "black",
    stroke: 2,
    Icon: Pipette,
  },
] as const;

export const MAX_GUESS = 20 as const;
export const MAX_DRAW = 20 as const;
export const MAIN_MOUSE_BUTTON = 0 as const;
export const CANVAS_COLOR = "#f9fafb" as const;
export const ROOM_ID_LEN = 5 as const;

export const TestPlayers = [
  {
    playerId: "3f7bd706-07c4-44a8-b5e9-f0efe89f1be0",
    username: "mat10",
    color: "#6f8768",
    icon: "cat",
  },
  {
    playerId: "3f7bd706-07c5-44a8-b5e9-f0efe89f1be0",
    username: "jb123",
    color: "#8b1760",
    icon: "lion",
  },
  {
    playerId: "3f7bd706-07c6-44a8-b5e9-f0efe89f1be0",
    username: "m12",
    color: "#4c8750",
    icon: "horse",
  },
  {
    playerId: "3f7bd706-07c7-44a8-b5e9-f0efe89f1be0",
    username: "t123",
    color: "#7b8760",
    icon: "tiger",
  },
  {
    playerId: "3f7bd706-07c8-44a8-b5e9-f0efe89f1be0",
    username: "m0",
    color: "#1b8760",
    icon: "bunny",
  },
  {
    playerId: "3f7bd706-07c9-44a8-b5e9-f0efe89f1be0",
    username: "t10",
    color: "#ff8710",
    icon: "elephant",
  },
  {
    playerId: "3f7bd706-07c1-44a8-b5e9-f0efe89f1be0",
    username: "10",
    color: "#db8d60",
    icon: "cat",
  },
  {
    playerId: "3f7bd706-07c2-44a8-b5e9-f0efe89f1be0",
    username: "liam99",
    color: "#eb8a69",
    icon: "unicorn",
  },
];

export const BAD_ASCII = `./\\|[]():;"&*^%$#@+={}~!?><,` as const;
