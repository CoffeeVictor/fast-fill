// src/game/game.service.ts
import { Injectable } from '@nestjs/common';
import { COLORS, GameRoom, Move } from 'src/game/types';
import { generateEmptyGrid, generateRoomCode } from 'src/lib/game';

@Injectable()
export class GameService {
  private games: Record<string, GameRoom> = {};

  createGame(playerId: string): string {
    const roomCode = generateRoomCode();
    this.games[roomCode] = {
      grid: generateEmptyGrid(),
      players: [{ color: 'red', count: 0, id: playerId }],
      startTime: Date.now(),
    };

    return roomCode;
  }

  joinGame(playerId: string, roomId: string): boolean {
    const game = this.games[roomId];

    if (!game) return false;

    const gameIsFull = game.players.length >= COLORS.length;

    if (gameIsFull) return false;

    const playerIsAlreadyInGame = game.players.some(
      (player) => player.id === playerId,
    );

    if (playerIsAlreadyInGame) return false;

    game.players.push({
      id: playerId,
      color: COLORS[game.players.length],
      count: 0,
    });

    return true;
  }

  handleSquareClick(playerId: string, roomId: string, { col, row }: Move) {
    const game = this.games[roomId];

    if (!game) return;

    const squareIsAlreadyFilled = game.grid[row][col] !== null;

    if (squareIsAlreadyFilled) return;

    const player = game.players.find((player) => player.id === playerId);

    if (player) {
      game.grid[row][col] = player.color;
      player.count++;
    }
  }

  getGameState(roomId: string) {
    const game = this.games[roomId];

    if (!game) return;
    return {
      grid: game.grid,
      players: game.players,
      elapsedTime: Math.floor((Date.now() - game.startTime) / 1000),
    };
  }
}
