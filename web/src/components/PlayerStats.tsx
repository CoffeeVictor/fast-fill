import React from 'react';
import { Color, Player } from '../types';
interface Props {
	players: Player[];
	myId: string;
}

function getTextFromColor(color: Color): string {
	const map: Record<Color, string> = {
		blue: 'text-blue-500',
		red: 'text-red-500',
	};

	return map[color];
}

export const PlayerStats: React.FC<Props> = ({ players, myId }) => {
	return (
		<div className='mt-4'>
			{players.map((p) => (
				<div key={p.id} className={`${getTextFromColor(p.color)}`}>
					<span
						className={`${p.id === myId && 'underline'} capitalize`}
					>
						{p.color}
					</span>
					: <strong>{p.count}</strong> {p.id === myId ? '← You' : ''}
				</div>
			))}
		</div>
	);
};
