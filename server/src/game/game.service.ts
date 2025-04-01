// src/game/game.service.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface Player {
  id: string;
  color: string;
  count: number;
}

@Injectable()
export class GameService {
  private players: Player[] = [];
  private grid: (string | null)[][] = Array.from(
    { length: 4 },
    () => Array(4).fill(null) as (string | null)[],
  );
  private startTime: number = Date.now();

  private COLORS = ['red', 'blue'];

  addPlayer(client: Socket) {
    if (this.players.length < this.COLORS.length) {
      this.players.push({
        id: client.id,
        color: this.COLORS[this.players.length],
        count: 0,
      });
    }
  }

  removePlayer(client: Socket) {
    this.players = this.players.filter((p) => p.id !== client.id);
  }

  handleSquareClick(
    client: Socket,
    { row, col }: { row: number; col: number },
  ) {
    if (!this.grid[row][col]) {
      const player = this.players.find((p) => p.id === client.id);
      if (player) {
        this.grid[row][col] = player.color;
        player.count++;
      }
    }
  }

  getGameState() {
    return {
      grid: this.grid,
      players: this.players,
      elapsedTime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }
}
