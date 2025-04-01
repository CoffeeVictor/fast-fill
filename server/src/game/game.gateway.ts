// src/game/game.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  private server: Server;

  @SubscribeMessage('createGame')
  async handleCreateGame(@ConnectedSocket() client: Socket) {
    const roomCode = this.gameService.createGame(client.id);
    await client.join(roomCode);
    client.emit('gameCreated', { roomCode });
    const state = this.gameService.getGameState(roomCode);
    this.server.to(roomCode).emit('stateUpdate', state);
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() data: { roomCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    const success = this.gameService.joinGame(client.id, data.roomCode);
    if (success) {
      await client.join(data.roomCode);
      const state = this.gameService.getGameState(data.roomCode);
      this.server.to(data.roomCode).emit('stateUpdate', state);
    } else {
      client.emit('error', 'Invalid or full game');
    }
  }

  @SubscribeMessage('click')
  handleClick(
    @MessageBody() data: { roomCode: string; row: number; col: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.handleSquareClick(client.id, data.roomCode, {
      col: data.col,
      row: data.row,
    });
    const state = this.gameService.getGameState(data.roomCode);
    this.server.to(data.roomCode).emit('stateUpdate', state);
  }

  afterInit(server: Server) {
    this.server = server;
  }
}
