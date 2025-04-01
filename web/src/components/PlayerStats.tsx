import React from 'react';
import { Player } from '../types';
interface Props {
	players: Player[];
	myId: string;
}

export const PlayerStats: React.FC<Props> = ({ players, myId }) => {
	return (
		<div className='mt-4'>
			{players.map((p) => (
				<div key={p.id} className={`text-${p.color}-500`}>
					{p.color}: <strong>{p.count}</strong>{' '}
					{p.id === myId ? '← You' : ''}
				</div>
			))}
		</div>
	);
};
