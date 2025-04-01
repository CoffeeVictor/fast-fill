import { useEffect, useState } from 'react';
import { Grid } from './components/Grid';
import { PlayerStats } from './components/PlayerStats';
import { socket } from './socket';
import { GameState } from './types';

function App() {
	const [gameState, setGameState] = useState<GameState | null>(null);
	const [myId, setMyId] = useState<string>('');

	useEffect(() => {
		socket.on('connect', () => {
			if (!socket.id) throw new Error('Socket id not defined.');

			setMyId(socket.id);
		});

		socket.on('stateUpdate', (state: GameState) => {
			setGameState(state);
		});

		return () => {
			socket.off('connect');
			socket.off('stateUpdate');
		};
	}, []);

	const handleCellClick = (row: number, col: number) => {
		socket.emit('click', { row, col });
	};

	if (!gameState) return <div>Waiting for game state...</div>;

	return (
		<div className='p-4'>
			<Grid grid={gameState.grid} onCellClick={handleCellClick} />
			<PlayerStats players={gameState.players} myId={myId} />
			<div className='mt-2 text-gray-700'>
				⏱ Elapsed: {gameState.elapsedTime}s
			</div>
		</div>
	);
}

export default App;
