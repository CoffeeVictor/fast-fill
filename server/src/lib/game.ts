import { GameGrid, GameRow } from 'src/game/types';

export function generateRoomCode(): string {
  const randomSixDigitNumber = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  return randomSixDigitNumber;
}

export function generateEmptyGrid(size: number = 4): GameGrid {
  return Array.from({ length: size }, () => Array(size).fill(null) as GameRow);
}
