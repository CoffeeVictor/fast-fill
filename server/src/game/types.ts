export type GameRow = (string | null)[];
export type GameGrid = GameRow[];

export const COLORS = ['red', 'blue'] as const;
export type Color = (typeof COLORS)[number];

export type Player = {
  id: string;
  color: Color;
  count: number;
};

export type GameRoom = {
  players: Player[];
  grid: GameGrid;
  startTime: number;
};

export type Move = { row: number; col: number };
