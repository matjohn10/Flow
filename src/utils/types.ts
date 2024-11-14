export type DrawMove = {
  kind: "start" | "move";
  x: number;
  y: number;
  color: string;
  strokeWidth: number;
};

export type DrawStep = DrawMove[];

export type WindowSize = {
  width: number;
  heigth: number;
};
