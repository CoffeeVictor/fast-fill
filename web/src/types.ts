export type GridCell = string | null;

export interface GameState {
	grid: GridCell[][];
	players: {
		id: string;
		color: string;
		count: number;
	}[];
	elapsedTime: number;
}
