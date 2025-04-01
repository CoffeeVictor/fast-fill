import React from 'react';
import { GridCell } from '../types';
// import './Grid.css';

interface Props {
	grid: GridCell[][];
	onCellClick: (row: number, col: number) => void;
}

export const Grid: React.FC<Props> = ({ grid, onCellClick }) => {
	console.log('Grid:', grid);
	return (
		<div className='grid grid-cols-4 gap-1'>
			{grid.map((row, rowIndex) =>
				row.map((cell, colIndex) => (
					<div
						key={`${rowIndex}-${colIndex}`}
						className={`w-12 h-12 border rounded ${
							cell ? `bg-${cell}-500` : 'bg-white'
						}`}
						onClick={() => onCellClick(rowIndex, colIndex)}
					/>
				))
			)}
		</div>
	);
};
