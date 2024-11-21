import { Player } from "../queries/games";

export type DrawMove = {
  kind: "start" | "move";
  tool: Tool;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
};

export type DrawStep = DrawMove[];

export type WindowSize = {
  width: number;
  heigth: number;
};

export type Tool = "pen" | "eraser" | "square" | "circle" | "line" | "picker";

export type ShowingContent = {
  id: number;
  content: string;
  from: Player;
};
