import React from 'react';
import { Color, GameGrid, Move } from '../types';
// import './Grid.css';

interface Props {
	grid: GameGrid;
	onCellClick: (move: Move) => void;
}

function getBGFromColor(color: Color | null): string {
	if (!color) return 'bg-white';

	const map: Record<Color, string> = {
		blue: 'bg-blue-500',
		red: 'bg-red-500',
	};

	return map[color];
}

export const Grid: React.FC<Props> = ({ grid, onCellClick }) => {
	return (
		<div className='grid grid-cols-4 gap-1'>
			{grid.map((row, rowIndex) =>
				row.map((cell, colIndex) => (
					<div
						key={`${rowIndex}-${colIndex}`}
						className={`w-12 h-12 border rounded ${getBGFromColor(
							cell
						)} cursor-pointer hover:brightness-90 transition-all`}
						onClick={() =>
							onCellClick({
								row: rowIndex,
								col: colIndex,
							})
						}
					/>
				))
			)}
		</div>
	);
};
