import { useEffect, useState } from 'react';
import { Grid } from './components/Grid';
import { PlayerStats } from './components/PlayerStats';
import { socket } from './socket';
import { GameState, Move } from './types';

function App() {
	const [view, setView] = useState<'home' | 'game'>('home');
	const [roomCode, setRoomCode] = useState('');
	const [inputRoomCode, setInputRoomCode] = useState('');
	const [gameState, setGameState] = useState<GameState | null>(null);
	const [localElapsed, setLocalElapsed] = useState<number>(0);
	const [timerRef, setTimerRef] = useState<number | null>(null);
	const [myId, setMyId] = useState('');

	useEffect(() => {
		socket.on('connect', () => {
			if (!socket.id) throw new Error('Socked id not defined.');
			setMyId(socket.id);
		});
		socket.on('gameCreated', ({ roomCode }) => {
			setRoomCode(roomCode);
			setView('game');
		});
		socket.on('stateUpdate', (state: GameState) => {
			setGameState(state);

			if (timerRef) clearInterval(timerRef);

			setLocalElapsed(state.elapsedTime);

			const interval = setInterval(() => {
				setLocalElapsed((prev) => prev + 1);
			}, 1000);
			setTimerRef(interval);
		});
		socket.on('error', (msg: string) => {
			alert(msg);
		});
		socket.on('gameOver', ({ winner }) => {
			if (winner === 'draw') {
				alert("🟰 It's a draw!");
			} else if (winner === myId) {
				alert('🏆 You won!');
			} else {
				const winnerColor =
					gameState?.players.find((p) => p.id === winner)?.color ||
					'Unknown';
				alert(`🎉 ${winnerColor} player wins!`);
			}
		});

		return () => {
			socket.off('connect');
			socket.off('gameCreated');
			socket.off('stateUpdate');
			socket.off('error');
			socket.off('gameOver');
			if (timerRef) clearInterval(timerRef);
		};
	}, [timerRef]);

	const handleCreateGame = () => {
		socket.emit('createGame');
	};

	const handleJoinGame = () => {
		if (inputRoomCode.trim().length !== 6) {
			alert('Please enter a valid 6-digit game code.');
			return;
		}
		setRoomCode(inputRoomCode.trim());
		socket.emit('joinGame', { roomCode: inputRoomCode.trim() });
		setView('game');
	};

	const handleCellClick = ({ col, row }: Move) => {
		socket.emit('click', { roomCode, row, col });
	};

	if (view === 'home') {
		return (
			<div className='p-4 max-w-sm mx-auto'>
				<h1 className='text-2xl font-bold mb-4'>🎮 Fast-Fill</h1>
				<button
					onClick={handleCreateGame}
					className='bg-blue-500 text-white px-4 py-2 rounded w-full cursor-pointer hover:brightness-90 transition-all mb-4'
				>
					Create Game
				</button>
				<div className='mb-2 text-center text-gray-500'>or</div>
				<input
					value={inputRoomCode}
					onChange={(e) => setInputRoomCode(e.target.value)}
					placeholder='Enter 6-digit game code'
					className='border px-3 py-2 w-full rounded mb-2'
				/>
				<button
					onClick={handleJoinGame}
					className='bg-green-500 text-white px-4 py-2 rounded w-full cursor-pointer hover:brightness-90 transition-all'
				>
					Join Game
				</button>
			</div>
		);
	}

	if (!gameState) return <div className='p-4'>Waiting for game state...</div>;

	return (
		<div className='p-4 max-w-md mx-auto'>
			<div className='text-sm text-gray-400 mb-2'>
				Game Code: {roomCode}
			</div>
			<Grid grid={gameState.grid} onCellClick={handleCellClick} />
			<PlayerStats players={gameState.players} myId={myId} />
			<div className='mt-2 text-gray-700'>⏱ Elapsed: {localElapsed}s</div>
		</div>
	);
}

export default App;
