import React from 'react';
import { GameGrid, Move } from '../types';
// import './Grid.css';

interface Props {
	grid: GameGrid;
	onCellClick: (move: Move) => void;
}

export const Grid: React.FC<Props> = ({ grid, onCellClick }) => {
	return (
		<div className='grid grid-cols-4 gap-1'>
			{grid.map((row, rowIndex) =>
				row.map((cell, colIndex) => (
					<div
						key={`${rowIndex}-${colIndex}`}
						className={`w-12 h-12 border rounded ${
							cell ? `bg-${cell}-500` : 'bg-white'
						}`}
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
